import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  buildPaginationMeta,
  parsePagination,
} from "@/lib/pagination";
import { requireStaffAuth } from "@/lib/session-guards";
import type { ItineraryDocument } from "@/types/itinerary.types";
import type { UserDocument } from "@/types/user.types";

/** GET /api/admin/itineraries — planes guardados con paginación */
export async function GET(request: Request) {
  const staff = await requireStaffAuth();
  if (staff.error) return staff.error;

  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region");
    const q = searchParams.get("q")?.trim();
    const { page, limit, skip } = parsePagination(searchParams, { limit: 10 });

    const filter: Record<string, unknown> = {};
    if (region) filter.region = region;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { raw_content: { $regex: q, $options: "i" } },
      ];
    }

    const db = await getDb();
    const collection = db.collection<ItineraryDocument>("itineraries");
    const total = await collection.countDocuments(filter);

    const docs = await collection
      .find(filter)
      .sort({ updated_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const userIds = [...new Set(docs.map((d) => d.user_id.toString()))];
    const users =
      userIds.length > 0
        ? await db
            .collection<UserDocument>("users")
            .find({
              _id: { $in: userIds.map((id) => new ObjectId(id)) },
            })
            .project({ name: 1, email: 1 })
            .toArray()
        : [];

    const userMap = new Map(
      users.map((u) => [u._id.toString(), { name: u.name, email: u.email }]),
    );

    const data = docs.map((doc) => {
      const owner = userMap.get(doc.user_id.toString());
      return {
        _id: doc._id.toString(),
        title: doc.title,
        region: doc.region,
        days_count: doc.days.length,
        places_count: doc.places_used.length,
        warnings_count: doc.geography_warnings.length,
        user_id: doc.user_id.toString(),
        user_name: owner?.name ?? "—",
        user_email: owner?.email ?? "—",
        created_at: doc.created_at.toISOString(),
        updated_at: doc.updated_at.toISOString(),
      };
    });

    return NextResponse.json({
      status: "success",
      data,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudieron cargar los itinerarios" },
      { status: 500 },
    );
  }
}
