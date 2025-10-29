import React, { Suspense } from "react";
import { OrderForm } from "@/components/forms/order-form";

export default function EditOrderPage({ params }: { params: { id: string } }) {
  // Em uma aplicação real, buscaríamos a ordem de serviço pelo ID
  // Por enquanto, usaremos mock data
  // Nota: Como não temos uma função para recuperar ordens de serviço do storage,
  // esta funcionalidade será implementada quando tivermos backend
  
  const id = React.use(params).id;
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <OrderForm orderId={id} isEditing={true} />
    </Suspense>
  );
}