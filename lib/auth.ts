// lib/auth.ts
// Helper function to authenticate API requests - placeholder for future authentication

export function authenticateAPIRequest(): { authenticated: boolean; userId?: string } {
  // Por enquanto, permitir todas as requisições
  // Futuramente podemos implementar nossa própria lógica de autenticação
  return { authenticated: true, userId: 'default-user' };
}