"use client";

import { MobileNav } from "@/components/mobile-nav";

export default function AuthenticatedMobileNav() {
  // Sempre mostrar a navegação móvel agora que removemos a autenticação do Clerk
  return <MobileNav />;
}