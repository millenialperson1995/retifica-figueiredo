'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { FileText, Wrench, Users, TrendingUp, Plus, Calendar, Clock } from "lucide-react"
import { apiService } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"
import AuthGuard from "@/components/auth-guard";

interface Customer {
  _id: string;
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

interface Budget {
  _id: string;
  customerId: string;
  vehicleId: string;
  date: Date;
  status: "pending" | "approved" | "rejected";
  userId: string;
  services: ServiceItem[];
  parts: PartItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
}

interface Order {
  _id: string;
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

export default function HomePage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetsData, ordersData, customersData] = await Promise.all([
          apiService.getBudgets(),
          apiService.getOrders(),
          apiService.getCustomers()
        ]);
        
        // Converter datas para objetos Date e remover duplicatas
        const uniqueBudgets = budgetsData.filter((budget, index, self) =>
          index === self.findIndex(b => b._id === budget._id)
        );
        
        const uniqueOrders = ordersData.filter((order, index, self) =>
          index === self.findIndex(o => o._id === order._id)
        );
        
        const formattedBudgets = uniqueBudgets.map(budget => ({
          ...budget,
          date: new Date(budget.date)
        }));
        
        const formattedOrders = uniqueOrders.map(order => ({
          ...order,
          startDate: new Date(order.startDate),
          estimatedEndDate: new Date(order.estimatedEndDate)
        }));
        
        setBudgets(formattedBudgets);
        setOrders(formattedOrders);
        setCustomers(customersData);
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
        <div className="text-lg">Carregando dados...</div>
      </div>
    );
  }

  const pendingBudgets = budgets.filter((b) => b.status === "pending").length
  const approvedBudgets = budgets.filter((b) => b.status === "approved").length
  const inProgressOrders = orders.filter((o) => o.status === "in-progress").length
  const completedOrders = orders.filter((o) => o.status === "completed").length
  const totalBudgets = budgets.length
  const totalCustomers = customers.length
  const monthlyRevenue = budgets.filter((b) => b.status === "approved").reduce((sum, b) => sum + b.total, 0)

  // Recent activity - combine budgets and orders
  const recentBudgets = [...budgets]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3)
  const recentOrders = [...orders]
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    .slice(0, 3)

  // Função para obter cliente por ID
  const getCustomerById = (id: string) => customers.find(c => c._id === id);

  // Função para obter veículo por ID (você precisará implementar isso no futuro)
  const getVehicleById = (id: string) => {
    // Este é apenas um placeholder - em uma implementação completa, você buscaria o veículo
    return {
      id,
      plate: 'ABC-1234', // placeholder
      brand: 'N/A', // placeholder
      model: 'N/A', // placeholder
    } as any as Vehicle;
  };

  return (
    <>
      <AppHeader />
      <div className="min-h-screen pb-20">
        <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
          <PageHeader title="Dashboard" description="Visão geral do seu negócio" />

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Receita Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {monthlyRevenue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{approvedBudgets} orçamentos aprovados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  OS em Andamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">{completedOrders} concluídas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Orçamentos Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingBudgets}</div>
                <p className="text-xs text-muted-foreground mt-1">{totalBudgets} no total</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
                <p className="text-xs text-muted-foreground mt-1">Cadastrados</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Ações Rápidas</h2>

            <Link href="/budgets/new">
              <Button className="w-full justify-start h-auto py-4" size="lg">
                <Plus className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Novo Orçamento</div>
                  <div className="text-xs text-primary-foreground/80">Criar orçamento para cliente</div>
                </div>
              </Button>
            </Link>

            <Link href="/orders/new">
              <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent" size="lg">
                <Wrench className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Nova Ordem de Serviço</div>
                  <div className="text-xs text-muted-foreground">Criar OS do zero ou de orçamento</div>
                </div>
              </Button>
            </Link>

            <Link href="/customers/new">
              <Button variant="outline" className="w-full justify-start h-auto py-4 bg-transparent" size="lg">
                <Users className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Cadastrar Cliente</div>
                  <div className="text-xs text-muted-foreground">Adicionar novo cliente ao sistema</div>
                </div>
              </Button>
            </Link>
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Ordens de Serviço Recentes</CardTitle>
                <Link href="/orders">
                  <Button variant="ghost" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentOrders.map((order) => {
                    const customer = getCustomerById(order.customerId)
                    const vehicle = getVehicleById(order.vehicleId)
                    
                    return (
                      <Link key={order._id} href={`/orders/${order._id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                order.status === "completed"
                                  ? "bg-green-500"
                                  : order.status === "in-progress"
                                    ? "bg-blue-500"
                                    : order.status === "cancelled"
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">OS #{order._id.toString().slice(-6)}</span>
                                <Badge
                                  variant={
                                    order.status === "completed"
                                      ? "default"
                                      : order.status === "in-progress"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-xs"
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
                              <div className="text-xs text-muted-foreground truncate">
                                {customer?.name} • {vehicle?.plate}
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
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {order.estimatedEndDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Budgets */}
          {recentBudgets.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Orçamentos Recentes</CardTitle>
                <Link href="/budgets">
                  <Button variant="ghost" size="sm">
                    Ver todos
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBudgets.map((budget) => {
                    const customer = getCustomerById(budget.customerId)
                    const vehicle = getVehicleById(budget.vehicleId)
                    
                    return (
                      <Link key={budget._id} href={`/budgets/${budget._id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                budget.status === "approved"
                                  ? "bg-green-500"
                                  : budget.status === "rejected"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">Orçamento #{budget._id.toString().slice(-6)}</span>
                                <Badge
                                  variant={
                                    budget.status === "approved"
                                      ? "default"
                                      : budget.status === "rejected"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {budget.status === "approved"
                                    ? "Aprovado"
                                    : budget.status === "rejected"
                                      ? "Rejeitado"
                                      : "Pendente"}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {customer?.name} • {vehicle?.plate}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">
                              {budget.total.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {budget.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
