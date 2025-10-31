import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/toaster"
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
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0A1128" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <link rel="apple-touch-icon" href="/icone-192x192.png" />
          <link rel="icon" sizes="192x192" href="/icone-192x192.png" />
          <link rel="icon" sizes="512x512" href="/icone-512x512.png" />
        </head>
        <body className={inter.className}>
          {children}
          <AuthenticatedMobileNav />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
