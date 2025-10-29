import { Suspense } from "react"
import { BudgetForm } from "@/components/forms/budget-form";
import AuthGuard from "@/components/auth-guard";

export default function NewBudgetPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
        <BudgetForm />
      </Suspense>
    </AuthGuard>
  )
}
