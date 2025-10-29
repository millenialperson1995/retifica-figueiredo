"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import AuthGuard from "@/components/auth-guard";

export default function NewVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AuthGuard>
      <NewVehicleContent params={params} />
    </AuthGuard>
  );
}

function NewVehicleContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const router = useRouter()
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    plate: "",
    brand: "",
    model: "",
    year: "",
    color: "",
    engineNumber: "",
    chassisNumber: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create a new vehicle object with form data
      const vehicleData = {
        customerId: id, // Use the customer ID from params
        plate: formData.plate,
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        color: formData.color,
        engineNumber: formData.engineNumber,
        chassisNumber: formData.chassisNumber,
        notes: formData.notes,
      }
      
      // Send the vehicle data to the API
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      })
      
      if (response.ok) {
        toast({
          title: "Sucesso!",
          description: "Veículo cadastrado com sucesso!",
        })
        // Redirect back to the customer page
        router.push(`/customers/${id}`)
        router.refresh() // Refresh to show the new vehicle
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro!",
          description: errorData.message || "Erro ao cadastrar veículo",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating vehicle:", error)
      toast({
        title: "Erro!",
        description: "Erro de conexão ao cadastrar veículo",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/customers/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <PageHeader title="Novo Veículo" description="Cadastre um novo veículo" />
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa *</Label>
                  <Input
                    id="plate"
                    name="plate"
                    value={formData.plate}
                    onChange={handleChange}
                    placeholder="ABC-1234"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Ano *</Label>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2020"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca *</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Volkswagen"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo *</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Gol"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Cor *</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Prata"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engineNumber">Número do Motor</Label>
                <Input
                  id="engineNumber"
                  name="engineNumber"
                  value={formData.engineNumber}
                  onChange={handleChange}
                  placeholder="ABC123456"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chassisNumber">Número do Chassi</Label>
                <Input
                  id="chassisNumber"
                  name="chassisNumber"
                  value={formData.chassisNumber}
                  onChange={handleChange}
                  placeholder="9BWZZZ377VT004251"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Informações adicionais sobre o veículo"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 mt-6">
            <Link href={`/customers/${id}`} className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent" disabled={isSubmitting}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Veículo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
