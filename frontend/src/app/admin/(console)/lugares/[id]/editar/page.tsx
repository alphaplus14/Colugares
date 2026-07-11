import { notFound } from "next/navigation";
import { PlaceForm } from "@/components/admin/PlaceForm";
import { auth } from "@/lib/auth";
import type { Place } from "@/types/place.types";

interface EditPageProps {
  params: { id: string };
}

async function fetchPlace(id: string): Promise<Place | null> {
  const session = await auth();
  if (
    !session?.user?.role ||
    (session.user.role !== "admin" && session.user.role !== "empleado")
  ) {
    return null;
  }

  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:4000";
  const internalKey = process.env.INTERNAL_API_KEY;

  if (!internalKey) return null;

  const response = await fetch(`${backendUrl}/api/places/${id}`, {
    headers: {
      "X-Internal-Key": internalKey,
      "X-User-Role": session.user.role,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const json = (await response.json()) as { data: Place };
  return json.data;
}

export default async function EditarLugarPage({ params }: EditPageProps) {
  const place = await fetchPlace(params.id);

  if (!place) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Editar: {place.name}
      </h1>
      <PlaceForm mode="edit" initialData={place} />
    </div>
  );
}
