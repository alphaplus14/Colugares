"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-colombia-green">
          Colugares
        </Link>

        <div className="flex items-center gap-4">
          {status === "loading" ? (
            <span className="text-sm text-gray-400">Cargando...</span>
          ) : session ? (
            <>
              {session.user.role === "viajero" && (
                <>
                  <Link
                    href="/planner"
                    className="text-sm font-medium text-gray-700 hover:text-colombia-green"
                  >
                    Planner
                  </Link>
                  <Link
                    href="/mi-perfil/itinerarios"
                    className="text-sm font-medium text-gray-700 hover:text-colombia-green"
                  >
                    Mis viajes
                  </Link>
                </>
              )}
              {(session.user.role === "admin" ||
                session.user.role === "empleado") && (
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-colombia-green"
                >
                  Panel Admin
                </Link>
              )}
              <span className="text-sm text-gray-600">
                {session.user.name ?? session.user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-colombia-green px-4 py-2 text-sm font-medium text-white hover:bg-colombia-green/90"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
