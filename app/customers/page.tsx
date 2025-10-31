'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Phone, Mail, Car, UsersIcon } from "lucide-react"
import { apiServiceOptimized } from "@/lib/apiOptimized"
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

export default function CustomersPage() {
  return (
    <AuthGuard>
      <CustomersContent />
    </AuthGuard>
  );
}

function CustomersContent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ 
    page: 1, 
    limit: 10, 
    total: 0, 
    pages: 1 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        
        // Buscar clientes com paginação
        const paginatedCustomers = await apiServiceOptimized.getCustomers({ 
          page: pagination.page, 
          limit: pagination.limit 
        }) as PaginatedResponse<Customer>;
        
        setCustomers(paginatedCustomers.data);
        setPagination(paginatedCustomers.pagination);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [pagination.page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando clientes...</div>
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
            <PageHeader title="Clientes" description="Gerencie seus clientes" />
            <Link href="/customers/new">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            </Link>
          </div>

          {customers.length === 0 ? (
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
            <>
              <div className="space-y-4">
                {customers.map((customer) => {
                  // Simulando contagem de veículos associados
                  const vehicleCount: number = 0; // Este valor viria de uma chamada à API de veículos
                  return (
                    <Link key={customer.id} href={`/customers/${customer.id}`}>
                      <Card className="hover:bg-accent/50 transition-colors shadow-sm hover:shadow-md">
                        <CardContent className="p-5">
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
                                    {vehicleCount} {vehicleCount === 1 ? "veículo" : "veículos"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
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
                    Mostrando {(pagination.page - 1) * pagination.limit + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} clientes
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
