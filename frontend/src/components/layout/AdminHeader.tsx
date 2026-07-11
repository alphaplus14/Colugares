"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminSignOutButton } from "@/components/layout/AdminSignOutButton";

interface AdminHeaderProps {
  userName?: string | null;
  roleLabel?: string;
}

export function AdminHeader({ userName, roleLabel }: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/95 backdrop-blur-md">
      <nav className="flex items-center justify-between gap-4 px-6 py-3.5">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="font-display text-xl text-white">
            Colugares
            <span className="ml-2 text-xs font-body font-semibold uppercase tracking-widest text-brand-orange">
              Admin
            </span>
          </Link>
          <p className="hidden text-xs text-white/40 lg:block">
            {pathname.replace("/admin/", "").split("/")[0] || "dashboard"}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden text-right sm:block">
            <p className="max-w-[140px] truncate text-sm text-white/90">
              {userName}
            </p>
            {roleLabel && (
              <p className="text-[10px] uppercase tracking-wide text-brand-orange">
                {roleLabel}
              </p>
            )}
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Ver portal
          </Link>
          <AdminSignOutButton />
        </div>
      </nav>
    </header>
  );
}
