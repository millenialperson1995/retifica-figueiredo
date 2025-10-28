import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { AppHeader } from "@/components/app-header";
import { FileText, Package, AlertCircle, DollarSign } from "lucide-react";
import { getInventoryById } from "@/lib/mock-data";
import Link from "next/link";

interface InventoryItemPageProps {
  params: {
    id: string;
  };
}

export default function InventoryItemPage({ params }: InventoryItemPageProps) {
  const item = getInventoryById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen pb-20">
        <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
          <PageHeader 
            title={item.name} 
            description={`Detalhes do item de estoque - SKU: ${item.sku}`}
          />

          <div className="flex gap-3">
            <Link href="/inventory">
              <Button variant="outline">
                Voltar para Estoque
              </Button>
            </Link>
            <Link href={`/inventory/${params.id}/edit`}>
              <Button>
                Editar Item
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Info Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Informações do Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">SKU</h3>
                    <p className="font-medium">{item.sku}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Categoria</h3>
                    <p className="font-medium">{item.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Fornecedor</h3>
                    <p className="font-medium">{item.supplier || "N/A"}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h3>
                  <p>{item.description}</p>
                </div>
                
                {item.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Observações</h3>
                    <p>{item.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Quantidade</h3>
                    <p className="text-2xl font-bold">{item.quantity}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Mínimo</h3>
                    <p className="text-lg font-semibold">{item.minQuantity}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Preço Unitário</h3>
                    <p className="text-lg font-semibold">
                      {item.unitPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Classificação</h3>
                  <Badge variant={item.quantity <= item.minQuantity ? "destructive" : "default"}>
                    {item.quantity <= item.minQuantity ? "Estoque Baixo" : "Em Estoque"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}