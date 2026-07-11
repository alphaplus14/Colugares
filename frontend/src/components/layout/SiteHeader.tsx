"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { PillButton } from "@/components/ui/PillButton";

/** Secciones del home — viven en el mismo main (`/`) */
const homeSections = [
  { href: "/#historias", label: "Historias", hash: "historias" },
  { href: "/#regiones", label: "Regiones", hash: "regiones" },
  { href: "/#festividades", label: "Festividades", hash: "festividades" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [historiasOpen, setHistoriasOpen] = useState(false);
  const [mobileHistoriasOpen, setMobileHistoriasOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const solid = !isHome || scrolled;
  const destinosActive = pathname.startsWith("/destinos");

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
    setHistoriasOpen(false);
    setMobileHistoriasOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setHistoriasOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          aria-label="Colugares — inicio"
          className="relative block shrink-0 transition-opacity hover:opacity-90"
        >
          <Image
            src="/brand/logo.png"
            alt="Colugares — Descubre Colombia lugar por lugar"
            width={509}
            height={191}
            priority
            className="h-9 w-auto object-contain object-left sm:h-10 md:h-11"
          />
        </Link>

        {/* Desktop: Historias (submenu) + Destinos */}
        <nav className="hidden items-center gap-8 lg:flex">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={historiasOpen}
              aria-haspopup="true"
              onClick={() => setHistoriasOpen((open) => !open)}
              className="flex items-center gap-1.5 text-sm font-medium text-white/85 transition hover:text-brand-orange"
            >
              Historias
              <svg
                className={`h-3.5 w-3.5 transition-transform ${
                  historiasOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {historiasOpen && (
              <div className="absolute left-0 top-full z-50 mt-3 min-w-[200px] overflow-hidden rounded-2xl border border-white/10 bg-brand-navy/95 py-2 shadow-xl backdrop-blur-md">
                {homeSections.map((section) => (
                  <Link
                    key={section.hash}
                    href={sectionHref(section.hash)}
                    onClick={() => setHistoriasOpen(false)}
                    className="block px-4 py-2.5 text-sm text-white/85 transition hover:bg-white/10 hover:text-brand-orange"
                  >
                    {section.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/destinos"
            className={`text-sm font-medium transition hover:text-brand-orange ${
              destinosActive ? "text-brand-orange" : "text-white/85"
            }`}
          >
            Destinos
          </Link>
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
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              aria-expanded={mobileHistoriasOpen}
              onClick={() => setMobileHistoriasOpen((open) => !open)}
              className="flex items-center justify-between py-2 text-left text-base font-medium text-white"
            >
              Historias
              <svg
                className={`h-4 w-4 transition-transform ${
                  mobileHistoriasOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 4l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {mobileHistoriasOpen && (
              <div className="mb-2 ml-3 flex flex-col gap-1 border-l border-white/15 pl-4">
                {homeSections.map((section) => (
                  <Link
                    key={section.hash}
                    href={sectionHref(section.hash)}
                    className="py-2 text-sm text-white/75"
                    onClick={() => setMenuOpen(false)}
                  >
                    {section.label}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href="/destinos"
              className={`py-2 text-base font-medium ${
                destinosActive ? "text-brand-orange" : "text-white"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Destinos
            </Link>

            <hr className="my-3 border-white/10" />

            {session ? (
              <>
                {isViajero && (
                  <>
                    <Link
                      href="/planner"
                      className="py-2 text-sm text-white/80"
                      onClick={() => setMenuOpen(false)}
                    >
                      Planner
                    </Link>
                    <Link
                      href="/mi-perfil/itinerarios"
                      className="py-2 text-sm text-white/80"
                      onClick={() => setMenuOpen(false)}
                    >
                      Mis viajes
                    </Link>
                  </>
                )}
                {isStaff && (
                  <Link
                    href="/admin/dashboard"
                    className="py-2 text-sm text-white/80"
                    onClick={() => setMenuOpen(false)}
                  >
                    Panel Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="py-2 text-left text-sm text-white/80"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="py-2 text-sm text-white/80"
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            )}
            <PillButton href="/planner" className="mt-3 w-fit">
              Iniciar Aventura
            </PillButton>
          </nav>
        </div>
      )}
    </header>
  );
}
