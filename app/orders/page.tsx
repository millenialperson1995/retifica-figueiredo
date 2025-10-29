'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Calendar, User, Car, Clock, WrenchIcon } from "lucide-react"
import { apiService } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"
import { EmptyState } from "@/components/empty-state"
import AuthGuard from "@/components/auth-guard";

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
  color: string;
  engineNumber?: string;
  chassisNumber?: string;
  notes?: string;
  userId: string;
}

interface ServiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PartItem {
  id: string;
  description: string;
  partNumber?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  inventoryId?: string;
}

interface Order {
  id: string;
  budgetId: string;
  customerId: string;
  vehicleId: string;
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate?: Date;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  userId: string;
  services: ServiceItem[];
  parts: PartItem[];
  total: number;
  notes?: string;
  mechanicNotes?: string;
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data in parallel
        const [ordersData, customersData, vehiclesData] = await Promise.all([
          apiService.getOrders(),
          apiService.getCustomers(),
          apiService.getVehicles()
        ]);

        // Convert dates for orders and remove duplicates by ID
        const uniqueOrders = ordersData.filter((order, index, self) =>
          index === self.findIndex(o => o.id === order.id)
        );

        const formattedOrders = uniqueOrders.map(order => ({
          ...order,
          startDate: new Date(order.startDate),
          estimatedEndDate: new Date(order.estimatedEndDate),
          actualEndDate: order.actualEndDate ? new Date(order.actualEndDate) : undefined
        }));

        setOrders(formattedOrders);
        setCustomers(customersData);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando ordens de serviço...</div>
      </div>
    );
  }

  // Helper functions to find customer and vehicle by ID
  const getCustomerById = (id: string) => {
    return customers.find(c => c.id === id);
  };

  const getVehicleById = (id: string) => {
    return vehicles.find(v => v.id === id);
  };

  return (
    <>
      <AppHeader />
      <div className="min-h-screen pb-20">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <PageHeader title="Ordens de Serviço" description="Gerencie suas OS" />
            <Link href="/orders/new">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova
              </Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyState
                  icon={WrenchIcon}
                  title="Nenhuma ordem de serviço"
                  description="Crie sua primeira OS para começar a gerenciar os serviços da oficina"
                  actionLabel="Criar Nova OS"
                  actionHref="/orders/new"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const customer = getCustomerById(order.customerId);
                const vehicle = getVehicleById(order.vehicleId);

                return (
                  <Link key={order.id} href={`/orders/${order.id}`} className="block">
                    <Card className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">OS #{order.id}</h3>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : order.status === "in-progress"
                                      ? "secondary"
                                      : order.status === "cancelled"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {order.status === "completed"
                                  ? "Concluída"
                                  : order.status === "in-progress"
                                    ? "Em Andamento"
                                    : order.status === "cancelled"
                                      ? "Cancelada"
                                      : "Pendente"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>Início: {order.startDate.toLocaleDateString("pt-BR")}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              {order.total.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{customer?.name || "Cliente não encontrado"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {vehicle?.brand || "Veículo"} {vehicle?.model || "temporário"} - {vehicle?.plate || "ABC-1234"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Previsão: {order.estimatedEndDate.toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>

                        {order.mechanicNotes && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground line-clamp-2">{order.mechanicNotes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
