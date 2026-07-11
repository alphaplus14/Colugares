import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { loadHomeEvents } from "@/lib/events/load-home-events";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Descubre Colombia con Colugares: destinos curados, festividades y un AI Trip Planner que solo recomienda lugares verificados.",
  openGraph: {
    title: "Colugares — Portal Turístico de Colombia",
    description:
      "Inicia tu aventura. Itinerarios personalizados con inteligencia artificial.",
  },
};

export default async function Page() {
  const events = await loadHomeEvents(6);

  return <HomePage events={events} />;
}
