import type { ItineraryDay } from "@/types/itinerary.types";

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Distancia Haversine entre dos coordenadas en kilómetros */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/** Alerta si en un mismo día hay lugares muy distantes (logística inviable) */
export function detectGeographyWarnings(
  days: ItineraryDay[],
  maxKmPerDay = 250,
): string[] {
  const warnings: string[] = [];

  for (const day of days) {
    const coords = day.slots
      .filter((slot) => slot.coordinates)
      .map((slot) => slot.coordinates!);

    if (coords.length < 2) {
      continue;
    }

    let maxDistance = 0;
    for (let i = 0; i < coords.length; i += 1) {
      for (let j = i + 1; j < coords.length; j += 1) {
        const a = coords[i]!;
        const b = coords[j]!;
        const distance = haversineKm(a.lat, a.lng, b.lat, b.lng);
        maxDistance = Math.max(maxDistance, distance);
      }
    }

    if (maxDistance > maxKmPerDay) {
      warnings.push(
        `Día ${day.day_number}: los lugares están a ~${Math.round(maxDistance)} km entre sí. Revisa tiempos de traslado.`,
      );
    }
  }

  return warnings;
}
