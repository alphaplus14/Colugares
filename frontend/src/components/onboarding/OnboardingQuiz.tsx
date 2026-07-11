"use client";

import { FormEvent, KeyboardEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { COLOMBIA_REGIONS } from "@/lib/constants/colombia-regions";
import type { ColombiaRegion } from "@/types/place.types";
import type {
  BudgetRange,
  GroupType,
  TravelPace,
} from "@/types/user.types";

const TOTAL_STEPS = 5;

const selectedPrimary =
  "border-brand-orange bg-brand-orange/10 ring-1 ring-brand-orange/40";
const selectedSecondary =
  "border-brand-orange-deep/50 bg-brand-sand ring-1 ring-brand-orange-deep/30";
const idleCard =
  "border-brand-navy/10 bg-white hover:border-brand-navy/25";

export default function OnboardingQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [primaryInterests, setPrimaryInterests] = useState<ColombiaRegion[]>([
    "caribe",
  ]);
  const [secondaryInterests, setSecondaryInterests] = useState<
    ColombiaRegion[]
  >([]);
  const [budgetRange, setBudgetRange] = useState<BudgetRange>("medio");
  const [groupType, setGroupType] = useState<GroupType>("pareja");
  const [travelPace, setTravelPace] = useState<TravelPace>("relajado");

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

  function goNext() {
    setError(null);
    setStep((current) => Math.min(current + 1, TOTAL_STEPS));
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(current - 1, 1));
  }

  /** Evita que Enter envíe el formulario antes del paso final */
  function handleFormKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter") {
      return;
    }

    if (step < TOTAL_STEPS) {
      event.preventDefault();
      if (step === 1 && primaryInterests.length === 0) {
        return;
      }
      goNext();
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (step !== TOTAL_STEPS) {
      goNext();
      return;
    }

    setError(null);
    setLoading(true);

    const response = await fetch("/api/user/onboarding", {
      method: "POST",
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

    setLoading(false);

    if (!response.ok) {
      setError(data.message ?? "No pudimos guardar tu perfil");
      return;
    }

    router.push("/planner");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-orange-deep">
          Paso {step} de {TOTAL_STEPS}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-navy/10">
          <div
            className="h-full rounded-full bg-brand-orange transition-all duration-500 ease-godo"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
        {step === 1 && (
          <section>
            <h2 className="mb-2 font-display text-2xl text-brand-navy">
              ¿Qué regiones te interesan más?
            </h2>
            <p className="mb-6 text-sm text-brand-navy/60">
              Colu priorizará destinos de estas regiones en tus itinerarios.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {COLOMBIA_REGIONS.map((region) => (
                <label
                  key={`primary-${region.value}`}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
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
                  <span className="block font-semibold text-brand-navy">
                    {region.label}
                  </span>
                  <span className="mt-1 block text-xs text-brand-navy/55">
                    {region.description}
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="mb-2 font-display text-2xl text-brand-navy">
              ¿Alguna región secundaria?
            </h2>
            <p className="mb-6 text-sm text-brand-navy/60">
              Opcional. Colu las sugerirá al final como alternativa.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {COLOMBIA_REGIONS.map((region) => (
                <label
                  key={`secondary-${region.value}`}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
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
                  <span className="block font-semibold text-brand-navy">
                    {region.label}
                  </span>
                  <span className="mt-1 block text-xs text-brand-navy/55">
                    {region.description}
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="mb-2 font-display text-2xl text-brand-navy">
              ¿Cuál es tu presupuesto aproximado?
            </h2>
            <p className="mb-6 text-sm text-brand-navy/60">
              Colu alertará si un plan supera tu rango.
            </p>
            <div className="grid gap-3">
              {(
                [
                  { value: "bajo", label: "Económico", desc: "Hostels, comida local" },
                  { value: "medio", label: "Medio", desc: "Hoteles 3-4 estrellas" },
                  { value: "alto", label: "Alto", desc: "Experiencias premium" },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    budgetRange === option.value ? selectedPrimary : idleCard
                  }`}
                >
                  <input
                    type="radio"
                    name="budget"
                    className="sr-only"
                    checked={budgetRange === option.value}
                    onChange={() => setBudgetRange(option.value)}
                  />
                  <span className="block font-semibold text-brand-navy">
                    {option.label}
                  </span>
                  <span className="text-sm text-brand-navy/55">{option.desc}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="mb-2 font-display text-2xl text-brand-navy">
              ¿Con quién viajas?
            </h2>
            <p className="mb-6 text-sm text-brand-navy/60">
              Esto ayuda a Colu a ajustar el tipo de actividades.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { value: "solo", label: "Solo/a" },
                  { value: "pareja", label: "Pareja" },
                  { value: "familia", label: "Familia" },
                  { value: "amigos", label: "Amigos" },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-4 text-center transition ${
                    groupType === option.value
                      ? `${selectedPrimary} font-semibold`
                      : idleCard
                  }`}
                >
                  <input
                    type="radio"
                    name="group"
                    className="sr-only"
                    checked={groupType === option.value}
                    onChange={() => setGroupType(option.value)}
                  />
                  <span className="text-brand-navy">{option.label}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2 className="mb-2 font-display text-2xl text-brand-navy">
              ¿Qué ritmo prefieres?
            </h2>
            <p className="mb-6 text-sm text-brand-navy/60">
              Último paso — después conocerás a Colu.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  { value: "intenso", label: "Intenso", desc: "Muchas actividades por día" },
                  { value: "relajado", label: "Relajado", desc: "Más tiempo libre" },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-2xl border p-4 transition ${
                    travelPace === option.value ? selectedPrimary : idleCard
                  }`}
                >
                  <input
                    type="radio"
                    name="pace"
                    className="sr-only"
                    checked={travelPace === option.value}
                    onChange={() => setTravelPace(option.value)}
                  />
                  <span className="block font-semibold text-brand-navy">
                    {option.label}
                  </span>
                  <span className="text-sm text-brand-navy/55">{option.desc}</span>
                </label>
              ))}
            </div>
          </section>
        )}

        <div className="mt-8 flex justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="rounded-full border border-brand-navy/20 px-5 py-2.5 text-sm font-medium text-brand-navy transition hover:bg-brand-cream"
            >
              Atrás
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              disabled={step === 1 && primaryInterests.length === 0}
              onClick={goNext}
              className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
            >
              Continuar
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || primaryInterests.length === 0}
              className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-brand-orange/90 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Comenzar aventura"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
