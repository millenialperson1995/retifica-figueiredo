"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft, User, Car, Calendar, Clock, FileText, CheckCircle, XCircle, PlayCircle, AlertCircle, Loader2, Download } from "lucide-react"
import { apiService } from "@/lib/api"
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
import AuthGuard from "@/components/auth-guard"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { useOrderPDF } from "@/components/pdf/useOrderPDF";

// Interfaces to match data structure (should match types in lib/types.ts)
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  referencia?: string; // Ponto de referência opcional
  userId: string;
  createdAt: Date;
}

interface Vehicle {
  id: string;
  customerId: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  engine: string; // Motor do veículo
  cylinder: string; // Cilindro do veículo
  chassisNumber: string; // Número do chassi
  userId: string;
}

interface Order {
  id: string;
  customerId: string;
  vehicleId: string;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  userId: string;
  services: { id: string; description: string; quantity: number; unitPrice: number; total: number }[];
  parts: { id: string; description: string; partNumber?: string; quantity: number; unitPrice: number; total: number }[];
  total: number;
  notes?: string;
  mechanicNotes?: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params)
  return (
    <AuthGuard>
      <OrderDetailContent id={resolvedParams.id} />
    </AuthGuard>
  )
}

function OrderDetailContent({ id }: { id: string }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showStatusDialog, setShowStatusDialog] = useState<"completed" | "cancelled" | null>(null)

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError("ID da ordem de serviço inválido.")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const orderData = await apiService.getOrderById(id)
        setOrder(orderData)

        const [customerData, vehicleData] = await Promise.all([
          apiService.getCustomerById(orderData.customerId),
          apiService.getVehicleById(orderData.vehicleId),
        ])
        setCustomer(customerData)
        setVehicle(vehicleData)
      } catch (err) {
        setError("Falha ao carregar os dados da ordem de serviço.")
        console.error(err)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleStatusUpdate = async (newStatus: "completed" | "cancelled" | "in-progress") => {
    if (!order) return

    try {
      const updatedOrder = await apiService.updateOrder(id, { status: newStatus })
      setOrder(updatedOrder)
      setShowStatusDialog(null)
      toast({
        title: "Status atualizado!",
        description: `A ordem de serviço foi marcada como ${newStatus === 'completed' ? 'concluída' : newStatus === 'cancelled' ? 'cancelada' : 'em andamento'}.`,
      })
    } catch (err) {
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da OS. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <OrderSkeleton />
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
        <PageHeader title="Erro" description={error} />
        <Link href="/orders">
          <Button variant="outline">Voltar para Ordens de Serviço</Button>
        </Link>
      </div>
    )
  }

  if (!order || !customer || !vehicle) {
    notFound()
  }

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case "completed": return "default"
      case "in-progress": return "secondary"
      case "cancelled": return "destructive"
      default: return "outline"
    }
  }

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case "completed": return "Concluída"
      case "in-progress": return "Em Andamento"
      case "cancelled": return "Cancelada"
      default: return "Pendente"
    }
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/orders" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-grow">
            <PageHeader title={`OS #${order.id.slice(-6).toUpperCase()}`} description="Detalhes da ordem de serviço" />
          </div>
          <Badge variant={getStatusVariant(order.status)}>{getStatusLabel(order.status)}</Badge>
        </div>

        {/* Quick Actions based on status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {order.status === 'pending' && (
            <Button className="w-full sm:col-span-3" onClick={() => handleStatusUpdate('in-progress')}>
              <PlayCircle className="w-4 h-4 mr-2" />
              Iniciar Serviço
            </Button>
          )}
          {order.status === 'in-progress' && (
            <>
              <Button variant="destructive" className="w-full" onClick={() => setShowStatusDialog('cancelled')}>
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button className="w-full sm:col-span-2" onClick={() => setShowStatusDialog('completed')}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Concluir Serviço
              </Button>
            </>
          )}
        </div>

        {/* Order Info */}
        <Card className="mb-4">
          <CardHeader><CardTitle className="text-base">Informações</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoItem icon={Calendar} label="Data de Início" value={new Date(order.startDate).toLocaleDateString("pt-BR")} />
            <InfoItem icon={Clock} label="Previsão de Término" value={new Date(order.estimatedEndDate).toLocaleDateString("pt-BR")} />
            {order.actualEndDate && <InfoItem icon={CheckCircle} label="Data de Conclusão" value={new Date(order.actualEndDate).toLocaleDateString("pt-BR")} />}
            <InfoItem icon={User} label="Cliente" value={<Link href={`/customers/${customer.id}`} className="hover:underline">{customer.name}</Link>} />
            <InfoItem icon={Car} label="Veículo" value={`${vehicle.brand} ${vehicle.model} - ${vehicle.plate}`} />
            {order.notes && <InfoItem icon={FileText} label="Observações" value={order.notes} />}
            {order.mechanicNotes && <InfoItem icon={FileText} label="Anotações do Mecânico" value={order.mechanicNotes} />}
          </CardContent>
        </Card>

        {/* Services and Parts */}
        <ListItemCard title="Serviços" items={order.services} />
        <ListItemCard title="Peças" items={order.parts} />

        {/* Total */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>{order.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>
          </CardContent>
        </Card>

        {/* PDF Download Button */}
        <PDFDownloadButton order={order} customer={customer} vehicle={vehicle} />
        
        <Link href={`/orders/${id}/edit`} passHref>
          <Button variant="outline" className="w-full">Editar</Button>
        </Link>
      </div>

      {/* Dialogs */}
      <AlertDialog open={!!showStatusDialog} onOpenChange={() => setShowStatusDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {showStatusDialog === 'completed' ? 'Concluir Ordem de Serviço?' : 'Cancelar Ordem de Serviço?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {showStatusDialog === 'completed'
                ? "Esta ação marcará a OS como concluída. O cliente poderá ser notificado."
                : "Tem certeza que deseja cancelar esta OS? Esta ação não pode ser desfeita."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusUpdate(showStatusDialog!)}
              className={showStatusDialog === 'cancelled' ? "bg-destructive text-destructive-foreground" : ""}
            >
              {showStatusDialog === 'completed' ? 'Concluir' : 'Sim, Cancelar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Helper components
function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 pt-3 border-t border-border first:pt-0 first:border-0">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  )
}

function ListItemCard({ title, items }: { title: string, items: { id: string, description: string, quantity: number, unitPrice: number, total: number }[] }) {
  if (items.length === 0) return null
  return (
    <Card className="mb-4">
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between pb-3 border-b border-border last:border-0 last:pb-0 text-sm">
              <div className="flex-1 pr-4">
                <div className="font-medium">{item.description}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.quantity} × {item.unitPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
              <div className="font-semibold">
                {item.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para o botão de download do PDF
const PDFDownloadButton = ({ order, customer, vehicle }: { order: Order, customer: Customer, vehicle: Vehicle }) => {
  // Verificar se os dados necessários estão presentes
  if (!customer || !vehicle || !order) {
    return null; // ou um botão desabilitado com mensagem explicativa
  }

  const { instance, downloadPDF } = useOrderPDF({
    order,
    customer,
    vehicle,
  });

  return (
    <Button 
      variant="outline" 
      className="w-full mb-2"
      onClick={downloadPDF}
      disabled={instance.loading}
    >
      {instance.loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Gerando PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Baixar PDF
        </>
      )}
    </Button>
  );
};

function OrderSkeleton() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-grow">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        <Skeleton className="h-10 w-full sm:col-span-3" />
      </div>
      <Card className="mb-4">
        <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}