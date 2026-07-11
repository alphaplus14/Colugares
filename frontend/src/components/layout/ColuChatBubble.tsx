"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Burbuja fija para abrir el chat con Colu (planner).
 * Se oculta en /planner y /onboarding para no competir con el flujo activo.
 */
export function ColuChatBubble() {
  const pathname = usePathname();
  const hidden =
    pathname.startsWith("/planner") || pathname.startsWith("/onboarding");

  if (hidden) {
    return null;
  }

  return (
    <Link
      href="/planner"
      aria-label="Chatea con nuestra IA Colu"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-white/15 bg-brand-navy/95 py-2 pl-2 pr-4 shadow-xl shadow-black/25 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-brand-orange/40 hover:bg-brand-navy sm:bottom-6 sm:right-6 sm:pr-5"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-2 ring-brand-orange/50 transition group-hover:ring-brand-orange">
        <Image
          src="/brand/colu.png"
          alt=""
          width={267}
          height={237}
          className="h-9 w-auto object-contain"
          aria-hidden
        />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-orange">
          Colu
        </span>
        <span className="text-sm font-semibold text-white">
          Chatea con nuestra IA
        </span>
      </span>
    </Link>
  );
}
