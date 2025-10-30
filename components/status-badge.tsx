type Status = 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed'

interface StatusBadgeProps {
  status: Status
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: "bg-[rgb(var(--color-muted))] text-[rgb(var(--color-muted-foreground))]",
    approved: "bg-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-foreground))]",
    rejected: "bg-[rgb(var(--color-destructive))] text-[rgb(var(--color-destructive-foreground))]",
    "in-progress": "bg-[rgb(var(--color-primary))] text-[rgb(var(--color-primary-foreground))]",
    completed: "bg-[rgb(var(--color-accent))] text-[rgb(var(--color-accent-foreground))]",
  }

  const labels = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Reprovado",
    "in-progress": "Em Andamento",
    completed: "Concluído",
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  )
}
