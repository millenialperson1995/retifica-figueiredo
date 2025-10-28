import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft, Phone, Mail, MapPin, FileText, Plus, Car } from "lucide-react"
import { getCustomerById, getVehiclesByCustomerId, mockBudgets } from "@/lib/mock-data"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = getCustomerById(params.id)
  const vehicles = getVehiclesByCustomerId(params.id)
  const customerBudgets = mockBudgets.filter((b) => b.customerId === params.id)

  if (!customer) {
    notFound()
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/customers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <PageHeader title={customer.name} description="Detalhes do cliente" />
        </div>

        {/* Customer Info */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{customer.cpfCnpj}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="text-sm">
                <div>{customer.address}</div>
                <div>
                  {customer.city}, {customer.state} - {customer.zipCode}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles */}
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Veículos</CardTitle>
            <Link href={`/customers/${params.id}/vehicles/new`}>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {vehicles.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum veículo cadastrado</p>
            ) : (
              <div className="space-y-3">
                {vehicles.map((vehicle) => (
                  <Link key={vehicle.id} href={`/customers/${params.id}/vehicles/${vehicle.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                      <Car className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {vehicle.brand} {vehicle.model} ({vehicle.year})
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {vehicle.plate} • {vehicle.color}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Budgets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orçamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {customerBudgets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum orçamento encontrado</p>
            ) : (
              <div className="space-y-3">
                {customerBudgets.slice(0, 5).map((budget) => (
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

        <div className="mt-6">
          <Link href={`/budgets/new?customerId=${params.id}`}>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Orçamento
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
