import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { UserDocument } from "@/types/user.types";

export const dynamic = "force-dynamic";

/** Guard de servidor para rutas exclusivas de viajeros */
export async function requireViajeroPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/mi-perfil/preferencias");
  }

  if (session.user.role !== "viajero") {
    redirect("/admin/dashboard");
  }

  const db = await getDb();
  const user = await db.collection<UserDocument>("users").findOne({
    _id: new ObjectId(session.user.id),
  });

  if (!user?.travel_profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  return { session, user };
}
