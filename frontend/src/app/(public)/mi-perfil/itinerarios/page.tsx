import ProfileNav from "@/components/profile/ProfileNav";
import ItinerariesList from "@/components/profile/ItinerariesList";
import { requireViajeroPage } from "@/lib/viajero-guard";

export const dynamic = "force-dynamic";

export default async function ItinerariosPage() {
  await requireViajeroPage();

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-colombia-green">
        Mis itinerarios
      </h1>
      <p className="mb-6 text-gray-500">
        Planes guardados desde el AI Trip Planner.
      </p>
      <ProfileNav current="itinerarios" />
      <ItinerariesList />
    </>
  );
}
