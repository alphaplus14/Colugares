import type { Metadata } from "next";
import { loadPublicPlaces } from "@/lib/places/load-public-places";
import DestinationsExplorer from "@/components/destinos/DestinationsExplorer";
import type { ColombiaRegion } from "@/types/place.types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Destinos | Colugares",
  description:
    "Explora hoteles, restaurantes y atractivos verificados en Colombia. El mismo catálogo que usa el AI Trip Planner.",
  openGraph: {
    title: "Destinos | Colugares",
    description:
      "Catálogo curado de lugares suscritos en el portal turístico inteligente de Colombia.",
    type: "website",
  },
};

interface DestinosPageProps {
  searchParams: { region?: string };
}

export default async function DestinosPage({ searchParams }: DestinosPageProps) {
  const regionParam = searchParams.region as ColombiaRegion | undefined;
  const places = await loadPublicPlaces(
    regionParam ? { region: regionParam } : {},
  );

  return (
    <DestinationsExplorer places={places} initialRegion={regionParam} />
  );
}
