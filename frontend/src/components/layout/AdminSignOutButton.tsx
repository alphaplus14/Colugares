"use client";

import { signOut } from "next-auth/react";

export function AdminSignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
    >
      Cerrar sesión
    </button>
  );
}
