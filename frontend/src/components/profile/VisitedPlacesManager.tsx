"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PublicPlaceSummary } from "@/lib/places/load-public-places";
import { PLACE_TYPE_LABELS, REGION_LABELS } from "@/types/place.types";

export default function VisitedPlacesManager() {
  const [visited, setVisited] = useState<PublicPlaceSummary[]>([]);
  const [catalog, setCatalog] = useState<PublicPlaceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const [visitedRes, catalogRes] = await Promise.all([
      fetch("/api/user/visited-places"),
      fetch("/api/places/public"),
    ]);

    const visitedJson = (await visitedRes.json()) as {
      data?: PublicPlaceSummary[];
      message?: string;
    };
    const catalogJson = (await catalogRes.json()) as {
      data?: PublicPlaceSummary[];
    };

    if (!visitedRes.ok) {
      setError(visitedJson.message ?? "No pudimos cargar visitados");
    } else {
      setVisited(visitedJson.data ?? []);
    }

    setCatalog(catalogJson.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visitedIds = useMemo(
    () => new Set(visited.map((place) => place._id)),
    [visited],
  );

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog
      .filter((place) => !visitedIds.has(place._id))
      .filter((place) => {
        if (!q) {
          return true;
        }
        return (
          place.name.toLowerCase().includes(q) ||
          place.city.toLowerCase().includes(q) ||
          place.region.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [catalog, visitedIds, query]);

  async function markVisited(placeId: string) {
    setBusyId(placeId);
    setError(null);
    const response = await fetch("/api/user/visited-places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ place_id: placeId }),
    });
    const json = (await response.json()) as {
      data?: PublicPlaceSummary;
      message?: string;
    };
    setBusyId(null);

    if (!response.ok || !json.data) {
      setError(json.message ?? "No se pudo marcar como visitado");
      return;
    }

    setVisited((current) => [...current, json.data!]);
    setQuery("");
  }

  async function unmarkVisited(placeId: string) {
    setBusyId(placeId);
    setError(null);
    const response = await fetch("/api/user/visited-places", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ place_id: placeId }),
    });
    setBusyId(null);

    if (!response.ok) {
      setError("No se pudo quitar de visitados");
      return;
    }

    setVisited((current) => current.filter((place) => place._id !== placeId));
  }

  if (loading) {
    return <p className="text-sm text-brand-navy/40">Cargando lugares...</p>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-brand-navy/10 bg-white p-5">
        <h2 className="mb-1 font-display text-lg text-brand-navy">
          Agregar lugar visitado
        </h2>
        <p className="mb-4 text-sm text-brand-navy/55">
          Colu no volverá a recomendar estos lugares en tus itinerarios.
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, ciudad o región..."
          className="mb-3 w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
        />
        {suggestions.length === 0 ? (
          <p className="text-sm text-brand-navy/45">
            {query
              ? "Sin coincidencias en el catálogo"
              : "Escribe para buscar lugares del catálogo"}
          </p>
        ) : (
          <ul className="divide-y divide-brand-navy/5">
            {suggestions.map((place) => (
              <li
                key={place._id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium text-brand-navy">{place.name}</p>
                  <p className="text-xs text-brand-navy/50">
                    {REGION_LABELS[place.region]} · {place.city} ·{" "}
                    {PLACE_TYPE_LABELS[place.type]}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busyId === place._id}
                  onClick={() => void markVisited(place._id)}
                  className="shrink-0 rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-brand-navy disabled:opacity-50"
                >
                  {busyId === place._id ? "..." : "Marcar"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg text-brand-navy">
          Ya visitaste ({visited.length})
        </h2>
        {visited.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-navy/20 bg-white p-8 text-center text-sm text-brand-navy/55">
            Aún no has marcado lugares. Así Colu evita repetirte destinos.
          </div>
        ) : (
          <ul className="space-y-3">
            {visited.map((place) => (
              <li
                key={place._id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-brand-navy/10 bg-white p-4"
              >
                <div>
                  <Link
                    href={`/destinos/${place._id}`}
                    className="font-semibold text-brand-navy hover:text-brand-orange-deep"
                  >
                    {place.name}
                  </Link>
                  <p className="text-xs text-brand-navy/50">
                    {REGION_LABELS[place.region]} · {place.city}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busyId === place._id}
                  onClick={() => void unmarkVisited(place._id)}
                  className="rounded-full border border-brand-navy/20 px-3 py-1.5 text-xs font-medium text-brand-navy/70 hover:bg-brand-cream disabled:opacity-50"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
