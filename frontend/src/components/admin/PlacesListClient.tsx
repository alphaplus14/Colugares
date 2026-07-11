"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { placeFallbackImage } from "@/lib/admin-content";
import { Pagination } from "@/components/ui/Pagination";
import type { PaginationMeta } from "@/lib/pagination";
import type { Place, PlacesListResponse } from "@/types/place.types";
import {
  EMBEDDING_STATUS_LABELS,
  PLACE_TYPE_LABELS,
  REGION_LABELS,
} from "@/types/place.types";

function EmbeddingBadge({ status }: { status: Place["embedding_status"] }) {
  const colors = {
    pending: "bg-brand-orange/25 text-brand-orange-deep",
    ready: "bg-emerald-100 text-emerald-800",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${colors[status]}`}
    >
      {EMBEDDING_STATUS_LABELS[status]}
    </span>
  );
}

const PAGE_SIZE = 12;

export function PlacesListClient() {
  const { data: session } = useSession();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [filter, setFilter] = useState({ region: "", type: "" });

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.region) params.set("region", filter.region);
    if (filter.type) params.set("type", filter.type);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    const response = await fetch(`/api/places?${params.toString()}`);
    const data = (await response.json()) as PlacesListResponse;
    setPlaces(data.data ?? []);
    setPagination(data.pagination ?? null);
    setLoading(false);
  }, [filter, page]);

  useEffect(() => {
    void loadPlaces();
  }, [loadPlaces]);

  useEffect(() => {
    setPage(1);
  }, [filter.region, filter.type]);

  async function handleDeactivate(id: string) {
    if (!confirm("¿Desactivar este lugar?")) return;
    await fetch(`/api/places/${id}?action=deactivate`, { method: "PATCH" });
    void loadPlaces();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar permanentemente? Solo administradores.")) return;
    const response = await fetch(`/api/places/${id}`, { method: "DELETE" });
    if (response.ok) void loadPlaces();
    else alert("No tienes permiso o el lugar no existe");
  }

  async function handleReindex(id: string) {
    await fetch(`/api/places/${id}?action=reindex`, { method: "PATCH" });
    void loadPlaces();
  }

  const isAdmin = session?.user?.role === "admin";
  const total = pagination?.total ?? places.length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange-deep">
            CMS
          </p>
          <h1 className="font-display text-3xl text-brand-navy">Lugares</h1>
          <p className="text-sm text-brand-navy/50">
            {total} destinos · embeddings Gemini
          </p>
        </div>
        <Link
          href="/admin/lugares/nuevo"
          className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-brand-navy shadow-sm transition hover:bg-brand-orange/90"
        >
          + Nuevo lugar
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className="rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-sm"
          value={filter.region}
          onChange={(e) => setFilter((f) => ({ ...f, region: e.target.value }))}
        >
          <option value="">Todas las regiones</option>
          {Object.entries(REGION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="rounded-full border border-brand-navy/15 bg-white px-4 py-2 text-sm"
          value={filter.type}
          onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="">Todos los tipos</option>
          {Object.entries(PLACE_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-brand-navy/40">Cargando lugares...</p>
      ) : places.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-navy/20 bg-white p-12 text-center">
          <p className="mb-4 text-brand-navy/50">No hay lugares registrados.</p>
          <Link
            href="/admin/lugares/nuevo"
            className="text-sm font-semibold text-brand-orange-deep hover:underline"
          >
            Crear el primero →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {places.map((place) => {
              const cover = place.photos?.[0] || placeFallbackImage;
              return (
                <article
                  key={place._id}
                  className="group overflow-hidden rounded-2xl border border-brand-navy/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="relative h-40 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cover}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                      <div>
                        <h2 className="line-clamp-1 font-semibold text-white">
                          {place.name}
                        </h2>
                        <p className="text-xs text-white/70">
                          {place.city} · {REGION_LABELS[place.region]}
                        </p>
                      </div>
                      <EmbeddingBadge status={place.embedding_status} />
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-brand-cream px-2.5 py-0.5 text-[10px] font-semibold uppercase text-brand-navy">
                        {PLACE_TYPE_LABELS[place.type]}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                          place.active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {place.active ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
                      <Link
                        href={`/admin/lugares/${place._id}/editar`}
                        className="text-brand-orange-deep hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleReindex(place._id)}
                        className="text-brand-navy/50 hover:text-brand-navy"
                      >
                        Re-indexar
                      </button>
                      {place.active && (
                        <button
                          type="button"
                          onClick={() => void handleDeactivate(place._id)}
                          className="text-brand-navy/50 hover:text-brand-navy"
                        >
                          Desactivar
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(place._id)}
                          className="text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      )}
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
              label="lugares"
            />
          )}
        </>
      )}
    </div>
  );
}
