import type { BudgetStatus, OrderStatus } from "@/lib/mock-data"

interface StatusBadgeProps {
  status: BudgetStatus | OrderStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  }

  const labels = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Reprovado",
    "in-progress": "Em Andamento",
    completed: "Concluído",
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
