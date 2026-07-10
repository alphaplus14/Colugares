import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import ProfileNav from "@/components/profile/ProfileNav";
import ItineraryDetailClient from "@/components/profile/ItineraryDetailClient";
import { getDb } from "@/lib/mongodb";
import { serializeItinerary } from "@/lib/itinerary/serialize";
import { requireViajeroPage } from "@/lib/viajero-guard";
import type { ItineraryDocument } from "@/types/itinerary.types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function ItinerarioDetailPage({ params }: PageProps) {
  const { session } = await requireViajeroPage();

  if (!ObjectId.isValid(params.id)) {
    notFound();
  }

  const db = await getDb();
  const doc = await db.collection<ItineraryDocument>("itineraries").findOne({
    _id: new ObjectId(params.id),
    user_id: new ObjectId(session.user.id),
  });

  if (!doc) {
    notFound();
  }

  const itinerary = serializeItinerary(doc);

  return (
    <>
      <ProfileNav current="itinerarios" />
      <ItineraryDetailClient itinerary={itinerary} />
    </>
  );
}
