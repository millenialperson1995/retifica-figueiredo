import { Suspense } from "react";
import { OrderForm } from "@/components/forms/order-form";
import AuthGuard from "@/components/auth-guard";

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
        <OrderForm orderId={id} isEditing={true} />
      </Suspense>
    </AuthGuard>
  );
}