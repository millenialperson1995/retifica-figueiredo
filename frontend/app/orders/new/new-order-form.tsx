"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { mockCustomers, mockBudgets, getVehiclesByCustomerId, getBudgetById } from "@/lib/mock-data"
import type { ServiceItem, PartItem } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NewOrderForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedBudgetId = searchParams.get("budgetId")

  const [budgetId, setBudgetId] = useState(preselectedBudgetId || "defaultBudgetId")
  const [customerId, setCustomerId] = useState("defaultCustomerId")
  const [vehicleId, setVehicleId] = useState("defaultVehicleId")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [estimatedEndDate, setEstimatedEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const [mechanicNotes, setMechanicNotes] = useState("")
  const [services, setServices] = useState<ServiceItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 },
  ])
  const [parts, setParts] = useState<PartItem[]>([
    { id: "1", description: "", partNumber: "", quantity: 1, unitPrice: 0, total: 0 },
  ])

  const vehicles = customerId ? getVehiclesByCustomerId(customerId) : []

  // Load budget data if budgetId is provided
  useEffect(() => {
    if (budgetId) {
      const budget = getBudgetById(budgetId)
      if (budget) {
        setCustomerId(budget.customerId)
        setVehicleId(budget.vehicleId)
        setServices(budget.services)
        setParts(budget.parts)
        if (budget.notes) setNotes(budget.notes)
      }
    }
  }, [budgetId])

  useEffect(() => {
    if (customerId && vehicles.length > 0 && !vehicleId) {
      setVehicleId(vehicles[0].id)
    }
  }, [customerId, vehicles, vehicleId])

  const addService = () => {
    setServices([...services, { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const removeService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const updateService = (id: string, field: keyof ServiceItem, value: string | number) => {
    setServices(
      services.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updated.total = Number(updated.quantity) * Number(updated.unitPrice)
          }
          return updated
        }
        return s
      }),
    )
  }

  const addPart = () => {
    setParts([
      ...parts,
      { id: Date.now().toString(), description: "", partNumber: "", quantity: 1, unitPrice: 0, total: 0 },
    ])
  }

  const removePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id))
  }

  const updatePart = (id: string, field: keyof PartItem, value: string | number) => {
    setParts(
      parts.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updated.total = Number(updated.quantity) * Number(updated.unitPrice)
          }
          return updated
        }
        return p
      }),
    )
  }

  const total = [...services, ...parts].reduce((sum, item) => sum + item.total, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to a database
    console.log("New order:", {
      budgetId,
      customerId,
      vehicleId,
      startDate,
      estimatedEndDate,
      services,
      parts,
      notes,
      mechanicNotes,
      total,
    })
    router.push("/orders")
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <PageHeader title="Nova Ordem de Serviço" description="Crie uma nova OS" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Budget Selection (Optional) */}
          {!preselectedBudgetId && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orçamento (Opcional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="budget">Selecionar Orçamento Aprovado</Label>
                  <Select value={budgetId} onValueChange={setBudgetId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum (criar do zero)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defaultBudgetId">Nenhum (criar do zero)</SelectItem>
                      {mockBudgets
                        .filter((b) => b.status === "approved")
                        .map((budget) => (
                          <SelectItem key={budget.id} value={budget.id}>
                            Orçamento #{budget.id} -{" "}
                            {budget.total.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customer and Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cliente e Veículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Cliente *</Label>
                <Select value={customerId} onValueChange={setCustomerId} required disabled={!!budgetId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {customerId && vehicles.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Veículo *</Label>
                  <Select value={vehicleId} onValueChange={setVehicleId} required disabled={!!budgetId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} - {vehicle.plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedEndDate">Previsão de Término *</Label>
                  <Input
                    id="estimatedEndDate"
                    type="date"
                    value={estimatedEndDate}
                    onChange={(e) => setEstimatedEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Serviços</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addService}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service, index) => (
                <div key={service.id} className="space-y-3 p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Serviço {index + 1}</span>
                    {services.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeService(service.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição *</Label>
                    <Input
                      value={service.description}
                      onChange={(e) => updateService(service.id, "description", e.target.value)}
                      placeholder="Ex: Retífica de motor completa"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Qtd *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={service.quantity}
                        onChange={(e) => updateService(service.id, "quantity", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor Unit. *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={service.unitPrice}
                        onChange={(e) => updateService(service.id, "unitPrice", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        value={service.total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Parts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Peças</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addPart}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {parts.map((part, index) => (
                <div key={part.id} className="space-y-3 p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Peça {index + 1}</span>
                    {parts.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removePart(part.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição *</Label>
                    <Input
                      value={part.description}
                      onChange={(e) => updatePart(part.id, "description", e.target.value)}
                      placeholder="Ex: Jogo de juntas do motor"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Código da Peça</Label>
                    <Input
                      value={part.partNumber}
                      onChange={(e) => updatePart(part.id, "partNumber", e.target.value)}
                      placeholder="Ex: JG-001"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Qtd *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={part.quantity}
                        onChange={(e) => updatePart(part.id, "quantity", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor Unit. *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={part.unitPrice}
                        onChange={(e) => updatePart(part.id, "unitPrice", Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Total</Label>
                      <Input
                        value={part.total.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre a ordem de serviço"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mechanicNotes">Anotações do Mecânico</Label>
                <Textarea
                  id="mechanicNotes"
                  value={mechanicNotes}
                  onChange={(e) => setMechanicNotes(e.target.value)}
                  placeholder="Observações técnicas durante o serviço"
                  rows={3}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/orders" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={!customerId || !vehicleId || !estimatedEndDate}>
              Criar Ordem de Serviço
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
