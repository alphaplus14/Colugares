import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { registerSchema } from "@/lib/validators/auth.schema";
import type { UserDocument } from "@/types/user.types";

/**
 * POST /api/auth/register
 * Crea una cuenta de viajero con email + password.
 */
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? "Datos inválidos",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const db = await getDb();
    const existing = await db
      .collection<UserDocument>("users")
      .findOne({ email: normalizedEmail });

    if (existing) {
      return NextResponse.json(
        { message: "Ya existe una cuenta con este correo" },
        { status: 409 },
      );
    }

    const password_hash = await bcrypt.hash(password, 12);
    const now = new Date();
    const _id = new ObjectId();

    const doc: UserDocument = {
      _id,
      name,
      email: normalizedEmail,
      password_hash,
      role: "viajero",
      visited_places: [],
      saved_itineraries: [],
      created_at: now,
      last_login: now,
    };

    await db.collection<UserDocument>("users").insertOne(doc);

    return NextResponse.json(
      {
        message: "Cuenta creada correctamente",
        data: { id: _id.toString(), email: normalizedEmail },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[register]", error);
    return NextResponse.json(
      { message: "No se pudo crear la cuenta" },
      { status: 500 },
    );
  }
}
