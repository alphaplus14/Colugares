import { auth } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mb-8 text-gray-600">
        Bienvenido al panel de administración de Colugares.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Sesión activa</p>
          <p className="mt-1 text-lg font-semibold text-colombia-green">
            {session?.user?.email}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Rol</p>
          <p className="mt-1 text-lg font-semibold capitalize">
            {session?.user?.role}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Estado Fase 1</p>
          <p className="mt-1 text-lg font-semibold text-colombia-gold">
            Base operativa
          </p>
        </div>
      </div>
    </div>
  );
}
