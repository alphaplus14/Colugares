import type { ColombiaRegion } from "@/types/place.types";

export const COLOMBIA_REGIONS: {
  value: ColombiaRegion;
  label: string;
  description: string;
}[] = [
  {
    value: "caribe",
    label: "Caribe",
    description: "Cartagena, San Andrés, Santa Marta",
  },
  {
    value: "andina",
    label: "Andina",
    description: "Bogotá, Medellín, Boyacá",
  },
  {
    value: "pacifico",
    label: "Pacífico",
    description: "Nuquí, Bahía Solano, Cali",
  },
  {
    value: "amazonia",
    label: "Amazonía",
    description: "Leticia, selva y ríos",
  },
  {
    value: "llanos",
    label: "Llanos",
    description: "Villavicencio, safaris y llanura",
  },
  {
    value: "eje_cafetero",
    label: "Eje Cafetero",
    description: "Armenia, Pereira, Manizales",
  },
];
