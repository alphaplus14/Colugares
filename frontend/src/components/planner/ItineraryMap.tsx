"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import Map, { AttributionControl, Marker, NavigationControl } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import MapMarkerHoverCard from "@/components/planner/MapMarkerHoverCard";
import { DEFAULT_MAP_CENTER, getMapStyle } from "@/lib/map-config";
import type {
  ItineraryMapMarker,
  PlaceCatalogEntry,
} from "@/types/itinerary.types";
import "maplibre-gl/dist/maplibre-gl.css";

interface ItineraryMapProps {
  markers: ItineraryMapMarker[];
  catalog: PlaceCatalogEntry[];
  className?: string;
}

function fitMapToMarkers(map: MapRef, markers: ItineraryMapMarker[]) {
  if (markers.length === 0) {
    map.flyTo({
      center: [DEFAULT_MAP_CENTER.lng, DEFAULT_MAP_CENTER.lat],
      zoom: DEFAULT_MAP_CENTER.zoom,
      duration: 600,
    });
    return;
  }

  if (markers.length === 1) {
    const marker = markers[0]!;
    map.flyTo({
      center: [marker.lng, marker.lat],
      zoom: 11,
      duration: 800,
    });
    return;
  }

  const lngs = markers.map((m) => m.lng);
  const lats = markers.map((m) => m.lat);

  map.fitBounds(
    [
      [Math.min(...lngs) - 0.08, Math.min(...lats) - 0.08],
      [Math.max(...lngs) + 0.08, Math.max(...lats) + 0.08],
    ],
    { padding: 48, duration: 800 },
  );
}

/** Mapa MapLibre + Carto/OSM (sin API key) con hover en marcadores */
export default function ItineraryMap({
  markers,
  catalog,
  className,
}: ItineraryMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState<ItineraryMapMarker | null>(null);
  const [pinned, setPinned] = useState<ItineraryMapMarker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const catalogById = useMemo(() => {
    const lookup: Record<string, PlaceCatalogEntry> = {};
    for (const entry of catalog) {
      lookup[entry._id] = entry;
    }
    return lookup;
  }, [catalog]);

  const activeMarker = pinned ?? hovered;

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const showMarker = useCallback(
    (marker: ItineraryMapMarker) => {
      clearHideTimer();
      setHovered(marker);
    },
    [clearHideTimer],
  );

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setHovered(null);
    }, 180);
  }, [clearHideTimer]);

  useEffect(() => {
    return () => clearHideTimer();
  }, [clearHideTimer]);

  useEffect(() => {
    if (mapRef.current) {
      fitMapToMarkers(mapRef.current, markers);
    }
  }, [markers]);

  return (
    <div className={`relative min-h-[280px] ${className ?? "h-full w-full"}`}>
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{
          longitude: DEFAULT_MAP_CENTER.lng,
          latitude: DEFAULT_MAP_CENTER.lat,
          zoom: DEFAULT_MAP_CENTER.zoom,
        }}
        onLoad={() => {
          setMapError(null);
          if (mapRef.current) {
            fitMapToMarkers(mapRef.current, markers);
          }
        }}
        onError={() => {
          setMapError("No se pudieron cargar los tiles del mapa. Revisa tu conexión.");
        }}
        mapStyle={getMapStyle()}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />
        <AttributionControl compact position="bottom-right" />

        {markers.map((marker) => (
          <Marker
            key={`${marker.order}-${marker.name}`}
            longitude={marker.lng}
            latitude={marker.lat}
            anchor="bottom"
          >
            <div
              className="flex cursor-pointer flex-col items-center"
              onMouseEnter={() => showMarker(marker)}
              onMouseLeave={scheduleHide}
              onClick={(event) => {
                event.stopPropagation();
                setPinned(marker);
                setHovered(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setPinned(marker);
                  setHovered(null);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Parada ${marker.order}: ${marker.name}`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg transition-transform ${
                  activeMarker?.order === marker.order
                    ? "scale-110 bg-brand-orange"
                    : "bg-brand-navy hover:scale-105"
                }`}
              >
                {marker.order}
              </div>
            </div>
          </Marker>
        ))}
      </Map>

      {markers.length === 0 && !mapError && (
        <div className="pointer-events-none absolute inset-x-4 top-4 rounded-lg bg-white/90 px-3 py-2 text-center text-xs text-gray-600 shadow">
          Mapa listo — pasa el cursor sobre los marcadores para ver fotos e
          información de cada parada
        </div>
      )}

      {mapError && (
        <div className="absolute inset-x-4 top-4 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-700 shadow">
          {mapError}
        </div>
      )}

      {activeMarker && (
        <MapMarkerHoverCard
          marker={activeMarker}
          place={
            activeMarker.place_id
              ? catalogById[activeMarker.place_id]
              : undefined
          }
          pinned={pinned?.order === activeMarker.order}
          onClose={() => {
            setPinned(null);
            setHovered(null);
          }}
        />
      )}
    </div>
  );
}
