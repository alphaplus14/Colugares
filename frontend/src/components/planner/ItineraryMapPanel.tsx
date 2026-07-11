"use client";

import dynamic from "next/dynamic";
import type {
  ItineraryMapMarker,
  PlaceCatalogEntry,
} from "@/types/itinerary.types";

const ItineraryMap = dynamic(
  () => import("@/components/planner/ItineraryMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-brand-sand text-sm text-brand-navy/40">
        Cargando mapa...
      </div>
    ),
  },
);

interface ItineraryMapPanelProps {
  markers: ItineraryMapMarker[];
  catalog: PlaceCatalogEntry[];
  warnings: string[];
}

export default function ItineraryMapPanel({
  markers,
  catalog,
  warnings,
}: ItineraryMapPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-brand-navy/10 bg-gradient-to-r from-white to-brand-cream/60 px-4 py-3">
        <div>
          <h2 className="font-display text-base text-brand-navy">
            Mapa del itinerario
          </h2>
          <p className="text-xs text-brand-navy/50">
            {markers.length > 0
              ? `${markers.length} días en el mapa · el número del pin = Día N`
              : "Los marcadores aparecen cuando Colu arma tu plan"}
          </p>
        </div>
        {markers.length > 0 && (
          <span className="shrink-0 rounded-full bg-brand-orange/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-orange-deep">
            {markers.length} días
          </span>
        )}
      </div>

      <div className="relative min-h-[280px] w-full flex-1">
        <ItineraryMap
          markers={markers}
          catalog={catalog}
          className="h-full w-full"
        />

        {markers.length === 0 && (
          <div className="pointer-events-none absolute inset-x-4 top-4 z-10">
            <div className="rounded-xl border border-white/40 bg-brand-navy/75 px-4 py-3 text-center text-xs text-white/90 shadow-lg backdrop-blur-md">
              Habla con Colu y verás tu ruta aparecer aquí en tiempo real
            </div>
          </div>
        )}
      </div>

      {warnings.length > 0 && (
        <div className="border-t border-amber-200/80 bg-amber-50/95 px-4 py-3">
          <p className="text-xs font-semibold text-amber-900">
            Alerta geográfica
          </p>
          <ul className="mt-1 space-y-1">
            {warnings.map((warning) => (
              <li key={warning} className="text-xs text-amber-800">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
