'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Calendar, User, Car, Clock, WrenchIcon } from "lucide-react"
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

interface Order {
  id: string;
  budgetId?: string;
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

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>([]);
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
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Buscar ordens com paginação
        const paginatedOrders = await apiServiceOptimized.getOrders({ 
          page: pagination.page, 
          limit: pagination.limit 
        }) as PaginatedResponse<Order>;
        
        // Converter datas para objetos Date
        const formattedOrders = paginatedOrders.data.map(order => ({
          ...order,
          startDate: new Date(order.startDate),
          estimatedEndDate: new Date(order.estimatedEndDate),
          actualEndDate: order.actualEndDate ? new Date(order.actualEndDate) : undefined,
          createdAt: new Date(order.createdAt)
        }));

        setOrders(formattedOrders);
        setPagination(paginatedOrders.pagination);
      } catch (error) {
        console.error('Erro ao buscar ordens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [pagination.page]);

  // Carregar dados de cache
  useEffect(() => {
    loadCachedData();
  }, [loadCachedData]);

  if (loading || cacheLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando ordens de serviço...</div>
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
            <>
              <div className="space-y-4">
                {orders.map((order) => {
                  const customer = customerMap.get(order.customerId);
                  const vehicle = vehicleMap.get(order.vehicleId);

                  return (
                    <Link key={order.id} href={`/orders/${order.id}`} className="block">
                      <Card className="hover:bg-accent/50 transition-colors shadow-sm hover:shadow-md">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">OS #{order.id.slice(-6).toUpperCase()}</h3>
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
              
              {/* Paginação */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {(pagination.page - 1) * pagination.limit + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} OS
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
