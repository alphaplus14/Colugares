import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import OnboardingQuiz from "@/components/onboarding/OnboardingQuiz";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import type { UserDocument } from "@/types/user.types";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/onboarding");
  }

  if (session.user.role !== "viajero") {
    redirect("/admin/dashboard");
  }

  const db = await getDb();
  const user = await db.collection<UserDocument>("users").findOne({
    _id: new ObjectId(session.user.id),
  });

  if (user?.travel_profile?.onboarding_completed) {
    redirect("/planner");
  }

  return (
    <div className="min-h-screen bg-brand-cream px-6 pb-12 pt-28">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-brand-navy">
          Cuéntanos sobre tu viaje
        </h1>
        <p className="mt-2 text-brand-navy/60">
          5 preguntas para que Colu arme el itinerario perfecto para ti.
        </p>
      </div>
      <OnboardingQuiz />
    </div>
  );
}
