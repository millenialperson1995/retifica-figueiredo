"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Users, Wrench, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/budgets", label: "Orçamentos", icon: FileText },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/orders", label: "OS", icon: Wrench },
  { href: "/inventory", label: "Estoque", icon: Package },
]

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user || pathname === "/login" || pathname === "/register") {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
