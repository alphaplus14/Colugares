"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";
import type { PaginationMeta } from "@/lib/pagination";

interface AdminItineraryRow {
  _id: string;
  title: string;
  region: string;
  days_count: number;
  places_count: number;
  warnings_count: number;
  user_name: string;
  user_email: string;
  updated_at: string;
}

const PAGE_SIZE = 10;

export function ItinerariesListClient() {
  const [rows, setRows] = useState<AdminItineraryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    const response = await fetch(`/api/admin/itineraries?${params}`);
    const json = (await response.json()) as {
      data?: AdminItineraryRow[];
      pagination?: PaginationMeta;
    };
    setRows(json.data ?? []);
    setPagination(json.pagination ?? null);
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    void load();
  }, [load]);

  function handleSearch() {
    setPage(1);
    setSearch(q);
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este itinerario?")) return;
    const response = await fetch(`/api/admin/itineraries/${id}`, {
      method: "DELETE",
    });
    if (response.ok) void load();
  }

  const total = pagination?.total ?? rows.length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-deep">
          Viajes
        </p>
        <h1 className="font-display text-3xl text-brand-navy">Itinerarios</h1>
        <p className="text-sm text-brand-navy/50">
          Planes guardados por viajeros · {total} resultados
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Buscar por título..."
          className="w-full max-w-sm rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="rounded-full bg-brand-navy px-5 py-2 text-sm font-semibold text-white"
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-brand-navy/40">Cargando...</p>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-brand-navy/50">
          No hay itinerarios guardados.
        </p>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-brand-navy/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream/80 text-xs uppercase text-brand-navy/50">
                <tr>
                  <th className="px-4 py-3">Título</th>
                  <th className="px-4 py-3">Viajero</th>
                  <th className="px-4 py-3">Región</th>
                  <th className="px-4 py-3">Días</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="border-t border-brand-navy/5">
                    <td className="px-4 py-3 font-medium text-brand-navy">
                      {row.title}
                      {row.warnings_count > 0 && (
                        <span className="ml-2 text-[10px] text-amber-700">
                          {row.warnings_count} alertas
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brand-navy/70">
                      <div>{row.user_name}</div>
                      <div className="text-xs text-brand-navy/40">
                        {row.user_email}
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-brand-navy/70">
                      {row.region}
                    </td>
                    <td className="px-4 py-3 text-brand-navy/70">
                      {row.days_count}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/itinerarios/${row._id}`}
                          className="text-xs font-semibold text-brand-orange-deep hover:underline"
                        >
                          Ver / editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleDelete(row._id)}
                          className="text-xs font-semibold text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
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
              label="itinerarios"
            />
          )}
        </>
      )}
    </div>
  );
}
