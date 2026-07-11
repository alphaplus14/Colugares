"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { PublicPlaceSummary } from "@/lib/places/load-public-places";
import { COLOMBIA_REGIONS } from "@/lib/constants/colombia-regions";
import {
  PLACE_TYPE_LABELS,
  REGION_LABELS,
  type ColombiaRegion,
  type PlaceType,
} from "@/types/place.types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PillButton } from "@/components/ui/PillButton";

const PLACE_TYPES = Object.keys(PLACE_TYPE_LABELS) as PlaceType[];

interface DestinationsExplorerProps {
  places: PublicPlaceSummary[];
  initialRegion?: ColombiaRegion;
}

export default function DestinationsExplorer({
  places,
  initialRegion,
}: DestinationsExplorerProps) {
  const [region, setRegion] = useState<ColombiaRegion | "all">(
    initialRegion ?? "all",
  );
  const [type, setType] = useState<PlaceType | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return places.filter((place) => {
      if (region !== "all" && place.region !== region) {
        return false;
      }
      if (type !== "all" && place.type !== type) {
        return false;
      }
      if (!q) {
        return true;
      }
      return (
        place.name.toLowerCase().includes(q) ||
        place.city.toLowerCase().includes(q) ||
        place.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [places, region, type, query]);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-28">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Catálogo curado"
          title="Destinos de Colombia"
          description="Solo lugares verificados y suscritos en Colugares. El mismo inventario que usa Colu."
        />
        <PillButton href="/planner" variant="dark" size="sm">
          Planificar con Colu
        </PillButton>
      </div>

      <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-brand-navy/10 bg-white p-4 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar destino, ciudad o tag..."
          className="w-full flex-1 rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
        />
        <select
          value={region}
          onChange={(e) =>
            setRegion(e.target.value as ColombiaRegion | "all")
          }
          className="rounded-xl border border-brand-navy/15 bg-white px-3 py-2.5 text-sm"
        >
          <option value="all">Todas las regiones</option>
          {COLOMBIA_REGIONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as PlaceType | "all")}
          className="rounded-xl border border-brand-navy/15 bg-white px-3 py-2.5 text-sm"
        >
          <option value="all">Todos los tipos</option>
          {PLACE_TYPES.map((t) => (
            <option key={t} value={t}>
              {PLACE_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-sm text-brand-navy/50">
        {filtered.length} destino{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-navy/20 bg-white p-12 text-center text-brand-navy/55">
          No hay destinos con esos filtros.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((place) => {
            const photo = place.photos[0];
            return (
              <Link
                key={place._id}
                href={`/destinos/${place._id}`}
                className="group overflow-hidden rounded-2xl border border-brand-navy/10 bg-white transition hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-lg hover:shadow-brand-orange/10"
              >
                <div className="relative aspect-[16/10] bg-brand-sand">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={place.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-brand-navy/30">
                      Sin foto
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-brand-orange/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange-deep">
                      {REGION_LABELS[place.region]}
                    </span>
                    <span className="rounded-full border border-brand-navy/10 px-2.5 py-0.5 text-[10px] font-medium text-brand-navy/60">
                      {PLACE_TYPE_LABELS[place.type]}
                    </span>
                  </div>
                  <h2 className="font-display text-lg text-brand-navy">
                    {place.name}
                  </h2>
                  <p className="mt-1 text-sm text-brand-navy/55">{place.city}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-brand-navy/65">
                    {place.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
