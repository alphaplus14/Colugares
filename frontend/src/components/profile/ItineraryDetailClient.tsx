"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ItineraryMapPanel from "@/components/planner/ItineraryMapPanel";
import type {
  ItineraryResponse,
  PlaceCatalogEntry,
} from "@/types/itinerary.types";

interface ItineraryDetailClientProps {
  itinerary: ItineraryResponse;
}

export default function ItineraryDetailClient({
  itinerary,
}: ItineraryDetailClientProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [catalog, setCatalog] = useState<PlaceCatalogEntry[]>([]);

  useEffect(() => {
    async function loadCatalog() {
      const response = await fetch("/api/places/catalog");
      if (!response.ok) {
        return;
      }
      const json = (await response.json()) as { data?: PlaceCatalogEntry[] };
      setCatalog(json.data ?? []);
    }

    void loadCatalog();
  }, []);

  async function handleDelete() {
    if (!confirm("¿Eliminar este itinerario?")) {
      return;
    }

    setDeleting(true);
    const response = await fetch(`/api/itineraries/${itinerary._id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/mi-perfil/itinerarios");
      router.refresh();
      return;
    }

    setDeleting(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-brand-navy">
            {itinerary.title}
          </h1>
          <p className="text-sm text-brand-navy/55">
            {itinerary.region} · Guardado el{" "}
            {new Date(itinerary.created_at).toLocaleDateString("es-CO")}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>

      <div className="h-[360px] overflow-hidden rounded-2xl border border-brand-navy/10 lg:h-[420px]">
        <ItineraryMapPanel
          markers={itinerary.markers}
          catalog={catalog}
          warnings={itinerary.geography_warnings}
        />
      </div>

      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <article
            key={day.day_number}
            className="rounded-2xl border border-brand-navy/10 bg-white p-4"
          >
            <h2 className="font-display text-base text-brand-orange-deep">
              Día {day.day_number} — {day.title}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-brand-navy/80">
              {day.slots.map((slot, index) => (
                <li key={`${day.day_number}-${slot.period}-${index}`}>
                  <span className="font-medium capitalize">{slot.period}:</span>{" "}
                  {slot.place_name}
                  {slot.price_label && (
                    <span className="text-brand-navy/50">
                      {" "}
                      — {slot.price_label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
