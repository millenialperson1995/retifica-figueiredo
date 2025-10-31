'use client';

import { useEffect, useState } from 'react';
import Link from "next/link"
import { useParams, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { ArrowLeft, Phone, Mail, MapPin, FileText, Plus, Car, DollarSign } from "lucide-react"
import { apiServiceOptimized } from "@/lib/apiOptimized"
import type { Customer, Vehicle, Budget } from "@/lib/types"

import AuthGuard from "@/components/auth-guard";

// Tipos para paginação
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

export default function CustomerDetailPage() {
  return (
    <AuthGuard>
      <CustomerDetailContent />
    </AuthGuard>
  );
}

function CustomerDetailContent() {
  const params = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const fetchData = async () => {
        try {
          // Fetch customer
          const customerData = await apiServiceOptimized.getCustomerById(params.id);
          setCustomer(customerData);
          
          // Fetch all vehicles and filter by customer ID
          const vehiclesRes = await apiServiceOptimized.getVehicles();
          const allVehicles = Array.isArray(vehiclesRes) ? vehiclesRes : (vehiclesRes as PaginatedResponse<Vehicle>).data;
          const customerVehicles = allVehicles.filter(v => v.customerId === params.id);
          setVehicles(customerVehicles);
          
          // Fetch all budgets and filter by customer ID
          const budgetsRes = await apiServiceOptimized.getBudgets();
          const allBudgets = Array.isArray(budgetsRes) ? budgetsRes : (budgetsRes as PaginatedResponse<Budget>).data;
          const customerBudgets = allBudgets.filter(b => b.customerId === params.id);
          // Sort by date, most recent first
          customerBudgets.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setBudgets(customerBudgets);
        } catch (error) {
          console.error("Error fetching data:", error);
          setCustomer(null); // Set to null to trigger notFound
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando cliente...</p>
      </div>
    );
  }

  if (!customer) {
    notFound();
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
              <span className="text-sm">{customer.email || 'N/A'}</span>
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
            {vehicles.length > 0 ? (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <Link 
                    key={vehicle.id} 
                    href={`/customers/${params.id}/vehicles/${vehicle.id}`}
                    className="block"
                  >
                    <div className="p-5 rounded-xl border border-border bg-card hover:bg-accent/30 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                      <div className="text-sm text-muted-foreground">
                        Placa: {vehicle.plate} • Ano: {vehicle.year}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum veículo cadastrado</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Budgets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orçamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {budgets.length > 0 ? (
              <div className="space-y-4">
                {budgets.slice(0, 5).map((budget) => (
                  <Link 
                    key={budget.id} 
                    href={`/budgets/${budget.id}`}
                    className="block"
                  >
                    <div className="p-5 rounded-xl border border-border bg-card hover:bg-accent/30 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">#{budget.id?.slice(-6).toUpperCase()}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(budget.date).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {budget.total?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </div>
                          <div className="text-xs">
                            <span className={`px-2 py-0.5 rounded-full ${
                              budget.status === "approved" 
                                ? "bg-green-100 text-green-800" 
                                : budget.status === "rejected" 
                                ? "bg-red-100 text-red-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {budget.status === "pending" ? "Pendente" : 
                               budget.status === "approved" ? "Aprovado" : 
                               "Rejeitado"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhum orçamento encontrado</p>
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
