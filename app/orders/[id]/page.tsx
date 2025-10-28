"use client"

import { useState } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft, User, Car, Calendar, Clock, FileText, CheckCircle, XCircle, PlayCircle } from "lucide-react"
import { getOrderById, getCustomerById, getVehicleById } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const order = getOrderById(params.id)
  const [status, setStatus] = useState(order?.status || "pending")
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  if (!order) {
    notFound()
  }

  const customer = getCustomerById(order.customerId)
  const vehicle = getVehicleById(order.vehicleId)

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === "completed") {
      setShowCompleteDialog(true)
    } else if (newStatus === "cancelled") {
      setShowCancelDialog(true)
    } else {
      setStatus(newStatus)
      // In a real app, this would update the database
      console.log("Updating order status:", params.id, newStatus)
    }
  }

  const handleComplete = () => {
    setStatus("completed")
    setShowCompleteDialog(false)
    // In a real app, this would update the database
    console.log("Completing order:", params.id)
  }

  const handleCancel = () => {
    setStatus("cancelled")
    setShowCancelDialog(false)
    // In a real app, this would update the database
    console.log("Cancelling order:", params.id)
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
          <PageHeader title={`OS #${order.id}`} description="Detalhes da ordem de serviço" />
        </div>

        {/* Status Management */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Order Info */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Data de Início</div>
                <div className="text-sm font-medium">{order.startDate.toLocaleDateString("pt-BR")}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">Previsão de Término</div>
                <div className="text-sm font-medium">{order.estimatedEndDate.toLocaleDateString("pt-BR")}</div>
              </div>
            </div>

            {order.actualEndDate && (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-xs text-muted-foreground">Data de Conclusão</div>
                  <div className="text-sm font-medium">{order.actualEndDate.toLocaleDateString("pt-BR")}</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-border">
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

            {order.notes && (
              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Observações</div>
                  <div className="text-sm">{order.notes}</div>
                </div>
              </div>
            )}

            {order.mechanicNotes && (
              <div className="flex items-start gap-3 pt-3 border-t border-border">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-xs text-muted-foreground">Anotações do Mecânico</div>
                  <div className="text-sm">{order.mechanicNotes}</div>
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
              {order.services.map((service) => (
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
              {order.parts.map((part) => (
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
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>
                {order.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {status === "pending" && (
          <Button className="w-full" onClick={() => handleStatusChange("in-progress")}>
            <PlayCircle className="w-4 h-4 mr-2" />
            Iniciar Serviço
          </Button>
        )}

        {status === "in-progress" && (
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={() => handleStatusChange("cancelled")}>
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button className="flex-1" onClick={() => handleStatusChange("completed")}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Concluir
            </Button>
          </div>
        )}

        {/* Complete Dialog */}
        <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Concluir Ordem de Serviço</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja marcar esta ordem de serviço como concluída? O cliente será notificado.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleComplete}>Concluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Cancel Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar Ordem de Serviço</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja cancelar esta ordem de serviço? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Voltar</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancel} className="bg-destructive text-destructive-foreground">
                Cancelar OS
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
