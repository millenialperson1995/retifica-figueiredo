'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Calendar, User, Car, FileText } from "lucide-react"
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

export default function BudgetsPage() {
  return (
    <AuthGuard>
      <BudgetsContent />
    </AuthGuard>
  );
}

function BudgetsContent() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const budgetsData = await apiService.getBudgets();
        // Converter datas para objetos Date
        const formattedBudgets = budgetsData.map(budget => ({
          ...budget,
          date: new Date(budget.date)
        }));
        setBudgets(formattedBudgets);
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando orçamentos...</div>
      </div>
    );
  }

  // Função para obter cliente por ID (você precisará implementar a busca real)
  const getCustomerById = async (id: string) => {
    try {
      const customers = await apiService.getCustomers();
      return customers.find(c => c.id === id);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }
  };

  // Função para obter veículo por ID (você precisará implementar a busca real)
  const getVehicleById = async (id: string) => {
    try {
      const vehicles = await apiService.getVehicles();
      return vehicles.find(v => v.id === id);
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      return null;
    }
  };

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

          {budgets.length === 0 ? (
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
              {budgets.map((budget) => {
                // Obter cliente e veículo de forma assíncrona (em uma implementação real, você buscaria todos de uma vez)
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
                            <span className="text-muted-foreground">{/* customer?.name */ "Cliente temporário"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {/* vehicle?.brand */ "Veículo"} {/* vehicle?.model */ "temporário"} - {/* vehicle?.plate */ "ABC-1234"}
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
