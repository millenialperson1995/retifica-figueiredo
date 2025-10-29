import { Suspense } from "react";
import { OrderForm } from "@/components/forms/order-form";

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  // Em uma aplicação real, buscaríamos a ordem de serviço pelo ID
  // Por enquanto, usaremos mock data
  // Nota: Como não temos uma função para recuperar ordens de serviço do storage,
  // esta funcionalidade será implementada quando tivermos backend
  
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <OrderForm orderId={id} isEditing={true} />
    </Suspense>
  );
}