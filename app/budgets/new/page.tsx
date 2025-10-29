import { Suspense } from "react"
import { BudgetForm } from "@/components/forms/budget-form";

export default function NewBudgetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <BudgetForm />
    </Suspense>
  )
}
