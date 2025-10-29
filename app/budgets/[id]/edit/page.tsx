import React, { Suspense } from "react";
import { BudgetForm } from "@/components/forms/budget-form";
import { getBudgets } from "@/lib/storage";

export default function EditBudgetPage({ params }: { params: { id: string } }) {
  // Em uma aplicação real, buscaríamos o orçamento pelo ID
  // Por enquanto, usaremos mock data
  const id = React.use(params).id;
  const budgets = getBudgets();
  const budget = budgets.find(b => b.id === id);
  
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <BudgetForm budget={budget} isEditing={true} />
    </Suspense>
  );
}