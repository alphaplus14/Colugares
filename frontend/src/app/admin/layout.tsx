import Link from "next/link";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white p-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Panel Admin
        </p>
        <p className="mb-6 text-sm text-gray-600">
          {session?.user?.name ?? "Usuario"}
          <span className="mt-0.5 block text-xs capitalize text-colombia-green">
            {session?.user?.role}
          </span>
        </p>

        <nav className="space-y-1">
          <Link
            href="/admin/dashboard"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/lugares"
            className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Lugares
          </Link>
          <Link
            href="/admin/usuarios"
            className="block rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100"
          >
            Usuarios (Fase 2)
          </Link>
        </nav>
      </aside>

      <div className="flex-1 bg-gray-50 p-8">{children}</div>
    </div>
  );
}
