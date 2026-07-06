import { Request, Response } from "express";
import { ObjectId, OptionalId } from "mongodb";
import { getDb } from "../config/mongodb";
import { parseObjectIdParam } from "../utils/params";
import { createPlaceSchema, updatePlaceSchema } from "../validators/place.schema";
import { scheduleEmbeddingJob } from "../services/embeddingJob";
import type { InternalRequest } from "../middleware/internalAuth";
import type { PlaceDocument, PlacePublicResponse } from "../types/place.types";

function serializePlace(place: PlaceDocument): PlacePublicResponse {
  const { vector_embedding: _vector, ...rest } = place;
  return {
    ...rest,
    _id: place._id.toString(),
  };
}

function normalizeContact(contact: PlaceDocument["contact"]): PlaceDocument["contact"] {
  return {
    phone: contact.phone || undefined,
    email: contact.email || undefined,
    website: contact.website || undefined,
  };
}

/** GET /api/places — listado CMS con filtros opcionales */
export async function getPlaces(req: Request, res: Response): Promise<void> {
  const db = await getDb();
  const { region, type, active } = req.query;

  const filter: Record<string, unknown> = {};

  if (typeof region === "string") {
    filter.region = region;
  }
  if (typeof type === "string") {
    filter.type = type;
  }
  if (active === "true") {
    filter.active = true;
  }
  if (active === "false") {
    filter.active = false;
  }

  const places = await db
    .collection<PlaceDocument>("places")
    .find(filter)
    .sort({ created_at: -1 })
    .toArray();

  res.json({
    status: "ok",
    count: places.length,
    data: places.map(serializePlace),
  });
}

/** GET /api/places/:id */
export async function getPlaceById(req: Request, res: Response): Promise<void> {
  const placeId = parseObjectIdParam(req.params.id);
  if (!placeId) {
    res.status(400).json({ status: "error", message: "ID inválido" });
    return;
  }

  const db = await getDb();
  const place = await db
    .collection<PlaceDocument>("places")
    .findOne({ _id: placeId });

  if (!place) {
    res.status(404).json({ status: "error", message: "Lugar no encontrado" });
    return;
  }

  res.json({ status: "ok", data: serializePlace(place) });
}

/** POST /api/places — crea lugar y encola embedding en background */
export async function createPlace(req: Request, res: Response): Promise<void> {
  const parsed = createPlaceSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      status: "error",
      message: "Datos inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const now = new Date();
  const db = await getDb();

  const doc: OptionalId<PlaceDocument> = {
    ...parsed.data,
    contact: normalizeContact(parsed.data.contact),
    embedding_status: "pending",
    created_at: now,
    updated_at: now,
  };

  const result = await db.collection("places").insertOne(doc);

  scheduleEmbeddingJob(result.insertedId);

  const created = await db
    .collection<PlaceDocument>("places")
    .findOne({ _id: result.insertedId });

  res.status(201).json({
    status: "ok",
    message: "Lugar creado. El embedding se generará en segundo plano.",
    data: created ? serializePlace(created) : null,
  });
}

/** PUT /api/places/:id — actualiza y re-genera embedding si cambia la descripción */
export async function updatePlace(req: Request, res: Response): Promise<void> {
  const parsed = updatePlaceSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      status: "error",
      message: "Datos inválidos",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const db = await getDb();
  const placeId = parseObjectIdParam(req.params.id);
  if (!placeId) {
    res.status(400).json({ status: "error", message: "ID inválido" });
    return;
  }

  const existing = await db
    .collection<PlaceDocument>("places")
    .findOne({ _id: placeId });

  if (!existing) {
    res.status(404).json({ status: "error", message: "Lugar no encontrado" });
    return;
  }

  const updateData = {
    ...parsed.data,
    ...(parsed.data.contact
      ? { contact: normalizeContact(parsed.data.contact) }
      : {}),
    updated_at: new Date(),
  };

  const contentChanged =
    parsed.data.description !== undefined ||
    parsed.data.name !== undefined ||
    parsed.data.tags !== undefined ||
    parsed.data.type !== undefined ||
    parsed.data.city !== undefined;

  if (contentChanged) {
    Object.assign(updateData, { embedding_status: "pending" as const });
  }

  await db
    .collection<PlaceDocument>("places")
    .updateOne({ _id: placeId }, { $set: updateData });

  if (contentChanged) {
    scheduleEmbeddingJob(placeId);
  }

  const updated = await db
    .collection<PlaceDocument>("places")
    .findOne({ _id: placeId });

  res.json({
    status: "ok",
    message: contentChanged
      ? "Lugar actualizado. Re-indexando embedding..."
      : "Lugar actualizado",
    data: updated ? serializePlace(updated) : null,
  });
}

/** DELETE /api/places/:id — solo admin (eliminación permanente) */
export async function deletePlace(
  req: InternalRequest,
  res: Response,
): Promise<void> {
  const db = await getDb();
  const placeId = parseObjectIdParam(req.params.id);
  if (!placeId) {
    res.status(400).json({ status: "error", message: "ID inválido" });
    return;
  }

  const result = await db
    .collection<PlaceDocument>("places")
    .deleteOne({ _id: placeId });

  if (result.deletedCount === 0) {
    res.status(404).json({ status: "error", message: "Lugar no encontrado" });
    return;
  }

  res.json({ status: "ok", message: "Lugar eliminado permanentemente" });
}

/** PATCH /api/places/:id/deactivate — empleados desactivan sin borrar */
export async function deactivatePlace(req: Request, res: Response): Promise<void> {
  const db = await getDb();
  const placeId = parseObjectIdParam(req.params.id);
  if (!placeId) {
    res.status(400).json({ status: "error", message: "ID inválido" });
    return;
  }

  const result = await db
    .collection<PlaceDocument>("places")
    .updateOne(
      { _id: placeId },
      { $set: { active: false, updated_at: new Date() } },
    );

  if (result.matchedCount === 0) {
    res.status(404).json({ status: "error", message: "Lugar no encontrado" });
    return;
  }

  res.json({ status: "ok", message: "Lugar desactivado" });
}

/** POST /api/places/:id/reindex — fuerza regeneración del embedding */
export async function reindexPlace(req: Request, res: Response): Promise<void> {
  const db = await getDb();
  const placeId = parseObjectIdParam(req.params.id);
  if (!placeId) {
    res.status(400).json({ status: "error", message: "ID inválido" });
    return;
  }

  const place = await db
    .collection<PlaceDocument>("places")
    .findOne({ _id: placeId });

  if (!place) {
    res.status(404).json({ status: "error", message: "Lugar no encontrado" });
    return;
  }

  await db
    .collection<PlaceDocument>("places")
    .updateOne(
      { _id: placeId },
      { $set: { embedding_status: "pending", updated_at: new Date() } },
    );

  scheduleEmbeddingJob(placeId);

  res.json({
    status: "ok",
    message: "Re-indexación de embedding iniciada",
  });
}
