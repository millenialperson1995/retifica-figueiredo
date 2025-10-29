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
import { AlertCircle, ArrowLeft, Plus, Trash2, Wrench } from "lucide-react";
import type { ServiceItem, PartItem, StandardService, Customer, Vehicle, InventoryItem } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "../ui/spinner";

interface OrderFormProps {
  isEditing?: boolean;
  orderId?: string;
}

export function OrderForm({ isEditing = false, orderId }: OrderFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedBudgetId = searchParams.get("budgetId");

  // Form State
  const [budgetId, setBudgetId] = useState(preselectedBudgetId || "none");
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [estimatedEndDate, setEstimatedEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [parts, setParts] = useState<PartItem[]>([]);
  const [status, setStatus] = useState(""); // Add status state

  // Data State
  const [customers, setCustomers] = useState<any[]>([]);
  const [allVehicles, setAllVehicles] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [standardServices, setStandardServices] = useState<any[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false); // New state for read-only mode

  // Fetch all required data from APIs on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      // Don't set loading to true if a budget is being loaded, as it has its own loading state
      if (!preselectedBudgetId) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const [customersRes, vehiclesRes, inventoryRes, servicesRes] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/vehicles'),
          fetch('/api/inventory'),
          fetch('/api/services'),
        ]);

        if (!customersRes.ok || !vehiclesRes.ok || !inventoryRes.ok || !servicesRes.ok) {
          throw new Error('Failed to fetch initial data');
        }

        const customersData = await customersRes.json();
        const vehiclesData = await vehiclesRes.json();
        const inventoryData = await inventoryRes.json();
        const servicesData = await servicesRes.json();

        setCustomers(customersData);
        setAllVehicles(vehiclesData);
        setInventoryItems(inventoryData);
        setStandardServices(servicesData.filter((s: any) => s.isActive));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        if (!preselectedBudgetId) {
          setIsLoading(false);
        }
      }
    };

    fetchInitialData();
  }, [preselectedBudgetId]);

  // Load order data when editing
  useEffect(() => {
    if (isEditing && orderId) {
      const fetchOrder = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/orders/${orderId}`);
          
          if (!response.ok) {
            throw new Error('Order not found');
          }
          
          const order = await response.json();
          
          if (order) {
            // Set all order data
            setBudgetId(order.budgetId || "none");
            setCustomerId(order.customerId);
            setVehicleId(order.vehicleId);
            setStartDate(new Date(order.startDate).toISOString().split("T")[0]);
            setEstimatedEndDate(new Date(order.estimatedEndDate).toISOString().split("T")[0]);
            setNotes(order.notes || "");
            setMechanicNotes(order.mechanicNotes || "");
            setServices(order.services || []);
            setParts(order.parts || []);
            setStatus(order.status || ""); // Set the status
            
            // Set read-only mode if order is completed
            if (order.status === 'completed') {
              setIsReadOnly(true);
            }
          }
        } catch (error) {
          console.error("Failed to fetch order:", error);
          setError("Falha ao carregar os dados da ordem de serviço.");
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchOrder();
    } else {
      // If not editing, ensure loading state completes
      setIsLoading(false);
    }
  }, [isEditing, orderId]);

  // Load budget data if budgetId is provided
  useEffect(() => {
    if (budgetId && budgetId !== "none" && !isEditing) { // Only load budget if not in edit mode
      const fetchBudget = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/budgets/${budgetId}`);
          if (!response.ok) {
            throw new Error('Budget not found');
          }
          const budget = await response.json();
          if (budget) {
            setCustomerId(budget.customerId);
            setVehicleId(budget.vehicleId);
            setServices(budget.services || []);
            setParts(budget.parts || []);
            if (budget.notes) setNotes(budget.notes);
          }
        } catch (error) {
          console.error("Failed to fetch budget:", error);
          setError("Failed to load budget data.");
          setBudgetId("none"); // Reset if budget is not found
        } finally {
            setIsLoading(false);
        }
      };
      fetchBudget();
    } else if (!isEditing) {
      // If there's no budgetId and not editing, we can stop the main loading state
      setIsLoading(false);
    }
  }, [budgetId, isEditing]);

  // Derived state for vehicles based on selected customer
  const vehicles = customerId ? allVehicles.filter(v => v.customerId === customerId) : [];

  useEffect(() => {
    // If a customer is selected and they have vehicles, but no vehicle is selected yet,
    // default to the first vehicle in their list.
    if (customerId && !vehicleId && vehicles.length > 0) {
      setVehicleId(vehicles[0].id);
    }
    // If the customer changes and the previously selected vehicle doesn't belong to them,
    // reset the vehicleId.
    if (customerId && vehicleId && !vehicles.some(v => v.id === vehicleId)) {
        setVehicleId("");
    }
  }, [customerId, vehicles, vehicleId]);


  const addService = () => {
    if (isReadOnly) return; // Prevent adding if read-only
    setServices([...services, { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeService = (id: string) => {
    if (isReadOnly) return; // Prevent removing if read-only
    setServices(services.filter((s) => s.id !== id));
  };

  const updateService = (id: string, field: keyof ServiceItem, value: string | number) => {
    if (isReadOnly) return; // Prevent updating if read-only
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

  const addStandardService = (standardService: any) => {
    if (isReadOnly) return; // Prevent adding if read-only
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
    if (isReadOnly) return; // Prevent adding if read-only
    setParts([
      ...parts,
      { id: Date.now().toString(), description: "", partNumber: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removePart = (id: string) => {
    if (isReadOnly) return; // Prevent removing if read-only
    setParts(parts.filter((p) => p.id !== id));
  };

  const updatePart = (id: string, field: keyof PartItem, value: string | number) => {
    if (isReadOnly) return; // Prevent updating if read-only
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

  const updatePartWithInventory = (partId: string, inventoryId: string) => {
    if (isReadOnly) return; // Prevent updating if read-only
    const inventoryItem = inventoryItems.find(i => i.id === inventoryId);
    if (inventoryItem) {
      setParts(
        parts.map((p) => {
          if (p.id === partId) {
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

  const total = [...services, ...parts].reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReadOnly) {
      setError("Não é possível editar uma ordem de serviço concluída.");
      return;
    }
    
    // Prepare order data based on whether it's a new order or editing
    let orderData: any = {
      customerId,
      vehicleId,
      startDate,
      estimatedEndDate,
      services,
      parts,
      notes,
      mechanicNotes,
      total,
      status: status || 'pending', // Use current status if editing
    };
    
    // Only include budgetId if it's not 'none' (for new orders) or if editing and budgetId was set
    // This ensures the field is not sent at all if it's 'none', which should avoid validation issues
    if (budgetId !== "none" && budgetId !== undefined && budgetId !== null) {
      orderData.budgetId = budgetId;
    }

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/orders/${orderId}` : '/api/orders';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || (isEditing ? 'Failed to update order' : 'Failed to create order'));
      }

      router.push("/orders");

    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage = error instanceof Error ? error.message : (isEditing ? 'Falha ao atualizar a ordem de serviço. Por favor, tente novamente.' : 'Falha ao criar a ordem de serviço. Por favor, tente novamente.');
      setError(errorMessage);
    }
  };

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Spinner className="w-10 h-10" />
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-red-500">
            <p className="mb-4">{error}</p>
            <Button onClick={() => router.back()}>Voltar</Button>
        </div>
    );
  }

  // Show alert if order is in read-only mode
  const showReadOnlyAlert = isReadOnly && isEditing;

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <PageHeader 
            title={isEditing ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"} 
            description={isEditing ? "Edite as informações da ordem de serviço" : "Crie uma nova OS"} 
          />
        </div>

        {showReadOnlyAlert && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800">Ordem de Serviço Concluída</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Esta ordem de serviço está marcada como concluída e não pode ser editada. 
                Isso é feito para manter a integridade histórica dos serviços realizados.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer and Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cliente e Veículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Cliente *</Label>
                <Select
                  value={customerId}
                  onValueChange={(value) => {
                    if (isReadOnly) return; // Prevent change if read-only
                    setCustomerId(value);
                    setVehicleId(''); // Reset vehicle when customer changes
                  }}
                  required
                  disabled={!!preselectedBudgetId || isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id}
                        disabled={isReadOnly}
                      >
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {customerId && (
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Veículo *</Label>
                  <Select 
                    value={vehicleId} 
                    onValueChange={(value) => {
                      if (isReadOnly) return; // Prevent change if read-only
                      setVehicleId(value)
                    }} 
                    required 
                    disabled={!!preselectedBudgetId || vehicles.length === 0 || isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={vehicles.length === 0 ? "Nenhum veículo encontrado" : "Selecione um veículo"} />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem 
                          key={vehicle.id} 
                          value={vehicle.id}
                          disabled={isReadOnly}
                        >
                          {vehicle.brand} {vehicle.model} - {vehicle.plate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Datas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Início *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      if (isReadOnly) return; // Prevent change if read-only
                      setStartDate(e.target.value)
                    }}
                    required
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedEndDate">Previsão de Término *</Label>
                  <Input
                    id="estimatedEndDate"
                    type="date"
                    value={estimatedEndDate}
                    onChange={(e) => {
                      if (isReadOnly) return; // Prevent change if read-only
                      setEstimatedEndDate(e.target.value)
                    }}
                    required
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-base">Serviços</CardTitle>
              {!isReadOnly && (
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
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {services.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhum serviço adicionado.
                </div>
              ) : (
                services.map((service, index) => (
                  <div key={service.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Serviço {index + 1}</span>
                      {!isReadOnly && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeService(service.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição *</Label>
                      <Input
                        value={service.description}
                        onChange={(e) => updateService(service.id, "description", e.target.value)}
                        placeholder="Ex: Retífica de motor completa"
                        required
                        disabled={isReadOnly}
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
                          disabled={isReadOnly}
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
                          disabled={isReadOnly}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          value={service.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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
              {!isReadOnly && (
                <Button type="button" size="sm" variant="outline" onClick={addPart}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {parts.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  Nenhuma peça adicionada.
                </div>
              ) : (
                parts.map((part, index) => (
                  <div key={part.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Peça {index + 1}</span>
                      {!isReadOnly && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removePart(part.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Peça do Estoque</Label>
                      <Select
                        value={part.inventoryId || ""}
                        onValueChange={(value) => updatePartWithInventory(part.id, value)}
                        disabled={isReadOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma peça do estoque" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map((item) => (
                            <SelectItem key={item.id} value={item.id} disabled={isReadOnly}>
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
                        disabled={!!part.inventoryId || isReadOnly}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Código da Peça</Label>
                      <Input
                        value={part.partNumber}
                        onChange={(e) => updatePart(part.id, "partNumber", e.target.value)}
                        placeholder="Ex: JG-001"
                        disabled={!!part.inventoryId || isReadOnly}
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
                          disabled={isReadOnly}
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
                          disabled={isReadOnly}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          value={part.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => {
                    if (isReadOnly) return; // Prevent change if read-only
                    setNotes(e.target.value)
                  }}
                  placeholder="Informações adicionais sobre a ordem de serviço"
                  rows={3}
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mechanicNotes">Anotações do Mecânico</Label>
                <Textarea
                  id="mechanicNotes"
                  value={mechanicNotes}
                  onChange={(e) => {
                    if (isReadOnly) return; // Prevent change if read-only
                    setMechanicNotes(e.target.value)
                  }}
                  placeholder="Observações técnicas durante o serviço"
                  rows={3}
                  disabled={isReadOnly}
                />
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link href="/orders" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Cancelar
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={
                isReadOnly || 
                !customerId || 
                !vehicleId || 
                !estimatedEndDate || 
                isLoading
              }
            >
              {isLoading ? <Spinner className="w-4 h-4 mr-2" /> : null}
              {isReadOnly ? "Ver Ordem de Serviço" : (isEditing ? "Atualizar" : "Criar") + " Ordem de Serviço"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
