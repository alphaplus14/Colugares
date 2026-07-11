import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/session-guards";
import { adminItineraryUpdateSchema } from "@/lib/validators/admin-itinerary.schema";
import type { ItineraryDocument } from "@/types/itinerary.types";
import type { UserDocument } from "@/types/user.types";

interface RouteContext {
  params: { id: string };
}

function serializeDetail(
  doc: ItineraryDocument,
  owner?: { name: string; email: string },
) {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    region: doc.region,
    days: doc.days,
    places_used: doc.places_used.map((id) => id.toString()),
    geography_warnings: doc.geography_warnings,
    raw_content: doc.raw_content,
    user_id: doc.user_id.toString(),
    user_name: owner?.name ?? "—",
    user_email: owner?.email ?? "—",
    created_at: doc.created_at.toISOString(),
    updated_at: doc.updated_at.toISOString(),
  };
}

export async function GET(_request: Request, context: RouteContext) {
  const staff = await requireStaffAuth();
  if (staff.error) return staff.error;

  if (!ObjectId.isValid(context.params.id)) {
    return NextResponse.json(
      { status: "error", message: "ID inválido" },
      { status: 400 },
    );
  }

  const db = await getDb();
  const doc = await db
    .collection<ItineraryDocument>("itineraries")
    .findOne({ _id: new ObjectId(context.params.id) });

  if (!doc) {
    return NextResponse.json(
      { status: "error", message: "Itinerario no encontrado" },
      { status: 404 },
    );
  }

  const owner = await db
    .collection<UserDocument>("users")
    .findOne({ _id: doc.user_id }, { projection: { name: 1, email: 1 } });

  return NextResponse.json({
    status: "success",
    data: serializeDetail(
      doc,
      owner ? { name: owner.name, email: owner.email } : undefined,
    ),
  });
}

export async function PUT(request: Request, context: RouteContext) {
  const staff = await requireStaffAuth();
  if (staff.error) return staff.error;

  if (!ObjectId.isValid(context.params.id)) {
    return NextResponse.json(
      { status: "error", message: "ID inválido" },
      { status: 400 },
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = adminItineraryUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: parsed.error.issues[0]?.message ?? "Datos inválidos",
        },
        { status: 400 },
      );
    }

    const $set: Record<string, unknown> = {
      updated_at: new Date(),
    };

    if (parsed.data.title !== undefined) $set.title = parsed.data.title;
    if (parsed.data.region !== undefined) $set.region = parsed.data.region;
    if (parsed.data.raw_content !== undefined) {
      $set.raw_content = parsed.data.raw_content;
    }

    const db = await getDb();
    const result = await db
      .collection<ItineraryDocument>("itineraries")
      .findOneAndUpdate(
        { _id: new ObjectId(context.params.id) },
        { $set },
        { returnDocument: "after" },
      );

    if (!result) {
      return NextResponse.json(
        { status: "error", message: "Itinerario no encontrado" },
        { status: 404 },
      );
    }

    const owner = await db
      .collection<UserDocument>("users")
      .findOne({ _id: result.user_id }, { projection: { name: 1, email: 1 } });

    return NextResponse.json({
      status: "success",
      data: serializeDetail(
        result,
        owner ? { name: owner.name, email: owner.email } : undefined,
      ),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudo actualizar el itinerario" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const staff = await requireStaffAuth();
  if (staff.error) return staff.error;

  if (!ObjectId.isValid(context.params.id)) {
    return NextResponse.json(
      { status: "error", message: "ID inválido" },
      { status: 400 },
    );
  }

  const db = await getDb();
  const doc = await db
    .collection<ItineraryDocument>("itineraries")
    .findOne({ _id: new ObjectId(context.params.id) });

  if (!doc) {
    return NextResponse.json(
      { status: "error", message: "Itinerario no encontrado" },
      { status: 404 },
    );
  }

  await db.collection<ItineraryDocument>("itineraries").deleteOne({
    _id: doc._id,
  });

  await db.collection<UserDocument>("users").updateOne(
    { _id: doc.user_id },
    { $pull: { saved_itineraries: doc._id } },
  );

  return NextResponse.json({
    status: "success",
    message: "Itinerario eliminado",
  });
}
