import type { CreateEventInput } from "../types/event.types";

type SeedEvent = CreateEventInput;

/** Festividades nacionales para el seed inicial */
export const eventsSeed: SeedEvent[] = [
  {
    name: "Carnaval de Barranquilla",
    region: "caribe",
    city: "Barranquilla",
    start_date: new Date("2027-02-06T00:00:00.000Z"),
    end_date: new Date("2027-02-09T23:59:59.000Z"),
    description:
      "Patrimonio UNESCO: cuatro días de música, danza y tradición costeña. Desfiles, concursos de litografía y la Batalla de Flores.",
    tags: ["cultura", "musica", "danza", "patrimonio"],
    active: true,
  },
  {
    name: "Feria de las Flores",
    region: "andina",
    city: "Medellín",
    start_date: new Date("2026-08-01T00:00:00.000Z"),
    end_date: new Date("2026-08-10T23:59:59.000Z"),
    description:
      "Desfile de silleteros, conciertos y la fiesta más colorida de Antioquia. Celebración de la floricultura paisa.",
    tags: ["cultura", "flores", "familia", "musica"],
    active: true,
  },
  {
    name: "Festival Vallenato",
    region: "caribe",
    city: "Valledupar",
    start_date: new Date("2026-04-27T00:00:00.000Z"),
    end_date: new Date("2026-05-01T23:59:59.000Z"),
    description:
      "La cuna del vallenato celebra sus leyendas en la tierra de Francisco el Hombre. Concurso de acordeoneros y piquerías.",
    tags: ["musica", "vallenato", "cultura", "tradicion"],
    active: true,
  },
  {
    name: "Festival Internacional de Cine de Cartagena",
    region: "caribe",
    city: "Cartagena",
    start_date: new Date("2026-03-12T00:00:00.000Z"),
    end_date: new Date("2026-03-17T23:59:59.000Z"),
    description:
      "El festival de cine más importante de Colombia. Proyecciones al aire libre, premieres y eventos en el centro histórico.",
    tags: ["cine", "cultura", "nocturno", "arte"],
    active: true,
  },
  {
    name: "Carnaval de Negros y Blancos",
    region: "andina",
    city: "Pasto",
    start_date: new Date("2027-01-02T00:00:00.000Z"),
    end_date: new Date("2027-01-07T23:59:59.000Z"),
    description:
      "Patrimonio inmaterial de la humanidad. Desfiles con pintura corporal, comparsas y celebración de la diversidad cultural.",
    tags: ["cultura", "tradicion", "familia", "patrimonio"],
    active: true,
  },
];
