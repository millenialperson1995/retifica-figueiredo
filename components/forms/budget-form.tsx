"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { ArrowLeft, Plus, Trash2, Wrench } from "lucide-react";
import type { ServiceItem, PartItem, Budget, InventoryItem, StandardService } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiServiceOptimized } from "@/lib/apiOptimized";
import { useToast } from "@/hooks/use-toast";

interface BudgetFormProps {
  budget?: Budget;
  isEditing?: boolean;
}

export function BudgetForm({ budget, isEditing = false }: BudgetFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customerId, setCustomerId] = useState(budget?.customerId || searchParams.get('customerId') || "");
  const [vehicleId, setVehicleId] = useState(budget?.vehicleId || "");
  const [notes, setNotes] = useState(budget?.notes || "");
  const [services, setServices] = useState<ServiceItem[]>(budget?.services || []);
  const [parts, setParts] = useState<PartItem[]>(budget?.parts || []);

  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [standardServices, setStandardServices] = useState<StandardService[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const { toast } = useToast();

  const vehicles = customerId ? allVehicles.filter((v) => v.customerId === customerId) : [];

  // Carregar dados do orçamento existente para edição
  useEffect(() => {
    if (budget && isEditing) {
      setCustomerId(budget.customerId);
      setVehicleId(budget.vehicleId);
      setServices(budget.services);
      setParts(budget.parts);
      setNotes(budget.notes || "");
    }
  }, [budget, isEditing]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar clientes, veículos, inventário e serviços padrão
        const [customersRes, vehiclesRes, inventoryRes, servicesRes] = await Promise.all([
          apiServiceOptimized.getCustomers(),
          apiServiceOptimized.getVehicles(),
          apiServiceOptimized.getInventory(),
          apiServiceOptimized.getServices(),
        ]);

        // Handle both paginated and non-paginated responses
        const customersData = Array.isArray(customersRes) ? customersRes : (customersRes as any).data;
        const vehiclesData = Array.isArray(vehiclesRes) ? vehiclesRes : (vehiclesRes as any).data;
        const inventoryData = Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as any).data;
        const servicesData = Array.isArray(servicesRes) ? servicesRes : (servicesRes as any).data;

        setCustomers(customersData || []);
        setAllVehicles(vehiclesData || []);
        setInventory(inventoryData || []);
        // Some services may include inactive ones; keep only active ones
        setStandardServices((servicesData || []).filter((s: any) => s.isActive));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os clientes, veículos, inventário ou serviços",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (customerId && vehicles.length > 0 && !vehicleId && !isEditing) {
      setVehicleId(vehicles[0].id);
    }
  }, [customerId, vehicles, vehicleId, isEditing]);

  const addService = () => {
    setServices([...services, { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeService = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const updateService = (id: string, field: keyof ServiceItem, value: string | number) => {
    setServices(
      services.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = Number(updated.quantity) * Number(updated.unitPrice);
          }
          return updated;
        }
        return s;
      }),
    );
  };

  const addStandardService = (standardService: StandardService) => {
    const newServiceItem: ServiceItem = {
      id: `std-${Date.now()}`,
      description: standardService.name,
      quantity: 1,
      unitPrice: standardService.basePrice,
      total: standardService.basePrice,
    };
    setServices([...services, newServiceItem]);
  };

  const addPart = () => {
    setParts([
      ...parts,
      { id: Date.now().toString(), description: "", partNumber: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removePart = (id: string) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  const updatePart = (id: string, field: keyof PartItem, value: string | number) => {
    setParts(
      parts.map((p) => {
        if (p.id === id) {
          const updated = { ...p, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            updated.total = Number(updated.quantity) * Number(updated.unitPrice);
          }
          return updated;
        }
        return p;
      }),
    );
  };

  const updatePartWithInventory = (id: string, inventoryId: string) => {
    const inventoryItem = inventory.find(item => item.id === inventoryId);
    if (inventoryItem) {
      setParts(
        parts.map((p) => {
          if (p.id === id) {
            const updated = {
              ...p,
              inventoryId: inventoryItem.id,
              description: inventoryItem.name,
              partNumber: inventoryItem.sku,
              unitPrice: inventoryItem.unitPrice,
            };
            updated.total = Number(updated.quantity) * Number(updated.unitPrice);
            return updated;
          }
          return p;
        }),
      );
    }
  };

  const subtotal = [...services, ...parts].reduce((sum, item) => sum + item.total, 0);

  const handleError = async (error: any) => {
    let message = `Erro ao salvar orçamento`;
    
    if (error instanceof Response) {
      try {
        const data = await error.json();
        if (data?.error) {
          message = data.error;
        }
      } catch {
        message = `Erro: ${error.statusText}`;
      }
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'object' && error !== null) {
      message = error.error || error.message || message;
    }

    console.error('Detalhes do erro:', {
      type: error?.constructor?.name,
      status: error instanceof Response ? error.status : undefined,
      message,
      error
    });

    toast({
      title: "Erro ao salvar orçamento",
      description: message,
      variant: "destructive",
    });
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId || !vehicleId) {
      toast({
        title: "Erro de validação",
        description: "Selecione um cliente e um veículo",
        variant: "destructive",
      });
      return;
    }

    if (services.length === 0 || services.every((s) => !s.description.trim())) {
      toast({
        title: "Erro de validação",
        description: "Adicione pelo menos um serviço",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const newBudget = {
        id: budget?.id || `BDG${Date.now()}`,
        customerId,
        vehicleId,
        date: budget?.date || new Date(),
        services: services.filter((s) => s.description.trim()),
        parts: parts.filter((p) => p.description.trim()),
        status: budget?.status || "pending",
        notes,
        subtotal,
        discount: budget?.discount || 0,
        total: subtotal - (budget?.discount || 0),
      } as any;

      // Salvar o orçamento
      if (isEditing) {
        await apiServiceOptimized.updateBudget(budget!.id, newBudget);
      } else {
        await apiServiceOptimized.createBudget(newBudget);
      }

      toast({
        title: isEditing ? "Orçamento atualizado" : "Orçamento criado",
        description: isEditing ? "O orçamento foi atualizado com sucesso!" : "O orçamento foi criado com sucesso!",
      });
      router.push("/budgets");
    } catch (error) {
      await handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/budgets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <PageHeader 
            title={isEditing ? "Editar Orçamento" : "Novo Orçamento"} 
            description={isEditing ? "Edite as informações do orçamento" : "Crie um novo orçamento"} 
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer and Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cliente e Veículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Cliente *</Label>
                <Select value={customerId} onValueChange={setCustomerId} required>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer._id || customer.id} value={customer._id || customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {customerId && vehicles.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Veículo *</Label>
                  <Select value={vehicleId} onValueChange={setVehicleId} required>
                    <SelectTrigger id="vehicle">
                      <SelectValue placeholder="Selecione um veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle._id || vehicle.id} value={vehicle._id || vehicle.id}>
                          {vehicle.brand} {vehicle.model} - {vehicle.plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {customerId && vehicles.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  Este cliente não possui veículos cadastrados.{" "}
                  <Link href={`/customers/${customerId}/vehicles/new`} className="text-primary hover:underline">
                    Cadastrar veículo
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-base">Serviços</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select onValueChange={(value) => {
                  const selectedService = standardServices.find(s => s.id === value);
                  if (selectedService) {
                    addStandardService(selectedService);
                  }
                }}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Adicionar serviço padrão" />
                  </SelectTrigger>
                  <SelectContent>
                    {standardServices.map((service) => (
                      <SelectItem key={service.id} value={service.id} className="flex items-center">
                        <Wrench className="w-4 h-4 mr-2" />
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" size="sm" variant="outline" onClick={addService} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Manual
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum serviço adicionado. Clique em "Adicionar Manual" ou selecione um "serviço padrão" para começar.
                </div>
              ) : (
                services.map((service, index) => (
                  <div key={service.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Serviço {index + 1}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeService(service.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição *</Label>
                      <Input
                        value={service.description}
                        onChange={(e) => updateService(service.id, "description", e.target.value)}
                        placeholder="Ex: Retífica de motor completa"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Qtd *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={service.quantity || ''}
                          onChange={(e) => updateService(service.id, "quantity", e.target.value ? Number(e.target.value) : 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valor Unit. *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={service.unitPrice || ''}
                          onChange={(e) => updateService(service.id, "unitPrice", e.target.value ? Number(e.target.value) : 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          value={service.total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Parts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Peças</CardTitle>
              <Button type="button" size="sm" variant="outline" onClick={addPart}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {parts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhuma peça adicionada. Clique em "Adicionar" para começar.
                </div>
              ) : (
                parts.map((part, index) => (
                  <div key={part.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Peça {index + 1}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removePart(part.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label>Peça do Estoque</Label>
                      <Select
                        value={part.inventoryId || ""}
                        onValueChange={(value) => updatePartWithInventory(part.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma peça do estoque" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventory.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} (R$ {item.unitPrice.toFixed(2)}) - Estoque: {item.quantity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição *</Label>
                      <Input
                        value={part.description}
                        onChange={(e) => updatePart(part.id, "description", e.target.value)}
                        placeholder="Ex: Jogo de juntas do motor"
                        required
                        disabled={!!part.inventoryId}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Código da Peça</Label>
                      <Input
                        value={part.partNumber}
                        onChange={(e) => updatePart(part.id, "partNumber", e.target.value)}
                        placeholder="Ex: JG-001"
                        disabled={!!part.inventoryId}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Qtd *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={part.quantity || ''}
                          onChange={(e) => updatePart(part.id, "quantity", e.target.value ? Number(e.target.value) : 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valor Unit. *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={part.unitPrice || ''}
                          onChange={(e) => updatePart(part.id, "unitPrice", e.target.value ? Number(e.target.value) : 0)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          value={part.total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Notes and Total */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Informações adicionais sobre o orçamento"
                  rows={3}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {subtotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/budgets" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent" disabled={isLoading}>
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={!customerId || !vehicleId || isLoading}>
              {isLoading ? "Salvando..." : (isEditing ? "Atualizar" : "Criar") + " Orçamento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
