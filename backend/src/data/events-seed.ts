/** Festividades colombianas — colección events (Fase 5) */
export const eventsSeed = [
  {
    name: "Feria de las Flores",
    region: "andina",
    city: "Medellín",
    start_date: new Date("2026-08-07T00:00:00.000Z"),
    end_date: new Date("2026-08-17T23:59:59.000Z"),
    description:
      "Desfile de silleteros, exposiciones florales y eventos culturales en la ciudad de la eterna primavera.",
    tags: ["flores", "cultura", "desfile", "agosto"],
    active: true,
  },
  {
    name: "Festival de Jazz al Parque",
    region: "andina",
    city: "Bogotá",
    start_date: new Date("2026-09-12T00:00:00.000Z"),
    end_date: new Date("2026-09-14T23:59:59.000Z"),
    description:
      "Tres días de jazz nacional e internacional en escenarios al aire libre del parque Simón Bolívar.",
    tags: ["musica", "jazz", "cultura", "septiembre"],
    active: true,
  },
  {
    name: "Festival de Música del Caribe",
    region: "caribe",
    city: "Cartagena",
    start_date: new Date("2026-11-20T00:00:00.000Z"),
    end_date: new Date("2026-11-23T23:59:59.000Z"),
    description:
      "Conciertos de champeta, cumbia y música tropical en el centro histórico amurallado.",
    tags: ["musica", "caribe", "cultura", "noviembre"],
    active: true,
  },
  {
    name: "Carnaval de Barranquilla",
    region: "caribe",
    city: "Barranquilla",
    start_date: new Date("2027-02-13T00:00:00.000Z"),
    end_date: new Date("2027-02-16T23:59:59.000Z"),
    description:
      "Patrimonio Oral e Inmaterial de la Humanidad UNESCO. Desfiles, danzas folclóricas y fiesta en las calles del Caribe colombiano.",
    tags: ["carnaval", "cultura", "musica", "febrero"],
    active: true,
  },
  {
    name: "Festival Iberoamericano de Teatro",
    region: "andina",
    city: "Bogotá",
    start_date: new Date("2027-03-27T00:00:00.000Z"),
    end_date: new Date("2027-04-11T23:59:59.000Z"),
    description:
      "El festival de teatro más grande de América Latina. Obras en escenarios al aire libre y salas de toda la capital.",
    tags: ["teatro", "cultura", "arte", "marzo"],
    active: true,
  },
  {
    name: "Festival de la Leyenda Vallenata",
    region: "caribe",
    city: "Valledupar",
    start_date: new Date("2027-04-23T00:00:00.000Z"),
    end_date: new Date("2027-04-26T23:59:59.000Z"),
    description:
      "Competencia de acordeoneros, piquerías y conciertos del género vallenato en la capital del Cesar.",
    tags: ["musica", "vallenato", "cultura", "abril"],
    active: true,
  },
] as const;
