import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  buildPaginationMeta,
  parsePagination,
} from "@/lib/pagination";
import { requireStaffAuth } from "@/lib/session-guards";
import { eventFormSchema } from "@/lib/validators/event.schema";
import type { AdminEventItem, EventDocument } from "@/types/event.types";
import type { ColombiaRegion } from "@/types/place.types";

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

function serializeAdminEvent(doc: EventDocument): AdminEventItem {
  return {
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
}

/** GET /api/admin/events — listado CMS (incluye inactivos) */
export async function GET(request: Request) {
  const staff = await requireStaffAuth();
  if (staff.error) return staff.error;

  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const activeParam = searchParams.get("active");
    const { page, limit, skip } = parsePagination(searchParams, { limit: 12 });

    const filter: Record<string, unknown> = {};
    if (region) filter.region = region;
    if (activeParam === "true") filter.active = true;
    if (activeParam === "false") filter.active = false;

    const db = await getDb();
    const collection = db.collection<EventDocument>("events");
    const total = await collection.countDocuments(filter);

    const docs = await collection
      .find(filter)
      .sort({ start_date: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      status: "success",
      data: docs.map(serializeAdminEvent),
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudieron cargar los eventos" },
      { status: 500 },
    );
  }
}

/** POST /api/admin/events — crear festividad */
export async function POST(request: Request) {
  const staff = await requireStaffAuth();
  if (staff.error) return staff.error;

  try {
    const body: unknown = await request.json();
    const parsed = eventFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: parsed.error.issues[0]?.message ?? "Datos inválidos",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const doc: EventDocument = {
      _id: new ObjectId(),
      name: data.name,
      region: data.region as ColombiaRegion,
      city: data.city,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      description: data.description,
      tags: data.tags,
      active: data.active,
    };

    const db = await getDb();
    await db.collection<EventDocument>("events").insertOne(doc);

    return NextResponse.json(
      { status: "success", data: serializeAdminEvent(doc) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudo crear el evento" },
      { status: 500 },
    );
  }
}
