"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { saveCustomer, initializeStorage } from "@/lib/storage"
import { validateCPFOrCNPJ, validatePhone, validateEmail, formatPhone } from "@/lib/validators"
import { useToast } from "@/hooks/use-toast"
import type { Customer } from "@/lib/types"

export default function NewCustomerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpfCnpj: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Telefone inválido"
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
      initializeStorage()

      const newCustomer: Customer = {
        id: `CUST${Date.now()}`,
        ...formData,
      }

      saveCustomer(newCustomer)

      toast({
        title: "Cliente cadastrado!",
        description: `${formData.name} foi adicionado com sucesso`,
      })

      router.push("/customers")
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível cadastrar o cliente",
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
      formattedValue = formatPhone(value)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
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
                    className={errors.phone ? "border-destructive" : ""}
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
                    className={errors.cpfCnpj ? "border-destructive" : ""}
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
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rua das Flores, 123"
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

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="01234-567"
                />
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
