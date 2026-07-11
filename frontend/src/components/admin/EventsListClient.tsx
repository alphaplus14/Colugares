"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { regionCoverImages } from "@/lib/admin-content";
import { COLOMBIA_REGIONS } from "@/lib/constants/colombia-regions";
import { Pagination } from "@/components/ui/Pagination";
import type { PaginationMeta } from "@/lib/pagination";
import type { AdminEventItem } from "@/types/event.types";

const PAGE_SIZE = 12;

export function EventsListClient() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (region) params.set("region", region);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));
    const response = await fetch(`/api/admin/events?${params}`);
    const json = (await response.json()) as {
      data?: AdminEventItem[];
      pagination?: PaginationMeta;
    };
    setEvents(json.data ?? []);
    setPagination(json.pagination ?? null);
    setLoading(false);
  }, [region, page]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [region]);

  async function toggleActive(event: AdminEventItem) {
    await fetch(`/api/admin/events/${event._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !event.active }),
    });
    void load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar permanentemente esta festividad?")) return;
    const response = await fetch(`/api/admin/events/${id}`, {
      method: "DELETE",
    });
    if (response.ok) void load();
    else alert("Solo el super-admin puede eliminar");
  }

  const total = pagination?.total ?? events.length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-deep">
            Calendario
          </p>
          <h1 className="font-display text-3xl text-brand-navy">
            Festividades
          </h1>
          <p className="text-sm text-brand-navy/50">
            {total} eventos · home y Colu
          </p>
        </div>
        <Link
          href="/admin/eventos/nuevo"
          className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-navy"
        >
          + Nueva festividad
        </Link>
      </div>

      <select
        className="mb-6 rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-sm"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      >
        <option value="">Todas las regiones</option>
        {COLOMBIA_REGIONS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      {loading ? (
        <p className="text-sm text-brand-navy/40">Cargando...</p>
      ) : events.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-brand-navy/20 bg-white p-8 text-center text-sm text-brand-navy/50">
          No hay festividades. Crea la primera.
        </p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => {
              const cover =
                regionCoverImages[event.region] ?? regionCoverImages.caribe;
              return (
                <article
                  key={event._id}
                  className="overflow-hidden rounded-2xl border border-brand-navy/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                    <span className="absolute left-3 top-3 rounded-full bg-brand-orange/95 px-2.5 py-0.5 text-[10px] font-bold uppercase text-brand-navy">
                      {event.month_label}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h2 className="line-clamp-1 font-display text-lg text-white">
                        {event.name}
                      </h2>
                      <p className="text-xs text-white/70">{event.city}</p>
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <p className="line-clamp-2 text-xs leading-relaxed text-brand-navy/60">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          event.active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {event.active ? "Activo" : "Inactivo"}
                      </span>
                      <div className="flex gap-2 text-xs font-semibold">
                        <Link
                          href={`/admin/eventos/${event._id}/editar`}
                          className="text-brand-orange-deep hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => void toggleActive(event)}
                          className="text-brand-navy/50 hover:text-brand-navy"
                        >
                          {event.active ? "Off" : "On"}
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => void handleDelete(event._id)}
                            className="text-red-600"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {pagination && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={setPage}
              label="festividades"
            />
          )}
        </>
      )}
    </div>
  );
}
