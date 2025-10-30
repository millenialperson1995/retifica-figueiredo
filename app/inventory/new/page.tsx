"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PageHeader } from "@/components/page-header";
import { AppHeader } from "@/components/app-header";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api";

// Define the form schema
const inventoryItemSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  description: z.string().min(5, { message: "Descrição deve ter pelo menos 5 caracteres" }),
  category: z.string().min(1, { message: "Categoria é obrigatória" }),
  sku: z.string().min(1, { message: "SKU é obrigatório" }),
  quantity: z.string().regex(/^\d+$/, { message: "Quantidade deve ser um número inteiro" }),
  minQuantity: z.string().regex(/^\d+$/, { message: "Quantidade mínima deve ser um número inteiro" }),
  unitPrice: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Preço deve ser um número válido" }),
  supplier: z.string().optional(),
  notes: z.string().optional(),
});

import AuthGuard from "@/components/auth-guard";

export default function NewInventoryItemPage() {
  return (
    <AuthGuard>
      <NewInventoryContent />
    </AuthGuard>
  );
}

function NewInventoryContent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof inventoryItemSchema>>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      sku: "",
      quantity: "0",
      minQuantity: "5",
      unitPrice: "0",
      supplier: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof inventoryItemSchema>) {
    setIsSubmitting(true);
    try {
      // transform fields to proper types
      const payload = {
        name: values.name,
        description: values.description,
        category: values.category,
        sku: values.sku,
        quantity: Number(values.quantity),
        minQuantity: Number(values.minQuantity),
        unitPrice: Number(values.unitPrice),
        supplier: values.supplier || undefined,
        notes: values.notes || undefined,
      };

      const created = await apiService.createInventoryItem(payload);

      form.reset();
      alert("Item adicionado ao estoque com sucesso!");
      // Redirect to the created item's detail page if available
      if (created?.id) {
        router.push(`/inventory/${created.id}`);
      } else {
        router.push("/inventory");
      }
    } catch (err: any) {
      console.error('Erro ao criar item de inventário:', err);
      alert(err?.message || 'Erro ao criar item');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen pb-20">
        <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
          <PageHeader 
            title="Adicionar Item ao Estoque" 
            description="Adicione um novo produto ou peça ao seu estoque"
          />

          <Card>
            <CardHeader>
              <CardTitle>Informações do Item</CardTitle>
              <CardDescription>
                Preencha todas as informações necessárias para cadastrar o item no estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Filtro de óleo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU *</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: FO-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Filtros">Filtros</SelectItem>
                              <SelectItem value="Freios">Freios</SelectItem>
                              <SelectItem value="Juntas">Juntas</SelectItem>
                              <SelectItem value="Lubrificantes">Lubrificantes</SelectItem>
                              <SelectItem value="Suspensão">Suspensão</SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supplier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fornecedor</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Autopecas Ltda" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minQuantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade Mínima *</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unitPrice"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Preço Unitário *</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descrição detalhada do item..." 
                            rows={3}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Informações adicionais..." 
                            rows={2}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Informações complementares sobre o item
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Salvando..." : "Adicionar Item"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}