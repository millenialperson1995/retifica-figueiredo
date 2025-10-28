import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR")
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

export function getStatusColor(
  status: "pending" | "approved" | "rejected" | "in-progress" | "completed" | "cancelled",
): string {
  const colors = {
    pending: "text-yellow-600",
    approved: "text-green-600",
    rejected: "text-red-600",
    "in-progress": "text-blue-600",
    completed: "text-green-600",
    cancelled: "text-red-600",
  }
  return colors[status]
}

export function getStatusLabel(
  status: "pending" | "approved" | "rejected" | "in-progress" | "completed" | "cancelled",
): string {
  const labels = {
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
    "in-progress": "Em Andamento",
    completed: "Concluída",
    cancelled: "Cancelada",
  }
  return labels[status]
}
