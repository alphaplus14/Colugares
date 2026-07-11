"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COLOMBIA_REGIONS } from "@/lib/constants/colombia-regions";
import type { ColombiaRegion } from "@/types/place.types";
import type {
  BudgetRange,
  GroupType,
  TravelPace,
  TravelProfile,
} from "@/types/user.types";

const selectedPrimary =
  "border-brand-orange bg-brand-orange/10 ring-1 ring-brand-orange/40";
const selectedSecondary =
  "border-brand-orange-deep/50 bg-brand-sand";
const idleCard = "border-brand-navy/10 bg-white";

export default function PreferencesForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [primaryInterests, setPrimaryInterests] = useState<ColombiaRegion[]>([
    "caribe",
  ]);
  const [secondaryInterests, setSecondaryInterests] = useState<
    ColombiaRegion[]
  >([]);
  const [budgetRange, setBudgetRange] = useState<BudgetRange>("medio");
  const [groupType, setGroupType] = useState<GroupType>("pareja");
  const [travelPace, setTravelPace] = useState<TravelPace>("relajado");

  useEffect(() => {
    async function loadProfile() {
      const response = await fetch("/api/user/profile");
      const json = (await response.json()) as {
        data?: { travel_profile: TravelProfile | null };
      };

      const profile = json.data?.travel_profile;
      if (profile) {
        setPrimaryInterests(profile.primary_interests as ColombiaRegion[]);
        setSecondaryInterests(profile.secondary_interests as ColombiaRegion[]);
        setBudgetRange(profile.budget_range);
        setGroupType(profile.group_type);
        setTravelPace(profile.travel_pace);
      }

      setLoading(false);
    }

    void loadProfile();
  }, []);

  function toggleRegion(
    region: ColombiaRegion,
    pool: "primary" | "secondary",
  ) {
    if (pool === "primary") {
      setPrimaryInterests((current) =>
        current.includes(region)
          ? current.filter((r) => r !== region)
          : [...current, region],
      );
      return;
    }

    setSecondaryInterests((current) =>
      current.includes(region)
        ? current.filter((r) => r !== region)
        : [...current, region],
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        primary_interests: primaryInterests,
        secondary_interests: secondaryInterests,
        budget_range: budgetRange,
        group_type: groupType,
        travel_pace: travelPace,
      }),
    });

    const data = (await response.json()) as { message?: string };
    setSaving(false);

    if (!response.ok) {
      setError(data.message ?? "No pudimos guardar tus preferencias");
      return;
    }

    setSuccess(
      "Preferencias actualizadas — Colu las usará en tu próximo mensaje",
    );
    router.refresh();
  }

  if (loading) {
    return <p className="text-sm text-brand-navy/40">Cargando preferencias...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-brand-orange/15 px-4 py-3 text-sm text-brand-orange-deep">
          {success}
        </div>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg text-brand-navy">
          Regiones principales
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {COLOMBIA_REGIONS.map((region) => (
            <label
              key={`pref-primary-${region.value}`}
              className={`cursor-pointer rounded-xl border p-3 transition ${
                primaryInterests.includes(region.value)
                  ? selectedPrimary
                  : idleCard
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={primaryInterests.includes(region.value)}
                onChange={() => toggleRegion(region.value, "primary")}
              />
              <span className="text-sm font-medium text-brand-navy">
                {region.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg text-brand-navy">
          Regiones secundarias
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {COLOMBIA_REGIONS.map((region) => (
            <label
              key={`pref-secondary-${region.value}`}
              className={`cursor-pointer rounded-xl border p-3 transition ${
                secondaryInterests.includes(region.value)
                  ? selectedSecondary
                  : idleCard
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={secondaryInterests.includes(region.value)}
                onChange={() => toggleRegion(region.value, "secondary")}
              />
              <span className="text-sm font-medium text-brand-navy">
                {region.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-brand-navy">
            Presupuesto
          </label>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value as BudgetRange)}
            className="w-full rounded-xl border border-brand-navy/15 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
          >
            <option value="bajo">Económico</option>
            <option value="medio">Medio</option>
            <option value="alto">Alto</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-brand-navy">
            Grupo
          </label>
          <select
            value={groupType}
            onChange={(e) => setGroupType(e.target.value as GroupType)}
            className="w-full rounded-xl border border-brand-navy/15 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
          >
            <option value="solo">Solo/a</option>
            <option value="pareja">Pareja</option>
            <option value="familia">Familia</option>
            <option value="amigos">Amigos</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-brand-navy">
            Ritmo
          </label>
          <select
            value={travelPace}
            onChange={(e) => setTravelPace(e.target.value as TravelPace)}
            className="w-full rounded-xl border border-brand-navy/15 bg-white px-3 py-2 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
          >
            <option value="intenso">Intenso</option>
            <option value="relajado">Relajado</option>
          </select>
        </div>
      </section>

      <button
        type="submit"
        disabled={saving || primaryInterests.length === 0}
        className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar preferencias"}
      </button>
    </form>
  );
}
