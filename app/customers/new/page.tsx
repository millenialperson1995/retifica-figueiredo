"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { validateCPFOrCNPJ, validatePhone, validateEmail, formatPhone, formatCPFOrCNPJ } from "@/lib/validators"
import { useToast } from "@/hooks/use-toast"
import type { Customer } from "@/lib/types"

import AuthGuard from "@/components/auth-guard";

export default function NewCustomerPage() {
  return (
    <AuthGuard>
      <NewCustomerContent />
    </AuthGuard>
  );
}

function NewCustomerContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [validations, setValidations] = useState<Record<string, boolean | null>>({
    phone: null,
    cpfCnpj: null,
  })
  const [loadingCep, setLoadingCep] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpfCnpj: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    referencia: "",
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Telefone inválido (falta o dígito 9 após DDD para celulares)"
    }

    if (!formData.cpfCnpj.trim()) {
      newErrors.cpfCnpj = "CPF/CNPJ é obrigatório"
    } else if (!validateCPFOrCNPJ(formData.cpfCnpj)) {
      newErrors.cpfCnpj = "CPF/CNPJ inválido"
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "E-mail inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create customer' }));
        throw new Error(errorData.error);
      }

      toast({
        title: "Cliente cadastrado!",
        description: `${formData.name} foi adicionado com sucesso`,
      })

      router.push("/customers")
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: (error as Error).message || "Não foi possível cadastrar o cliente. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    let formattedValue = value
    if (name === "phone") {
      // Limit phone input to digits only and max length
      const digitsOnly = value.replace(/[^\d]/g, "")
      if (digitsOnly.length <= 11) {
        formattedValue = formatPhone(value)
      } else {
        return // Don't update if exceeding max length
      }
    } else if (name === "cpfCnpj") {
      // Limit CPF/CNPJ input to digits only and max length
      const digitsOnly = value.replace(/[^\d]/g, "")
      if (digitsOnly.length <= 14) {
        formattedValue = formatCPFOrCNPJ(value)
      } else {
        return // Don't update if exceeding max length
      }
    } else if (name === "zipCode") {
      // Limit CEP input to digits only and max length of 9 (including optional dash at position 5)
      const digitsOnly = value.replace(/[^\d]/g, "")
      if (digitsOnly.length <= 8) {
        // Format CEP as XXXXX-XXX if it has 8 digits
        if (digitsOnly.length >= 5) {
          formattedValue = digitsOnly.replace(/(\d{5})(\d{3})/, "$1-$2")
        } else {
          formattedValue = digitsOnly
        }
      } else {
        return // Don't update if exceeding max length
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Real-time validation
    if (name === "phone") {
      const digits = value.replace(/[^\d]/g, "")
      if (digits.length === 10 || digits.length === 11) {
        setValidations(prev => ({
          ...prev,
          phone: validatePhone(value)
        }))
      } else {
        // Clear validation if not complete
        setValidations(prev => ({
          ...prev,
          phone: digits.length === 0 ? null : false
        }))
      }
    } else if (name === "cpfCnpj") {
      const digits = value.replace(/[^\d]/g, "")
      if (digits.length === 11 || digits.length === 14) {
        setValidations(prev => ({
          ...prev,
          cpfCnpj: validateCPFOrCNPJ(value)
        }))
      } else {
        // Clear validation if not complete
        setValidations(prev => ({
          ...prev,
          cpfCnpj: digits.length === 0 ? null : false
        }))
      }
    } else if (name === "zipCode") {
      const digits = value.replace(/[^\d]/g, "")
      if (digits.length === 8) {
        // When CEP has 8 digits, trigger the lookup
        lookupCep(value)
      }
    }
  }

  // Function to lookup address by CEP
  const lookupCep = async (cep: string) => {
    // Clean the CEP - remove all non-digit characters
    const cleanedCep = cep.replace(/[^\d]/g, '')
    
    // Validate CEP format (8 digits)
    if (cleanedCep.length !== 8) {
      return
    }

    setLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`)
      if (!response.ok) {
        throw new Error('Erro na consulta do CEP')
      }
      
      const data = await response.json()
      
      if (data.erro) {
        setErrors(prev => ({ ...prev, zipCode: "CEP não encontrado" }))
        return
      }

      // Update form data with address information from API
      setFormData(prev => ({
        ...prev,
        address: data.logradouro || '',
        city: data.localidade || '',
        state: data.uf || '',
        // Keep the original zipCode value as entered by user
      }))

      // Clear any previous error for zipCode
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.zipCode
        return newErrors
      })
    } catch (error) {
      setErrors(prev => ({ ...prev, zipCode: "Erro ao buscar dados do CEP" }))
    } finally {
      setLoadingCep(false)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/customers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <PageHeader title="Novo Cliente" description="Cadastre um novo cliente" />
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 98765-4321"
                    className={`
                      ${errors.phone ? "border-destructive" : 
                        (validations.phone === true ? "border-green-500" : 
                        (validations.phone === false ? "border-destructive" : ""))}
                    `}
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF/CNPJ *</Label>
                  <Input
                    id="cpfCnpj"
                    name="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleChange}
                    placeholder="123.456.789-00"
                    className={`
                      ${errors.cpfCnpj ? "border-destructive" : 
                        (validations.cpfCnpj === true ? "border-green-500" : 
                        (validations.cpfCnpj === false ? "border-destructive" : ""))}
                    `}
                  />
                  {errors.cpfCnpj && <p className="text-xs text-destructive">{errors.cpfCnpj}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="joao@email.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="01234-567"
                  className={errors.zipCode ? "border-destructive" : ""}
                />
                {loadingCep && (
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Buscando endereço...
                  </p>
                )}
                {errors.zipCode && <p className="text-xs text-destructive">{errors.zipCode}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua das Flores, 123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referencia">Ponto de Referência</Label>
                <Input
                  id="referencia"
                  name="referencia"
                  value={formData.referencia}
                  onChange={handleChange}
                  placeholder="Ex: Próximo ao mercado, lado direito da igreja"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="São Paulo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 mt-6">
            <Link href="/customers" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent" disabled={isLoading}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Cliente"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
