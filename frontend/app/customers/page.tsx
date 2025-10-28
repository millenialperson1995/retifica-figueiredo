import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Phone, Mail, Car, UsersIcon } from "lucide-react"
import { mockCustomers, getVehiclesByCustomerId } from "@/lib/mock-data"
import { AppHeader } from "@/components/app-header"
import { EmptyState } from "@/components/empty-state"

export default function CustomersPage() {
  return (
    <>
      <AppHeader />
      <div className="min-h-screen pb-20">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <PageHeader title="Clientes" description="Gerencie seus clientes" />
            <Link href="/customers/new">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            </Link>
          </div>

          {mockCustomers.length === 0 ? (
            <Card>
              <CardContent className="p-0">
                <EmptyState
                  icon={UsersIcon}
                  title="Nenhum cliente cadastrado"
                  description="Comece adicionando seu primeiro cliente ao sistema"
                  actionLabel="Cadastrar Cliente"
                  actionHref="/customers/new"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {mockCustomers.map((customer) => {
                const vehicles = getVehiclesByCustomerId(customer.id)
                return (
                  <Link key={customer.id} href={`/customers/${customer.id}`}>
                    <Card className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">{customer.name}</h3>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{customer.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-3.5 h-3.5" />
                                <span>{customer.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Car className="w-3.5 h-3.5" />
                                <span>
                                  {vehicles.length} {vehicles.length === 1 ? "veículo" : "veículos"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
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
