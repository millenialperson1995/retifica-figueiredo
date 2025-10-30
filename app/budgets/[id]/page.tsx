"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft, User, Car, Calendar, FileText, CheckCircle, XCircle, Loader2, Download } from "lucide-react"
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
import AuthGuard from "@/components/auth-guard"
import { apiService } from "@/lib/api"
import { AppHeader } from "@/components/app-header"
import { Budget, Customer, Vehicle } from "@/lib/types"
import { useBudgetPDF } from "@/components/pdf/useBudgetPDF";

export default function BudgetDetailPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <BudgetDetailContent params={params} />
    </AuthGuard>
  );
}

function BudgetDetailContent({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  const { id } = params;

  // Componente para o botão de download do PDF
  const BudgetPDFButton = ({ budget, customer, vehicle }: { budget: Budget, customer: Customer | null, vehicle: Vehicle | null }) => {
    // Verificar se os dados necessários estão presentes
    if (!customer || !vehicle) {
      return null; // ou um botão desabilitado com mensagem explicativa
    }

    const { instance, downloadPDF } = useBudgetPDF({
      budget,
      customer,
      vehicle,
    });

    return (
      <Button 
        variant="outline" 
        className="w-full"
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const budgetData = await apiService.getBudgetById(id);
        
        if (!budgetData) {
          notFound();
          return;
        }

        budgetData.date = new Date(budgetData.date);
        setBudget(budgetData);

        let customerData = null;
        let vehicleData = null;
        
        try {
          customerData = await apiService.getCustomerById(budgetData.customerId);
        } catch (customerError) {
          console.error("Error fetching customer:", customerError);
          toast({
            title: "Aviso",
            description: "Não foi possível carregar os dados do cliente associado a este orçamento.",
            variant: "destructive",
          });
        }

        try {
          vehicleData = await apiService.getVehicleById(budgetData.vehicleId);
        } catch (vehicleError) {
          console.error("Error fetching vehicle:", vehicleError);
          toast({
            title: "Aviso",
            description: "Não foi possível carregar os dados do veículo associado a este orçamento.",
            variant: "destructive",
          });
        }

        setCustomer(customerData);
        setVehicle(vehicleData);

      } catch (error: any) {
        console.error("Error fetching budget details:", error);
        
        if (error.message && (error.message.includes('404') || error.message.includes('not found'))) {
          toast({
            title: "Orçamento não encontrado",
            description: "O orçamento solicitado não existe ou você não tem permissão para acessá-lo.",
            variant: "destructive",
          });
          notFound();
        } else {
          toast({
            title: "Erro ao carregar orçamento",
            description: "Ocorreu um erro ao tentar carregar os dados do orçamento.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, toast]);

  const handleApprove = async () => {
    if (!budget) return;
    try {
      const updatedBudget = { ...budget, status: "approved" };
      await apiService.updateBudget(id, updatedBudget);

      toast({
        title: "Orçamento aprovado!",
        description: "Você será redirecionado para criar a ordem de serviço.",
      });

      setShowApproveDialog(false);
      router.push(`/orders/new?budgetId=${id}`);
    } catch (error) {
      console.error("Error approving budget:", error);
      toast({
        title: "Erro ao aprovar",
        description: "Não foi possível aprovar o orçamento.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!budget) return;
    try {
      const updatedBudget = { ...budget, status: "rejected" };
      await apiService.updateBudget(id, updatedBudget);

      toast({
        title: "Orçamento rejeitado",
        description: "O orçamento foi marcado como rejeitado.",
        variant: "destructive",
      });

      setShowRejectDialog(false);
      router.push("/budgets");
    } catch (error) {
      console.error("Error rejecting budget:", error);
      toast({
        title: "Erro ao rejeitar",
        description: "Não foi possível rejeitar o orçamento.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-2 text-lg">
            <Loader2 className="w-6 h-6 animate-spin" />
            Carregando orçamento...
          </div>
        </div>
      </>
    );
  }

  if (!budget) {
    return null;
  }

  return (
    <>
    <AppHeader />
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/budgets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <PageHeader title={`Orçamento #${budget.id.slice(-6).toUpperCase()}`} description="Detalhes do orçamento" />
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

            {customer ? (
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Cliente</div>
                  <Link href={`/customers/${customer.id}`} className="text-sm font-medium hover:underline">
                    {customer.name}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Cliente</div>
                  <div className="text-sm font-medium text-muted-foreground">Cliente não encontrado</div>
                </div>
              </div>
            )}

            {vehicle ? (
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Veículo</div>
                  <div className="text-sm font-medium">
                    {vehicle.brand} {vehicle.model} - {vehicle.plate}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Car className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Veículo</div>
                  <div className="text-sm font-medium text-muted-foreground">Veículo não encontrado</div>
                </div>
              </div>
            )}

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
        {budget.services && budget.services.length > 0 && (
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
        )}

        {/* Parts */}
        {budget.parts && budget.parts.length > 0 && (
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
        )}

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
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Link href={`/budgets/${id}/edit`}>
              <Button variant="outline" className="flex-1">
                Editar
              </Button>
            </Link>
            {budget.status === "pending" && (
              <div className="flex gap-2 flex-1">
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
          </div>

          {budget.status === "approved" && (
            <Link href={`/orders/new?budgetId=${id}`}>
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Criar Ordem de Serviço
              </Button>
            </Link>
          )}
          
          {/* Botão de download do PDF */}
          <BudgetPDFButton budget={budget} customer={customer} vehicle={vehicle} />
        </div>

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
    </>
  )
}
