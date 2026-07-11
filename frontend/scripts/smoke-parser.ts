import { parseItineraryFromMarkdown } from "../src/lib/itinerary/parser";
import type { PlaceCatalogEntry } from "../src/types/itinerary.types";

const catalog: PlaceCatalogEntry[] = [
  {
    _id: "1",
    name: "Parque Las Malocas",
    type: "atractivo",
    city: "Villavicencio",
    region: "llanos",
    description: "cultura llanera",
    tags: ["cultura"],
    budget_tier: "bajo",
    photos: ["/images/places/llanos/parque-las-malocas/01-vista.jpg"],
    coordinates: { lat: 4.12, lng: -73.61 },
  },
  {
    _id: "2",
    name: "Estrella de Agua",
    type: "atractivo",
    city: "Villavicencio",
    region: "llanos",
    description: "balneario",
    tags: ["agua"],
    budget_tier: "bajo",
    photos: ["/images/places/llanos/estrella-de-agua/01-vista.jpg"],
    coordinates: { lat: 4.08, lng: -73.58 },
  },
  {
    _id: "3",
    name: "Hotel GHL Comfort Villavicencio",
    type: "hotel",
    city: "Villavicencio",
    region: "llanos",
    description: "hotel",
    tags: ["hotel"],
    budget_tier: "medio",
    photos: [],
    coordinates: { lat: 4.14, lng: -73.63 },
  },
  {
    _id: "4",
    name: "Hato La Aurora",
    type: "actividad",
    city: "Paz de Ariporo",
    region: "llanos",
    description: "safari",
    tags: ["safari"],
    budget_tier: "alto",
    photos: [],
    coordinates: { lat: 5.8, lng: -71.6 },
  },
];

const md = `
**Día 1 — Llegada a Villavicencio**
🌅 Mañana: Hotel GHL Comfort Villavicencio — desde $180.000/noche
☀ Tarde: Parque Las Malocas — $22.000/persona
🌙 Noche: Cena en un restaurante local

**Día 2 — Naturaleza y Relajo en Villavicencio**
🌅 Mañana: Estrella de Agua — $18.000/persona
☀ Tarde: Tiempo libre para explorar Villavicencio o relajarse
🌙 Noche: Cena en un restaurante local

**Día 3 — Safari de Lujo en Casanare**
🌅 Mañana: Hato La Aurora — safari
☀ Tarde: Tiempo libre
🌙 Noche: Noche libre

**Día 4 — Despedida**
🌅 Mañana: Tiempo libre
`;

const result = parseItineraryFromMarkdown(md, catalog, "llanos");

console.log(
  result.markers.map((m) => ({
    pin: m.order,
    day: m.day_number,
    name: m.name,
    period: m.period,
  })),
);
console.log({ days: result.days.length, markers: result.markers.length });

const day2 = result.markers.find((m) => m.day_number === 2);
if (!day2 || day2.name !== "Estrella de Agua") {
  console.error("FAIL: pin/día 2 debe ser Estrella de Agua", day2);
  process.exit(1);
}
if (result.markers.length > 4) {
  console.error("FAIL: no debe haber más pines que días con lugar", result.markers.length);
  process.exit(1);
}
console.log("OK parser day-aligned");
