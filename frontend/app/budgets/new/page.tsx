import { Suspense } from "react"
import { NewBudgetForm } from "./new-budget-form"

export default function NewBudgetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <NewBudgetForm />
    </Suspense>
  )
}
