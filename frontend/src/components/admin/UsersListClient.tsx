"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Pagination } from "@/components/ui/Pagination";
import type { PaginationMeta } from "@/lib/pagination";
import type { UserRole } from "@/types/user.types";

interface AdminUserRow {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  onboarding_completed: boolean;
  itineraries_count: number;
  last_login: string;
}

const PAGE_SIZE = 10;

export function UsersListClient() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (roleFilter) params.set("role", roleFilter);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    const response = await fetch(`/api/admin/users?${params}`);
    const json = (await response.json()) as {
      data?: AdminUserRow[];
      pagination?: PaginationMeta;
    };
    setUsers(json.data ?? []);
    setPagination(json.pagination ?? null);
    setLoading(false);
  }, [roleFilter, page]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [roleFilter]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFormLoading(true);

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const json = (await response.json()) as { message?: string };
    setFormLoading(false);

    if (!response.ok) {
      setFormError(json.message ?? "No se pudo crear");
      return;
    }

    setShowForm(false);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    void load();
  }

  async function toggleActive(user: AdminUserRow) {
    const response = await fetch(`/api/admin/users/${user._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    if (response.ok) void load();
    else {
      const json = (await response.json()) as { message?: string };
      alert(json.message ?? "No permitido");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este usuario?")) return;
    const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (response.ok) void load();
    else {
      const json = (await response.json()) as { message?: string };
      alert(json.message ?? "No permitido");
    }
  }

  const total = pagination?.total ?? users.length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-deep">
            Equipo
          </p>
          <h1 className="font-display text-3xl text-brand-navy">Usuarios</h1>
          <p className="text-sm text-brand-navy/50">
            {total} cuentas ·{" "}
            {isAdmin ? "gestión completa" : "vista de viajeros"}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-navy"
          >
            {showForm ? "Cerrar" : "+ Nuevo empleado"}
          </button>
        )}
      </div>

      {isAdmin && showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-8 max-w-lg space-y-3 rounded-2xl border border-brand-navy/10 bg-white p-6"
        >
          <h2 className="font-semibold text-brand-navy">Crear empleado</h2>
          {formError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </p>
          )}
          <input
            required
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-brand-navy/15 px-4 py-2 text-sm"
          />
          <input
            required
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-brand-navy/15 px-4 py-2 text-sm"
          />
          <input
            required
            type="password"
            minLength={8}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-brand-navy/15 px-4 py-2 text-sm"
          />
          <input
            required
            type="password"
            minLength={8}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-xl border border-brand-navy/15 px-4 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={formLoading}
            className="rounded-full bg-brand-navy px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {formLoading ? "Creando..." : "Crear empleado"}
          </button>
        </form>
      )}

      <select
        className="mb-4 rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-sm"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="">Todos los roles</option>
        <option value="viajero">Viajeros</option>
        {isAdmin && <option value="empleado">Empleados</option>}
        {isAdmin && <option value="admin">Admins</option>}
      </select>

      {loading ? (
        <p className="text-sm text-brand-navy/40">Cargando...</p>
      ) : users.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-brand-navy/50">
          No hay usuarios en esta página.
        </p>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-brand-navy/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream/80 text-xs uppercase text-brand-navy/50">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Planes</th>
                  {isAdmin && <th className="px-4 py-3">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-t border-brand-navy/5">
                    <td className="px-4 py-3">
                      <div className="font-medium text-brand-navy">
                        {user.name}
                      </div>
                      <div className="text-xs text-brand-navy/40">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-brand-navy/70">
                      {user.role === "admin" ? "super-admin" : user.role}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brand-navy/70">
                      {user.itineraries_count}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {user.role !== "admin" && (
                            <>
                              <button
                                type="button"
                                onClick={() => void toggleActive(user)}
                                className="text-xs font-semibold text-brand-navy/60 hover:underline"
                              >
                                {user.active ? "Desactivar" : "Activar"}
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleDelete(user._id)}
                                className="text-xs font-semibold text-red-600 hover:underline"
                              >
                                Eliminar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={setPage}
              label="usuarios"
            />
          )}
        </>
      )}
    </div>
  );
}
