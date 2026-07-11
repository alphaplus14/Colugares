"use client";

import Image from "next/image";
import { formatPlacePrice } from "@/lib/place-format";
import {
  PLACE_TYPE_LABELS,
  REGION_LABELS,
} from "@/types/place.types";
import type {
  ItineraryMapMarker,
  PlaceCatalogEntry,
} from "@/types/itinerary.types";
import type { ColombiaRegion } from "@/types/place.types";

interface MapMarkerHoverCardProps {
  marker: ItineraryMapMarker;
  place?: PlaceCatalogEntry;
  onClose?: () => void;
  pinned?: boolean;
}

const PERIOD_LABELS = {
  mañana: "Mañana",
  tarde: "Tarde",
  noche: "Noche",
} as const;

/** Tarjeta flotante con foto, descripción y datos del plan al hover/click en marcador */
export default function MapMarkerHoverCard({
  marker,
  place,
  onClose,
  pinned = false,
}: MapMarkerHoverCardProps) {
  const photoUrl = place?.photos[0];
  const priceLabel =
    marker.activity.match(/[—–-]\s*([^—–\n]+)$/)?.[1]?.trim() ??
    (place
      ? formatPlacePrice(place.price_real, place.budget_tier)
      : undefined);

  return (
    <div
      className="pointer-events-auto absolute bottom-4 left-4 right-4 overflow-hidden rounded-xl border border-brand-navy/10 bg-white shadow-xl"
      onMouseEnter={(event) => event.stopPropagation()}
      onMouseLeave={() => {
        if (!pinned) {
          onClose?.();
        }
      }}
    >
      <div className="flex flex-col sm:flex-row">
        {photoUrl ? (
          <div className="relative h-36 w-full shrink-0 sm:h-auto sm:w-36">
            <Image
              src={photoUrl}
              alt={marker.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 144px"
            />
          </div>
        ) : (
          <div className="flex h-24 w-full shrink-0 items-center justify-center bg-gradient-to-br from-brand-navy/10 to-brand-orange/15 sm:h-auto sm:w-28">
            <span className="text-3xl">📍</span>
          </div>
        )}

        <div className="min-w-0 flex-1 p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-orange-deep">
                Parada {marker.order} · Día {marker.day_number} ·{" "}
                {PERIOD_LABELS[marker.period]}
              </p>
              <h3 className="mt-0.5 text-sm font-bold text-brand-navy">
                {marker.name}
              </h3>
            </div>
            {pinned && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full p-1 text-brand-navy/40 hover:bg-brand-cream hover:text-brand-navy"
                aria-label="Cerrar"
              >
                ✕
              </button>
            )}
          </div>

          {place && (
            <p className="mt-1 text-xs text-brand-navy/50">
              {PLACE_TYPE_LABELS[place.type]} · {place.city},{" "}
              {REGION_LABELS[place.region as ColombiaRegion] ?? place.region}
            </p>
          )}

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-brand-navy/75">
            {place?.description ?? marker.activity}
          </p>

          {priceLabel && (
            <p className="mt-2 text-xs font-semibold text-brand-orange-deep">
              {priceLabel}
            </p>
          )}

          {place && place.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {place.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-sand px-2 py-0.5 text-[10px] text-brand-navy/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
