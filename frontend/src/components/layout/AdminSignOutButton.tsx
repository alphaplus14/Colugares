"use client";

import { signOut } from "next-auth/react";

export function AdminSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-brand-orange/90"
    >
      Salir
    </button>
  );
}
