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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Cálculos para paginação
  const indexOfLastBudget = currentPage * itemsPerPage;
  const indexOfFirstBudget = indexOfLastBudget - itemsPerPage;
  const currentBudgets = budgets.slice(indexOfFirstBudget, indexOfLastBudget);
  const totalPages = Math.ceil(budgets.length / itemsPerPage);

  // Função para ir para uma página específica
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data in parallel
        const [budgetsData, customersData, vehiclesData] = await Promise.all([
          apiService.getBudgets(),
          apiService.getCustomers(),
          apiService.getVehicles()
        ]);

        // Convert dates for budgets and remove duplicates by ID
        const uniqueBudgets = budgetsData.filter((budget, index, self) =>
          index === self.findIndex(b => b.id === budget.id)
        );

        const formattedBudgets = uniqueBudgets.map(budget => ({
          ...budget,
          date: new Date(budget.date)
        }));

        // Ordenar os orçamentos por data, mais recentes primeiro
        const sortedBudgets = formattedBudgets.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setBudgets(sortedBudgets);
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
        <div className="text-lg">Carregando orçamentos...</div>
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
            <>
              <div className="space-y-4">
                {currentBudgets.map((budget) => {
                  const customer = getCustomerById(budget.customerId);
                  const vehicle = getVehicleById(budget.vehicleId);

                  return (
                    <Link key={budget.id} href={`/budgets/${budget.id}`} className="block">
                      <Card className="hover:bg-accent/50 transition-colors shadow-sm hover:shadow-md">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">Orçamento #{budget.id.slice(-6).toUpperCase()}</h3>
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
                              <span className="text-muted-foreground">{customer?.name || "Cliente não encontrado"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Car className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {vehicle?.brand || "Veículo"} {vehicle?.model || "temporário"} - {vehicle?.plate || "ABC-1234"}
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
                  );
                })}
              </div>
              
              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {indexOfFirstBudget + 1} a {Math.min(indexOfLastBudget, budgets.length)} de {budgets.length} orçamentos
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}