"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ColuChatBubble } from "@/components/layout/ColuChatBubble";

/**
 * Layout público: navbar fija siempre visible.
 * En /planner ocultamos el footer para priorizar chat + mapa.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/planner") || pathname.startsWith("/onboarding");

  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      {!hideFooter && <SiteFooter />}
      <ColuChatBubble />
    </>
  );
}
