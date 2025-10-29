"use client";

import { useEffect, useState } from "react";
import Link from "next/link"
import { useParams, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft, FileText } from "lucide-react"
import { apiService } from "@/lib/api";

import AuthGuard from "@/components/auth-guard";

export default function VehicleDetailPage() {
  return (
    <AuthGuard>
      <VehicleDetailContent />
    </AuthGuard>
  );
}

function VehicleDetailContent() {
  const params = useParams<{ id: string, vehicleId: string }>();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        if (params.vehicleId) {
          const data = await apiService.getVehicleById(params.vehicleId);
          setVehicle(data);
        }
      } catch (error) {
        console.error("Error fetching vehicle:", error);
        // Handle the error appropriately, maybe redirect or show an error page
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [params.vehicleId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando veículo...</p>
      </div>
    );
  }

  if (!vehicle) {
    notFound();
  }

  // For now using mock data for budgets and orders until those APIs are enhanced
  const { mockBudgets, mockOrders } = require("@/lib/mock-data");
  const vehicleBudgets = mockBudgets.filter((b) => b.vehicleId === params.vehicleId)
  const vehicleOrders = mockOrders.filter((o) => o.vehicleId === params.vehicleId)

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/customers/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <PageHeader title={`${vehicle.brand} ${vehicle.model}`} description={`${vehicle.plate} • ${vehicle.year}`} />
        </div>

        {/* Vehicle Info */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Informações do Veículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Placa</div>
                <div className="text-sm font-medium">{vehicle.plate}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Ano</div>
                <div className="text-sm font-medium">{vehicle.year}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Marca</div>
                <div className="text-sm font-medium">{vehicle.brand}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Modelo</div>
                <div className="text-sm font-medium">{vehicle.model}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Cor</div>
                <div className="text-sm font-medium">{vehicle.color}</div>
              </div>
            </div>

            {vehicle.engineNumber && (
              <div>
                <div className="text-xs text-muted-foreground">Número do Motor</div>
                <div className="text-sm font-medium">{vehicle.engineNumber}</div>
              </div>
            )}

            {vehicle.chassisNumber && (
              <div>
                <div className="text-xs text-muted-foreground">Número do Chassi</div>
                <div className="text-sm font-medium">{vehicle.chassisNumber}</div>
              </div>
            )}

            {vehicle.notes && (
              <div>
                <div className="text-xs text-muted-foreground">Observações</div>
                <div className="text-sm">{vehicle.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Service History */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Histórico de Ordens de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicleOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma ordem de serviço encontrada</p>
            ) : (
              <div className="space-y-3">
                {vehicleOrders.map((order) => (
                  <Link key={order.id} href={`/orders/${order.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">OS #{order.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.startDate.toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {order.total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                        <div
                          className={`text-xs ${
                            order.status === "completed"
                              ? "text-green-600"
                              : order.status === "in-progress"
                                ? "text-blue-600"
                                : order.status === "cancelled"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                          }`}
                        >
                          {order.status === "completed"
                            ? "Concluída"
                            : order.status === "in-progress"
                              ? "Em Andamento"
                              : order.status === "cancelled"
                                ? "Cancelada"
                                : "Pendente"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Budgets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicleBudgets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum orçamento encontrado</p>
            ) : (
              <div className="space-y-3">
                {vehicleBudgets.map((budget) => (
                  <Link key={budget.id} href={`/budgets/${budget.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <div>
                        <div className="font-medium text-sm">Orçamento #{budget.id}</div>
                        <div className="text-xs text-muted-foreground">{budget.date.toLocaleDateString("pt-BR")}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {budget.total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                        <div
                          className={`text-xs ${
                            budget.status === "approved"
                              ? "text-green-600"
                              : budget.status === "rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                          }`}
                        >
                          {budget.status === "approved"
                            ? "Aprovado"
                            : budget.status === "rejected"
                              ? "Rejeitado"
                              : "Pendente"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
