import { NextResponse } from "next/server";
import { swaggerSpec } from "@/lib/swagger";

/**
 * Sirve la especificación OpenAPI 3.0 generada a partir de los comentarios JSDoc
 * anotados en las rutas de src/app/api. Consumida por /api-docs (Swagger UI).
 */
export async function GET() {
  return NextResponse.json(swaggerSpec);
}
