"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { AppHeader } from "@/components/app-header";
import { Search, Package, Plus, AlertCircle } from "lucide-react";
import { apiServiceOptimized } from "@/lib/apiOptimized";
import { InventoryItem } from "@/lib/types";

import AuthGuard from "@/components/auth-guard";

export default function InventoryPage() {
  return (
    <AuthGuard>
      <InventoryContent />
    </AuthGuard>
  );
}

function InventoryContent() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryRes = await apiServiceOptimized.getInventory();
        // Handle both paginated and non-paginated responses
        const inventoryData = Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as any).data;
        setInventory(inventoryData);
      } catch (error) {
        console.error('Erro ao buscar itens de estoque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Filter inventory items based on search term and category
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for the filter
  const categories = ["all", ...new Set(inventory.map(item => item.category))];

  // Calculate inventory stats
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <>
      <AppHeader />
      <div className="min-h-screen pb-20">
        <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
          <PageHeader title="Gestão de Estoque" description="Controle e gerencie seu estoque de peças e materiais" />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Total de Itens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground">Itens cadastrados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 text-orange-500">
                  <AlertCircle className="w-4 h-4" />
                  Estoque Baixo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Itens abaixo do mínimo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Valor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalValue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Valor em estoque</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <Link href="/inventory/new" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </Link>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar itens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-md px-3 py-2 bg-background text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "Todas as categorias" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Inventory List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Itens em Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredInventory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum item encontrado
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredInventory.map(item => (
                    <Link key={item.id} href={`/inventory/${item.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer border-border hover:border-primary/30">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold truncate">{item.name}</h3>
                            <Badge variant={item.quantity <= item.minQuantity ? "destructive" : "default"} className="ml-2">
                              {item.quantity <= item.minQuantity ? "Baixo" : "Normal"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground text-wrap line-clamp-2">{item.description}</p>
                          <div className="mt-3 flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">{item.quantity} un</p>
                              <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {item.unitPrice.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}