import { Suspense } from "react"
import { OrderForm } from "@/components/forms/order-form";
import AuthGuard from "@/components/auth-guard";

export default function NewOrderPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
        <OrderForm />
      </Suspense>
    </AuthGuard>
  )
}
