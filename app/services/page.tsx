"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "@/components/page-header";
import { Plus, Search, Edit, Trash2, Eye, Clock, Wrench } from "lucide-react";
import { StandardService } from "@/lib/types";
import { mockStandardServices, getActiveStandardServices } from "@/lib/mock-data";

export default function ServicesPage() {
  const [services, setServices] = useState<StandardService[]>(getActiveStandardServices());
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<StandardService | null>(null);

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOrUpdateService = (service: StandardService) => {
    if (editingService) {
      // Atualizar serviço existente
      setServices(services.map(s => s.id === service.id ? service : s));
    } else {
      // Adicionar novo serviço
      setServices([...services, service]);
    }
    setIsDialogOpen(false);
    setEditingService(null);
  };

  const handleEdit = (service: StandardService) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    // Na versão real, aqui seria uma chamada API para excluir
    // Na versão mock, apenas filtramos o serviço
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
      <PageHeader title="Catálogo de Serviços" description="Gerencie os serviços padrão da oficina" />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar serviços..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingService(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? "Editar Serviço" : "Novo Serviço"}</DialogTitle>
            </DialogHeader>
            <ServiceForm
              service={editingService}
              onSubmit={handleCreateOrUpdateService}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingService(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Serviços Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServices.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Nenhum serviço encontrado
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço Base</TableHead>
                    <TableHead>Duração Est.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{service.description}</div>
                      </TableCell>
                      <TableCell>
                        {service.category ? (
                          <Badge variant="secondary">{service.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {service.basePrice.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{service.duration || "-"}h</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={service.isActive ? "default" : "destructive"}>
                          {service.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ServiceFormProps {
  service?: StandardService | null;
  onSubmit: (service: StandardService) => void;
  onCancel: () => void;
}

function ServiceForm({ service, onSubmit, onCancel }: ServiceFormProps) {
  const [name, setName] = useState(service?.name || "");
  const [description, setDescription] = useState(service?.description || "");
  const [category, setCategory] = useState(service?.category || "");
  const [duration, setDuration] = useState(service?.duration?.toString() || "");
  const [basePrice, setBasePrice] = useState(service?.basePrice.toString() || "");
  const [isActive, setIsActive] = useState(service?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newService: StandardService = {
      id: service?.id || `service-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      duration: duration ? parseFloat(duration) : undefined,
      basePrice: parseFloat(basePrice) || 0,
      isActive,
      createdAt: service?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSubmit(newService);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Serviço</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Retífica de motor completo"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Motor, Freios, Suspensão"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição detalhada do serviço"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duração Estimada (horas)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Ex: 20"
            step="0.5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="basePrice">Preço Base (R$)</Label>
          <Input
            id="basePrice"
            type="number"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            placeholder="Ex: 1200.00"
            step="0.01"
            min="0"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 rounded border-input bg-background"
        />
        <Label htmlFor="isActive">Serviço Ativo</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {service ? "Atualizar Serviço" : "Criar Serviço"}
        </Button>
      </div>
    </form>
  );
}