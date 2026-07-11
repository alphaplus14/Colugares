"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ItineraryListItem } from "@/types/itinerary.types";

export default function ItinerariesList() {
  const [items, setItems] = useState<ItineraryListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/itineraries");
      const json = (await response.json()) as { data?: ItineraryListItem[] };
      setItems(json.data ?? []);
      setLoading(false);
    }

    void load();
  }, []);

  if (loading) {
    return <p className="text-sm text-brand-navy/40">Cargando itinerarios...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-navy/20 bg-white p-8 text-center">
        <p className="font-medium text-brand-navy">
          Aún no tienes itinerarios guardados
        </p>
        <p className="mt-2 text-sm text-brand-navy/55">
          Chatea con Colu en el planner y pulsa &quot;Guardar itinerario&quot;
        </p>
        <Link
          href="/planner"
          className="mt-4 inline-block rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-brand-navy"
        >
          Ir al planner
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item._id}>
          <Link
            href={`/mi-perfil/itinerarios/${item._id}`}
            className="flex items-center justify-between rounded-2xl border border-brand-navy/10 bg-white p-4 transition hover:border-brand-orange/50 hover:shadow-sm"
          >
            <div>
              <p className="font-semibold text-brand-navy">{item.title}</p>
              <p className="text-sm text-brand-navy/55">
                {item.region} · {item.days_count} día(s)
              </p>
            </div>
            <span className="text-xs text-brand-navy/40">
              {new Date(item.created_at).toLocaleDateString("es-CO")}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
