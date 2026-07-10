import { NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/events/repository";
import { getDb } from "@/lib/mongodb";

/** Calendario público de festividades — sin autenticación */
export async function GET() {
  try {
    const db = await getDb();
    const events = await getUpcomingEvents(db, 6);

    return NextResponse.json({ status: "success", data: events });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos cargar el calendario de eventos" },
      { status: 500 },
    );
  }
}
