import { NextResponse } from "next/server";
import { loadPublicPlaces } from "@/lib/places/load-public-places";
import type { ColombiaRegion, PlaceType } from "@/types/place.types";

/** Catálogo público (sin auth) para destinos y visited_places UI */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get("region") as ColombiaRegion | null;
    const type = searchParams.get("type") as PlaceType | null;

    const places = await loadPublicPlaces({
      region: region ?? undefined,
      type: type ?? undefined,
    });

    return NextResponse.json({ status: "success", count: places.length, data: places });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos cargar los destinos" },
      { status: 500 },
    );
  }
}
