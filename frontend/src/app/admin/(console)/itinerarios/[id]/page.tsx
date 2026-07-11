import { ItineraryAdminDetailClient } from "@/components/admin/ItineraryAdminDetailClient";

interface PageProps {
  params: { id: string };
}

export default function AdminItinerarioDetailPage({ params }: PageProps) {
  return <ItineraryAdminDetailClient id={params.id} />;
}
