import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas protegidas que requerem autenticação
const protectedRoutes = [
  '/',
  '/budgets',
  '/orders',
  '/customers',
  '/inventory',
  '/services',
]

// Verifica se a rota requer proteção
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Se for uma rota protegida, permitir acesso (por enquanto sem autenticação)
  if (isProtectedRoute(pathname)) {
    // Futuramente aqui podemos adicionar nossa própria lógica de autenticação
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}