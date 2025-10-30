import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"
import AuthenticatedMobileNav from "./authenticated-mobile-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Retífica Figueirêdo - Sistema de Gestão",
  description: "Sistema de gestão de orçamentos e ordens de serviço",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={inter.className}>
          {children}
          <AuthenticatedMobileNav />
        </body>
      </html>
    </ClerkProvider>
  )
}
