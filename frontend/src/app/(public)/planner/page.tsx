import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import PlannerClient from "@/components/planner/PlannerClient";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { UserDocument } from "@/types/user.types";

export const dynamic = "force-dynamic";

export default async function PlannerPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/planner");
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

  const defaultRegion = user.travel_profile.primary_interests[0] ?? "caribe";

  return (
    <PlannerClient
      userName={session.user.name ?? "Viajero"}
      defaultRegion={defaultRegion}
    />
  );
}
