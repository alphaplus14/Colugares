"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminModuleVisuals } from "@/lib/admin-content";

interface AdminSidebarProps {
  isAdmin: boolean;
  userName: string;
  roleLabel: string;
}

const links = [
  { href: "/admin/dashboard", label: "Dashboard", key: null },
  { href: "/admin/lugares", label: "Lugares", key: "lugares" as const },
  { href: "/admin/eventos", label: "Festividades", key: "eventos" as const },
  {
    href: "/admin/itinerarios",
    label: "Itinerarios",
    key: "itinerarios" as const,
  },
  { href: "/admin/usuarios", label: "Usuarios", key: "usuarios" as const },
];

export function AdminSidebar({
  isAdmin,
  userName,
  roleLabel,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-navy/10 bg-white md:flex">
      <div className="relative h-28 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={adminModuleVisuals.lugares.image}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="truncate text-sm font-semibold text-white">{userName}</p>
          <p className="text-[10px] uppercase tracking-wider text-brand-orange">
            {roleLabel}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-brand-navy/35">
          Menú
        </p>
        {links.map((link) => {
          if (link.key === "usuarios" && !isAdmin) {
            // Empleados ven viajeros con otro label
          }
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          const visual = link.key ? adminModuleVisuals[link.key] : null;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-xl px-2 py-2 transition ${
                active
                  ? "bg-brand-navy text-white shadow-md"
                  : "text-brand-navy/80 hover:bg-brand-cream"
              }`}
            >
              {visual ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={visual.image}
                  alt=""
                  className="h-9 w-9 rounded-lg object-cover"
                />
              ) : (
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                    active
                      ? "bg-brand-orange text-brand-navy"
                      : "bg-brand-cream text-brand-navy"
                  }`}
                >
                  ◆
                </span>
              )}
              <span className="text-sm font-medium">
                {link.key === "usuarios" && !isAdmin ? "Viajeros" : link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-navy/10 p-4">
        <Link
          href="/admin/lugares/nuevo"
          className="flex w-full items-center justify-center rounded-full bg-brand-orange py-2.5 text-xs font-bold uppercase tracking-wide text-brand-navy transition hover:bg-brand-orange/90"
        >
          + Nuevo lugar
        </Link>
      </div>
    </aside>
  );
}
