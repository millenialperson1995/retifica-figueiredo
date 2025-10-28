import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Calendar, User, Car, FileText } from "lucide-react"
import { mockBudgets, getCustomerById, getVehicleById } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"
import { EmptyState } from "@/components/empty-state"

export default function BudgetsPage() {
  return (
    <>
      <AppHeader />
      <div className="min-h-screen pb-20">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <PageHeader title="Orçamentos" description="Gerencie seus orçamentos" />
            <Link href="/budgets/new">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            </Link>
          </div>

          {mockBudgets.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyState
                  icon={FileText}
                  title="Nenhum orçamento criado"
                  description="Crie seu primeiro orçamento para começar a gerenciar seus serviços"
                  actionLabel="Criar Orçamento"
                  actionHref="/budgets/new"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mockBudgets.map((budget) => {
                const customer = getCustomerById(budget.customerId)
                const vehicle = getVehicleById(budget.vehicleId)

                return (
                  <Link key={budget.id} href={`/budgets/${budget.id}`}>
                    <Card className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">Orçamento #{budget.id}</h3>
                              <Badge
                                variant={
                                  budget.status === "approved"
                                    ? "default"
                                    : budget.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                }
                              >
                                {budget.status === "approved"
                                  ? "Aprovado"
                                  : budget.status === "rejected"
                                    ? "Rejeitado"
                                    : "Pendente"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{budget.date.toLocaleDateString("pt-BR")}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              {budget.total.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{customer?.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {vehicle?.brand} {vehicle?.model} - {vehicle?.plate}
                            </span>
                          </div>
                        </div>

                        {budget.notes && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground line-clamp-2">{budget.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
