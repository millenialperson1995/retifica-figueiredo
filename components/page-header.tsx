interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      {/* brand accent bar */}
      <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-[rgb(var(--brand-start))] to-[rgb(var(--brand-end))]" />
    </div>
  )
}
