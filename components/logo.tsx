import { Wrench } from "lucide-react"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-primary rounded-lg p-2">
        <Wrench className="w-5 h-5 text-primary-foreground" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg leading-none">Retífica</span>
        <span className="text-xs text-muted-foreground leading-none">Figueirêdo</span>
      </div>
    </div>
  )
}
