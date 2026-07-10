"use client";

import dynamic from "next/dynamic";
import type { ItineraryMapMarker, PlaceCatalogEntry } from "@/types/itinerary.types";

const ItineraryMap = dynamic(() => import("@/components/planner/ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
      Cargando mapa...
    </div>
  ),
});

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
      <div className="border-b border-gray-200 bg-white px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Mapa del itinerario</h2>
        <p className="text-xs text-gray-500">
          {markers.length > 0
            ? `${markers.length} paradas · pasa el cursor para ver fotos`
            : "Mapa de Colombia — los marcadores aparecen con el plan de Colu"}
        </p>
      </div>

      <div className="relative min-h-[280px] w-full flex-1">
        <ItineraryMap markers={markers} catalog={catalog} className="h-full w-full" />
      </div>

      {warnings.length > 0 && (
        <div className="border-t border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-semibold text-amber-800">
            Alerta geográfica
          </p>
          <ul className="mt-1 space-y-1">
            {warnings.map((warning) => (
              <li key={warning} className="text-xs text-amber-700">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
