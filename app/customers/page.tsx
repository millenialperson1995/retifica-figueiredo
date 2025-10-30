'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Plus, Phone, Mail, Car, UsersIcon } from "lucide-react"
import { apiService } from "@/lib/api"
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

export default function CustomersPage() {
  return (
    <AuthGuard>
      <CustomersContent />
    </AuthGuard>
  );
}

function CustomersContent() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersData = await apiService.getCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando clientes...</div>
      </div>
    );
  }

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
            <div className="space-y-3">
              {customers.map((customer) => {
                // Note: Para uma implementação completa, você buscaria os veículos associados
                // Por enquanto, usaremos um placeholder
                const vehicleCount: number = 0; // Este valor viria de uma chamada à API de veículos
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
          )}
        </div>
      </div>
    </>
  )
}
