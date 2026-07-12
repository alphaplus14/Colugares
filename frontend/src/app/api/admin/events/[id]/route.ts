import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdminAuth, requireStaffAuth } from "@/lib/session-guards";
import { updateEventSchema } from "@/lib/validators/event.schema";
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

interface RouteContext {
  params: { id: string };
}

/**
 * @swagger
 * /api/admin/events/{id}:
 *   get:
 *     summary: Obtener el detalle de un evento (CMS)
 *     tags: [Admin - Eventos]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/AdminEvent'
 *       400:
 *         description: ID inválido
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Evento no encontrado
 *   put:
 *     summary: Actualizar un evento (parcial)
 *     tags: [Admin - Eventos]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             description: Igual a EventInput pero con todos los campos opcionales
 *             type: object
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/AdminEvent'
 *       400:
 *         description: Datos inválidos o ID inválido
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Evento no encontrado
 *   delete:
 *     summary: Eliminar un evento permanentemente (solo super-admin)
 *     tags: [Admin - Eventos]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento eliminado
 *       400:
 *         description: ID inválido
 *       403:
 *         description: Solo super-admin puede eliminar
 *       404:
 *         description: Evento no encontrado
 */
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
    .collection<EventDocument>("events")
    .findOne({ _id: new ObjectId(context.params.id) });

  if (!doc) {
    return NextResponse.json(
      { status: "error", message: "Evento no encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json({ status: "success", data: serializeAdminEvent(doc) });
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
    const parsed = updateEventSchema.safeParse(body);

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
    const $set: Record<string, unknown> = {};

    if (data.name !== undefined) $set.name = data.name;
    if (data.region !== undefined) $set.region = data.region as ColombiaRegion;
    if (data.city !== undefined) $set.city = data.city;
    if (data.description !== undefined) $set.description = data.description;
    if (data.tags !== undefined) $set.tags = data.tags;
    if (data.active !== undefined) $set.active = data.active;
    if (data.start_date !== undefined) $set.start_date = new Date(data.start_date);
    if (data.end_date !== undefined) $set.end_date = new Date(data.end_date);

    const db = await getDb();
    const result = await db
      .collection<EventDocument>("events")
      .findOneAndUpdate(
        { _id: new ObjectId(context.params.id) },
        { $set },
        { returnDocument: "after" },
      );

    if (!result) {
      return NextResponse.json(
        { status: "error", message: "Evento no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      data: serializeAdminEvent(result),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudo actualizar el evento" },
      { status: 500 },
    );
  }
}

/** DELETE permanente — solo admin */
export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminAuth();
  if (admin.error) return admin.error;

  if (!ObjectId.isValid(context.params.id)) {
    return NextResponse.json(
      { status: "error", message: "ID inválido" },
      { status: 400 },
    );
  }

  const db = await getDb();
  const result = await db
    .collection<EventDocument>("events")
    .deleteOne({ _id: new ObjectId(context.params.id) });

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { status: "error", message: "Evento no encontrado" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    status: "success",
    message: "Evento eliminado",
  });
}
