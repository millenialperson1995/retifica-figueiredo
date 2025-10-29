"use client";

import { useUser } from "@clerk/nextjs";
import { MobileNav } from "@/components/mobile-nav";

export default function AuthenticatedMobileNav() {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    return null; // Não renderiza o MobileNav se o usuário não estiver logado
  }

  return <MobileNav />;
}