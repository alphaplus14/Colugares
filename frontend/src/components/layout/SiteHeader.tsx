"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { PillButton } from "@/components/ui/PillButton";

const homeNavLinks = [
  { hash: "historias", label: "Historias" },
  { hash: "regiones", label: "Regiones" },
  { hash: "destinos", label: "Destinos" },
  { hash: "festividades", label: "Festividades" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  // En páginas internas (planner, perfil…) siempre fondo sólido para legibilidad
  const solid = !isHome || scrolled;

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isStaff =
    session?.user?.role === "admin" || session?.user?.role === "empleado";
  const isViajero = session?.user?.role === "viajero";

  function sectionHref(hash: string): string {
    return isHome ? `#${hash}` : `/#${hash}`;
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-godo ${
        solid
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
          {homeNavLinks.map((link) => (
            <Link
              key={link.hash}
              href={sectionHref(link.hash)}
              className="text-sm font-medium text-white/85 transition hover:text-brand-orange"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {status === "loading" ? (
            <span className="text-sm text-white/50">...</span>
          ) : session ? (
            <>
              {isViajero && (
                <>
                  <Link
                    href="/planner"
                    className={`text-sm font-medium transition ${
                      pathname.startsWith("/planner")
                        ? "text-brand-orange"
                        : "text-white/80 hover:text-brand-orange"
                    }`}
                  >
                    Planner
                  </Link>
                  <Link
                    href="/mi-perfil/itinerarios"
                    className={`text-sm font-medium transition ${
                      pathname.startsWith("/mi-perfil")
                        ? "text-brand-orange"
                        : "text-white/80 hover:text-brand-orange"
                    }`}
                  >
                    Mis viajes
                  </Link>
                </>
              )}
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
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-white/30 px-3 py-1 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                Salir
              </button>
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
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/icons/close.svg" alt="" className="h-4 w-4 invert" />
          ) : (
            <span className="text-lg leading-none">☰</span>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-brand-navy/98 px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-4">
            {homeNavLinks.map((link) => (
              <Link
                key={link.hash}
                href={sectionHref(link.hash)}
                className="text-base font-medium text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/10" />
            {session ? (
              <>
                {isViajero && (
                  <>
                    <Link
                      href="/planner"
                      className="text-sm text-white/80"
                      onClick={() => setMenuOpen(false)}
                    >
                      Planner
                    </Link>
                    <Link
                      href="/mi-perfil/itinerarios"
                      className="text-sm text-white/80"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mis viajes
                    </Link>
                  </>
                )}
                {isStaff && (
                  <Link
                    href="/admin/dashboard"
                    className="text-sm text-white/80"
                    onClick={() => setMenuOpen(false)}
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-left text-sm text-white/80"
                >
                  Cerrar sesión
                </button>
              </>
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
