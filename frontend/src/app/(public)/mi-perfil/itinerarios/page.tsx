import ProfileNav from "@/components/profile/ProfileNav";
import ItinerariesList from "@/components/profile/ItinerariesList";
import { requireViajeroPage } from "@/lib/viajero-guard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mis itinerarios | Colugares",
  description: "Planes guardados con el AI Trip Planner",
};

export default async function ItinerariosPage() {
  await requireViajeroPage();

  return (
    <>
      <h1 className="mb-2 font-display text-3xl text-brand-navy">
        Mis itinerarios
      </h1>
      <p className="mb-6 text-brand-navy/60">
        Planes guardados desde el AI Trip Planner.
      </p>
      <ProfileNav current="itinerarios" />
      <ItinerariesList />
    </>
  );
}
