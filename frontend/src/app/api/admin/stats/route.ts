import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/session-guards";
import type { EventDocument } from "@/types/event.types";
import type { ItineraryDocument } from "@/types/itinerary.types";
import type { UserDocument } from "@/types/user.types";

/** GET /api/admin/stats — métricas del dashboard */
export async function GET() {
  const staff = await requireStaffAuth();
  if (staff.error) return staff.error;

  try {
    const db = await getDb();

    const [
      placesTotal,
      placesActive,
      eventsTotal,
      eventsActive,
      itinerariesTotal,
      viajeros,
      empleados,
      admins,
    ] = await Promise.all([
      db.collection("places").countDocuments({}),
      db.collection("places").countDocuments({ active: true }),
      db.collection<EventDocument>("events").countDocuments({}),
      db.collection<EventDocument>("events").countDocuments({ active: true }),
      db.collection<ItineraryDocument>("itineraries").countDocuments({}),
      db.collection<UserDocument>("users").countDocuments({ role: "viajero" }),
      db.collection<UserDocument>("users").countDocuments({ role: "empleado" }),
      db.collection<UserDocument>("users").countDocuments({ role: "admin" }),
    ]);

    return NextResponse.json({
      status: "success",
      data: {
        places: { total: placesTotal, active: placesActive },
        events: { total: eventsTotal, active: eventsActive },
        itineraries: { total: itinerariesTotal },
        users: {
          viajeros,
          empleados,
          admins,
          total: viajeros + empleados + admins,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudieron cargar las métricas" },
      { status: 500 },
    );
  }
}
