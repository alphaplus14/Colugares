"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PillButton } from "@/components/ui/PillButton";

const navLinks = [
  { href: "#historias", label: "Historias" },
  { href: "#regiones", label: "Regiones" },
  { href: "#destinos", label: "Destinos" },
  { href: "#festividades", label: "Festividades" },
] as const;

export function SiteHeader() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isStaff =
    session?.user?.role === "admin" || session?.user?.role === "empleado";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-godo ${
        scrolled
          ? "border-b border-white/10 bg-brand-navy/95 py-3 shadow-lg backdrop-blur-md"
          : "bg-gradient-to-b from-black/50 to-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-white md:text-2xl"
        >
          Colugares
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/85 transition hover:text-brand-orange"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {status === "loading" ? (
            <span className="text-sm text-white/50">...</span>
          ) : session ? (
            <>
              {isStaff && (
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-medium text-white/80 hover:text-white"
                >
                  Panel
                </Link>
              )}
              <span className="max-w-[120px] truncate text-sm text-white/70">
                {session.user.name ?? session.user.email}
              </span>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 hover:text-white"
            >
              Iniciar sesión
            </Link>
          )}
          <PillButton href="/planner" size="sm">
            Iniciar Aventura
          </PillButton>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <img src="/icons/close.svg" alt="" className="h-4 w-4 invert" />
          ) : (
            <span className="text-lg leading-none">☰</span>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-brand-navy/98 px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-base font-medium text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="border-white/10" />
            {session ? (
              isStaff && (
                <Link
                  href="/admin/dashboard"
                  className="text-sm text-white/80"
                  onClick={() => setMenuOpen(false)}
                >
                  Panel Admin
                </Link>
              )
            ) : (
              <Link
                href="/login"
                className="text-sm text-white/80"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            )}
            <PillButton href="/planner" className="w-fit">
              Iniciar Aventura
            </PillButton>
          </nav>
        </div>
      )}
    </header>
  );
}
