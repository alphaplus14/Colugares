import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { EventForm } from "@/components/admin/EventForm";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { AdminEventItem, EventDocument } from "@/types/event.types";

interface PageProps {
  params: { id: string };
}

const MONTH_LABELS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

export default async function EditarEventoPage({ params }: PageProps) {
  const session = await auth();
  if (
    !session?.user?.role ||
    (session.user.role !== "admin" && session.user.role !== "empleado")
  ) {
    notFound();
  }

  if (!ObjectId.isValid(params.id)) {
    notFound();
  }

  const db = await getDb();
  const doc = await db
    .collection<EventDocument>("events")
    .findOne({ _id: new ObjectId(params.id) });

  if (!doc) {
    notFound();
  }

  const initialData: AdminEventItem = {
    _id: doc._id.toString(),
    name: doc.name,
    region: doc.region,
    city: doc.city,
    start_date: doc.start_date.toISOString(),
    end_date: doc.end_date.toISOString(),
    description: doc.description,
    tags: doc.tags,
    month_label: MONTH_LABELS[doc.start_date.getUTCMonth()] ?? "—",
    active: doc.active,
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">
        Editar: {doc.name}
      </h1>
      <EventForm mode="edit" initialData={initialData} />
    </div>
  );
}
