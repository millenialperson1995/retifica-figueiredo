import { Suspense } from "react";
import { BudgetForm } from "@/components/forms/budget-form";
import { getBudgets } from "@/lib/storage";

export default async function EditBudgetPage({ params }: { params: Promise<{ id: string }> }) {
  // Em uma aplicação real, buscaríamos o orçamento pelo ID
  // Por enquanto, usaremos mock data
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const budgets = getBudgets();
  const budget = budgets.find(b => b.id === id);
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <BudgetForm budget={budget} isEditing={true} />
    </Suspense>
  );
}