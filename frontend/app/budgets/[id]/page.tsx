"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft, User, Car, Calendar, FileText, CheckCircle, XCircle } from "lucide-react"
import { getBudgets, getCustomers, getVehicles, saveBudget, initializeStorage } from "@/lib/storage"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function BudgetDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [budget, setBudget] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [vehicle, setVehicle] = useState<any>(null)

  useEffect(() => {
    initializeStorage()
    const budgets = getBudgets()
    const foundBudget = budgets.find((b) => b.id === params.id)

    if (!foundBudget) {
      notFound()
    }

    setBudget(foundBudget)

    const customers = getCustomers()
    const vehicles = getVehicles()
    setCustomer(customers.find((c) => c.id === foundBudget.customerId))
    setVehicle(vehicles.find((v) => v.id === foundBudget.vehicleId))
  }, [params.id])

  if (!budget) {
    return null
  }

  const handleApprove = () => {
    const updatedBudget = { ...budget, status: "approved" }
    saveBudget(updatedBudget)

    toast({
      title: "Orçamento aprovado!",
      description: "Você será redirecionado para criar a ordem de serviço",
    })

    setShowApproveDialog(false)
    router.push(`/orders/new?budgetId=${params.id}`)
  }

  const handleReject = () => {
    const updatedBudget = { ...budget, status: "rejected" }
    saveBudget(updatedBudget)

    toast({
      title: "Orçamento rejeitado",
      description: "O orçamento foi marcado como rejeitado",
      variant: "destructive",
    })

    setShowRejectDialog(false)
    router.push("/budgets")
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/budgets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <PageHeader title={`Orçamento #${budget.id}`} description="Detalhes do orçamento" />
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <Badge
            variant={
              budget.status === "approved" ? "default" : budget.status === "rejected" ? "destructive" : "secondary"
            }
            className="text-sm"
          >
            {budget.status === "approved" ? "Aprovado" : budget.status === "rejected" ? "Rejeitado" : "Pendente"}
          </Badge>
        </div>

        {/* Budget Info */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Data</div>
                <div className="text-sm font-medium">{budget.date.toLocaleDateString("pt-BR")}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Cliente</div>
                <Link href={`/customers/${customer?.id}`} className="text-sm font-medium hover:underline">
                  {customer?.name}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Car className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Veículo</div>
                <div className="text-sm font-medium">
                  {vehicle?.brand} {vehicle?.model} - {vehicle?.plate}
                </div>
              </div>
            </div>

            {budget.notes && (
              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Observações</div>
                  <div className="text-sm">{budget.notes}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budget.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-start justify-between pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{service.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Quantidade: {service.quantity} ×{" "}
                      {service.unitPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                  </div>
                  <div className="font-semibold text-sm">
                    {service.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Parts */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Peças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {budget.parts.map((part) => (
                <div
                  key={part.id}
                  className="flex items-start justify-between pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{part.description}</div>
                    {part.partNumber && <div className="text-xs text-muted-foreground">Código: {part.partNumber}</div>}
                    <div className="text-xs text-muted-foreground mt-1">
                      Quantidade: {part.quantity} ×{" "}
                      {part.unitPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                  </div>
                  <div className="font-semibold text-sm">
                    {part.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>
                  {budget.subtotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              {budget.discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="text-red-600">
                    -{" "}
                    {budget.discount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span>
                  {budget.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {budget.status === "pending" && (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowRejectDialog(true)}>
              <XCircle className="w-4 h-4 mr-2" />
              Rejeitar
            </Button>
            <Button className="flex-1" onClick={() => setShowApproveDialog(true)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovar
            </Button>
          </div>
        )}

        {budget.status === "approved" && (
          <Link href={`/orders/new?budgetId=${params.id}`}>
            <Button className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Criar Ordem de Serviço
            </Button>
          </Link>
        )}

        {/* Approve Dialog */}
        <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Aprovar Orçamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja aprovar este orçamento? Você será redirecionado para criar uma ordem de serviço.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleApprove}>Aprovar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reject Dialog */}
        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rejeitar Orçamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja rejeitar este orçamento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReject} className="bg-destructive text-destructive-foreground">
                Rejeitar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
