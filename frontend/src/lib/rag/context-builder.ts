import type { PlaceDocument } from "@/types/place-document.types";

function formatPrice(place: PlaceDocument): string {
  if (place.price_real) {
    const formatted = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(place.price_real.amount);
    return `${formatted}/${place.price_real.unit} (precio oficial)`;
  }

  const tierLabels: Record<PlaceDocument["budget_tier"], string> = {
    bajo: "~$50.000 (estimado)",
    medio: "~$150.000 (estimado)",
    alto: "~$400.000 (estimado)",
  };

  return tierLabels[place.budget_tier];
}

function formatPlaceEntry(place: PlaceDocument, index: number): string {
  return [
    `${index + 1}. **${place.name}** (${place.type})`,
    `   Ubicación: ${place.city}, ${place.department} — región ${place.region}`,
    `   Descripción: ${place.description}`,
    `   Tags: ${place.tags.join(", ")}`,
    `   Precio: ${formatPrice(place)}`,
    `   Transporte recomendado: ${place.recommended_transport.join(", ")}`,
  ].join("\n");
}

function formatPlaceSection(
  title: string,
  places: PlaceDocument[],
): string {
  if (places.length === 0) {
    return `### ${title}\n(No hay lugares disponibles en esta categoría)\n`;
  }

  const entries = places
    .map((place, index) => formatPlaceEntry(place, index))
    .join("\n\n");

  return `### ${title}\n${entries}\n`;
}

interface BuildContextInput {
  primaryPlaces: PlaceDocument[];
  secondaryPlaces: PlaceDocument[];
  events: string[];
}

/** Construye el contexto RAG con pools primary y secondary en secciones separadas */
export function buildRagContext(input: BuildContextInput): string {
  const primarySection = formatPlaceSection(
    "LUGARES PRINCIPALES (intereses primarios del viajero)",
    input.primaryPlaces,
  );

  const secondarySection = formatPlaceSection(
    "LUGARES SECUNDARIOS (intereses opcionales — mencionar solo al final)",
    input.secondaryPlaces,
  );

  const eventsSection =
    input.events.length > 0
      ? `### EVENTOS EN LAS FECHAS DEL VIAJE\n${input.events.join("\n")}\n`
      : "### EVENTOS EN LAS FECHAS DEL VIAJE\n(No hay eventos registrados para las fechas mencionadas)\n";

  return [primarySection, secondarySection, eventsSection].join("\n");
}
