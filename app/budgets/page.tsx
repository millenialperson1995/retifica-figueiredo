'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Calendar, User, Car, FileText } from "lucide-react"
import { apiServiceOptimized } from "@/lib/apiOptimized"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"
import { EmptyState } from "@/components/empty-state"
import AuthGuard from "@/components/auth-guard";
import { useDataCache } from "@/hooks/useDataCache";
import { createCustomerMap, createVehicleMap } from "@/lib/dataMaps";

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
  createdAt: Date;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
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
  const [pagination, setPagination] = useState<Pagination>({ 
    page: 1, 
    limit: 10, 
    total: 0, 
    pages: 1 
  });
  const [loading, setLoading] = useState(true);
  const { data: cacheData, loading: cacheLoading, loadCachedData } = useDataCache();

  // Criar mapas para busca eficiente - ESTE HOOK DEVE ESTAR ANTES DE QUALQUER CONDICIONAL
  const customerMap = useMemo(() => {
    return cacheData?.customers ? createCustomerMap(cacheData.customers) : new Map();
  }, [cacheData?.customers]);

  const vehicleMap = useMemo(() => {
    return cacheData?.vehicles ? createVehicleMap(cacheData.vehicles) : new Map();
  }, [cacheData?.vehicles]);

  // Carregar dados paginados
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        
        // Buscar orçamentos com paginação
        const paginatedBudgets = await apiServiceOptimized.getBudgets({ 
          page: pagination.page, 
          limit: pagination.limit 
        }) as PaginatedResponse<Budget>;
        
        // Converter datas para objetos Date
        const formattedBudgets = paginatedBudgets.data.map(budget => ({
          ...budget,
          date: new Date(budget.date),
          createdAt: new Date(budget.createdAt)
        }));

        setBudgets(formattedBudgets);
        setPagination(paginatedBudgets.pagination);
      } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [pagination.page]);

  // Carregar dados de cache
  useEffect(() => {
    loadCachedData();
  }, [loadCachedData]);

  if (loading || cacheLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando orçamentos...</div>
      </div>
    );
  }

  // Funções para navegar entre páginas
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  const goToPreviousPage = () => {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1);
    }
  };

  const goToNextPage = () => {
    if (pagination.page < pagination.pages) {
      goToPage(pagination.page + 1);
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
                  title="Nenhuma orçamento criado"
                  description="Crie seu primeiro orçamento para começar a gerenciar seus serviços"
                  actionLabel="Criar Orçamento"
                  actionHref="/budgets/new"
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const customer = customerMap.get(budget.customerId);
                  const vehicle = vehicleMap.get(budget.vehicleId);

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
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {(pagination.page - 1) * pagination.limit + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} orçamentos
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToPreviousPage}
                      disabled={pagination.page === 1}
                    >
                      Anterior
                    </Button>
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      // Mostrar páginas mais próximas da página atual
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToNextPage}
                      disabled={pagination.page === pagination.pages}
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