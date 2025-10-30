'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { FileText, Wrench, Users, TrendingUp, Plus, Calendar, Clock, BarChart3, PieChart } from "lucide-react"
import { apiService } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"
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

interface Budget {
  id: string;
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
          index === self.findIndex(b => b.id === budget.id)
        );
        
        const uniqueOrders = ordersData.filter((order, index, self) =>
          index === self.findIndex(o => o.id === order.id)
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
  const getCustomerById = (id: string) => customers.find(c => c.id === id);

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
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Visão geral do seu negócio</p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-[rgb(var(--brand-start))] to-[rgb(var(--brand-end))] rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Receita Mensal</p>
                  <p className="text-2xl font-bold mt-1">
                    {monthlyRevenue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p className="text-xs opacity-80 mt-1">{approvedBudgets} orçamentos aprovados</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[rgb(var(--brand-start))] to-[rgb(var(--brand-end))] rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">OS em Andamento</p>
                  <p className="text-2xl font-bold mt-1">{inProgressOrders}</p>
                  <p className="text-xs opacity-80 mt-1">{completedOrders} concluídas</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Wrench className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[rgb(var(--brand-start))] to-[rgb(var(--brand-end))] rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Orçamentos Pendentes</p>
                  <p className="text-2xl font-bold mt-1">{pendingBudgets}</p>
                  <p className="text-xs opacity-80 mt-1">{totalBudgets} no total</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[rgb(var(--brand-start))] to-[rgb(var(--brand-end))] rounded-xl p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total de Clientes</p>
                  <p className="text-2xl font-bold mt-1">{totalCustomers}</p>
                  <p className="text-xs opacity-80 mt-1">Cadastrados</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-foreground" />
                <h3 className="font-semibold text-foreground">Status das Ordens de Serviço</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Em Andamento</span>
                    <span className="text-sm font-medium">{inProgressOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[rgb(var(--brand-start))] h-2.5 rounded-full" 
                      style={{ width: `${orders.length > 0 ? (inProgressOrders / orders.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Concluídas</span>
                    <span className="text-sm font-medium">{completedOrders}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-[rgb(var(--brand-end))] h-2.5 rounded-full" 
                      style={{ width: `${orders.length > 0 ? (completedOrders / orders.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Pendentes</span>
                    <span className="text-sm font-medium">{pendingBudgets}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gray-400 h-2.5 rounded-full" 
                      style={{ width: `${budgets.length > 0 ? (pendingBudgets / budgets.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-foreground" />
                <h3 className="font-semibold text-foreground">Distribuição de Orçamentos</h3>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{totalBudgets}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Aprovados */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgb(var(--brand-start))"
                      strokeWidth="10"
                      strokeDasharray={`${(approvedBudgets / totalBudgets) * 283 || 0} 283`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                    {/* Pendentes */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgb(var(--brand-end))"
                      strokeWidth="10"
                      strokeDasharray={`${(pendingBudgets / totalBudgets) * 283 || 0} 283`}
                      strokeDashoffset={`${(approvedBudgets / totalBudgets) * 283 || 0}`}
                      transform="rotate(-90 50 50)"
                    />
                    {/* Rejeitados */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="10"
                      strokeDasharray={`${(totalBudgets - approvedBudgets - pendingBudgets) / totalBudgets * 283 || 0} 283`}
                      strokeDashoffset={`${((approvedBudgets + pendingBudgets) / totalBudgets) * 283 || 0}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[rgb(var(--brand-start))] rounded-full"></div>
                  <span className="text-xs">Aprovados ({approvedBudgets})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[rgb(var(--brand-end))] rounded-full"></div>
                  <span className="text-xs">Pendentes ({pendingBudgets})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-xs">Rejeitados ({totalBudgets - approvedBudgets - pendingBudgets})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Ações Rápidas</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/budgets/new" className="block">
                <div className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-start gap-3">
                    <div className="bg-[rgb(var(--brand-start))] bg-opacity-20 p-2 rounded-lg">
                      <Plus className="w-5 h-5 text-[rgb(var(--brand-end))]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Novo Orçamento</h3>
                      <p className="text-xs text-muted-foreground mt-1">Criar orçamento para cliente</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/orders/new" className="block">
                <div className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-start gap-3">
                    <div className="bg-[rgb(var(--brand-start))] bg-opacity-20 p-2 rounded-lg">
                      <Wrench className="w-5 h-5 text-[rgb(var(--brand-end))]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Nova Ordem de Serviço</h3>
                      <p className="text-xs text-muted-foreground mt-1">Criar OS do zero ou de orçamento</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/customers/new" className="block">
                <div className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow h-full">
                  <div className="flex items-start gap-3">
                    <div className="bg-[rgb(var(--brand-start))] bg-opacity-20 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-[rgb(var(--brand-end))]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">Cadastrar Cliente</h3>
                      <p className="text-xs text-muted-foreground mt-1">Adicionar novo cliente ao sistema</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <Wrench className="w-5 h-5 text-foreground" />
                  <h2 className="text-lg font-semibold text-foreground">Ordens de Serviço Recentes</h2>
                </div>
                <Link href="/orders">
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-col gap-4">
                {recentOrders.map((order) => {
                  const customer = getCustomerById(order.customerId)
                  const vehicle = getVehicleById(order.vehicleId)
                  
                  return (
                    <Link key={order.id} href={`/orders/${order.id}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-border bg-card hover:bg-accent/30 transition-all duration-200 shadow-sm hover:shadow-md">
                        <div className="flex items-start gap-4 flex-1 mb-3 sm:mb-0">
                          <div
                            className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                              order.status === "completed"
                                ? "bg-[rgb(var(--brand-start))]"
                                : order.status === "in-progress"
                                  ? "bg-[rgb(var(--brand-end))]"
                                  : order.status === "cancelled"
                                    ? "bg-red-500"
                                    : "bg-gray-400"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <span className="font-medium text-sm">OS #{order.id.slice(-6).toUpperCase()}</span>
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
                        
                        <div className="flex flex-col sm:text-right">
                          <div className="font-semibold text-sm">
                            {order.total.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 sm:justify-end mt-1 sm:mt-0">
                            <Clock className="w-3 h-3" />
                            {order.estimatedEndDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Recent Budgets */}
          {recentBudgets.length > 0 && (
            <div className="bg-white border border-border rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <FileText className="w-5 h-5 text-foreground" />
                  <h2 className="text-lg font-semibold text-foreground">Orçamentos Recentes</h2>
                </div>
                <Link href="/budgets">
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-col gap-4">
                {recentBudgets.map((budget) => {
                  const customer = getCustomerById(budget.customerId)
                  const vehicle = getVehicleById(budget.vehicleId)
                  
                  return (
                    <Link key={budget.id} href={`/budgets/${budget.id}`} className="block">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-border bg-card hover:bg-accent/30 transition-all duration-200 shadow-sm hover:shadow-md">
                        <div className="flex items-start gap-4 flex-1 mb-3 sm:mb-0">
                          <div
                            className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                              budget.status === "approved"
                                ? "bg-[rgb(var(--brand-start))]"
                                : budget.status === "rejected"
                                  ? "bg-red-500"
                                  : "bg-gray-400"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <span className="font-medium text-sm">Orçamento #{budget.id.slice(-6).toUpperCase()}</span>
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
                        
                        <div className="flex flex-col sm:text-right">
                          <div className="font-semibold text-sm">
                            {budget.total.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 sm:justify-end mt-1 sm:mt-0">
                            <Calendar className="w-3 h-3" />
                            {budget.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}