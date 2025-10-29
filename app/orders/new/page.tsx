import { Suspense } from "react"
import { OrderForm } from "@/components/forms/order-form";

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <OrderForm />
    </Suspense>
  )
}
