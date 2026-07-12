import { NextResponse } from "next/server";
import { loadPublicPlaces } from "@/lib/places/load-public-places";
import type { ColombiaRegion, PlaceType } from "@/types/place.types";

/**
 * @swagger
 * /api/places/public:
 *   get:
 *     summary: Catálogo público de lugares (sin autenticación) — página de destinos y UI de visitados
 *     tags: [Places (Público)]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           $ref: '#/components/schemas/ColombiaRegion'
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [hotel, restaurante, actividad, atractivo, agencia]
 *     responses:
 *       200:
 *         description: Listado obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 count: { type: integer }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PlaceSummary'
 *       500:
 *         description: No pudimos cargar los destinos
 */
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
