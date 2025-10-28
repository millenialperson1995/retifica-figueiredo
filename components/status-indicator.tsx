import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "pending" | "approved" | "rejected" | "in-progress" | "completed" | "cancelled"
  size?: "sm" | "md" | "lg"
}

export function StatusIndicator({ status, size = "md" }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  }

  const statusColors = {
    pending: "bg-yellow-500",
    approved: "bg-green-500",
    rejected: "bg-red-500",
    "in-progress": "bg-blue-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
  }

  return (
    <div className={cn("rounded-full", sizeClasses[size], statusColors[status])} aria-label={`Status: ${status}`} />
  )
}
