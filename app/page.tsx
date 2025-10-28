import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { FileText, Wrench, Users, TrendingUp, Plus, Calendar, Clock } from "lucide-react"
import { mockBudgets, mockOrders, mockCustomers, getCustomerById, getVehicleById } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"

export default function HomePage() {
  const pendingBudgets = mockBudgets.filter((b) => b.status === "pending").length
  const approvedBudgets = mockBudgets.filter((b) => b.status === "approved").length
  const inProgressOrders = mockOrders.filter((o) => o.status === "in-progress").length
  const completedOrders = mockOrders.filter((o) => o.status === "completed").length
  const totalBudgets = mockBudgets.length
  const totalCustomers = mockCustomers.length
  const monthlyRevenue = mockBudgets.filter((b) => b.status === "approved").reduce((sum, b) => sum + b.total, 0)

  // Recent activity - combine budgets and orders
  const recentBudgets = mockBudgets
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3)
  const recentOrders = mockOrders
    .slice()
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    .slice(0, 3)

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
                      <Link key={order.id} href={`/orders/${order.id}`}>
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
                                <span className="font-medium text-sm">OS #{order.id}</span>
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
                      <Link key={budget.id} href={`/budgets/${budget.id}`}>
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
                                <span className="font-medium text-sm">Orçamento #{budget.id}</span>
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
