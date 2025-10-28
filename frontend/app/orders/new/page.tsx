import { Suspense } from "react"
import { NewOrderForm } from "./new-order-form"

export default function NewOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <NewOrderForm />
    </Suspense>
  )
}
