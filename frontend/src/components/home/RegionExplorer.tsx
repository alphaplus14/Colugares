"use client";

import { useEffect, useState } from "react";
import { regions, type RegionData } from "@/lib/home-content";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PillButton } from "@/components/ui/PillButton";

export function RegionExplorer() {
  const [selected, setSelected] = useState<RegionData>(regions[0]);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(
    null,
  );

  // Al cambiar de región, limpia el highlight elegido
  useEffect(() => {
    setSelectedHighlight(null);
  }, [selected.id]);

  const ctaLabel = selectedHighlight
    ? `Planificar viaje a ${selectedHighlight}`
    : `Planificar viaje a ${selected.name}`;

  return (
    <section id="regiones" className="bg-brand-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Explora Colombia"
            title="Seis regiones, infinitas experiencias"
            description="Selecciona una región y descubre qué te espera. Colugares solo recomienda destinos verificados en nuestra base de datos."
          />
        </ScrollReveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal delay={100}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-navy lg:aspect-square">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-700 ease-godo"
                style={{ backgroundImage: `url(${selected.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />

              <svg
                viewBox="0 0 200 280"
                className="absolute inset-0 h-full w-full p-10 opacity-10"
                fill="currentColor"
              >
                <path
                  className="text-brand-orange"
                  d="M100 20 C130 25 155 45 160 75 C165 100 175 120 170 145 C165 170 155 195 140 220 C125 245 105 260 85 255 C65 250 50 235 45 210 C40 185 35 160 40 135 C45 110 55 85 70 65 C80 50 90 30 100 20 Z"
                />
              </svg>

              {regions.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  aria-label={`Explorar región ${region.name}`}
                  aria-pressed={selected.id === region.id}
                  onClick={() => setSelected(region)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                    selected.id === region.id
                      ? "z-20 scale-110"
                      : "z-10 hover:scale-105"
                  }`}
                  style={{
                    top: region.position.top,
                    left: region.position.left,
                  }}
                >
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-sm transition-colors ${
                      selected.id === region.id
                        ? "bg-brand-orange text-brand-navy"
                        : "bg-white/90 text-brand-navy hover:bg-white"
                    }`}
                  >
                    {selected.id === region.id && (
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-navy" />
                    )}
                    {region.name}
                  </span>
                </button>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex flex-col justify-center">
              <div key={selected.id} className="animate-fade-in">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-deep">
                  {selected.tagline}
                </p>
                <h3 className="text-display-md mb-4 text-brand-navy">
                  {selected.name}
                </h3>
                <p className="mb-8 text-brand-navy/70">{selected.description}</p>

                <div className="mb-10 flex flex-wrap gap-2">
                  {selected.highlights.map((place) => {
                    const isActive = selectedHighlight === place;
                    return (
                      <button
                        key={place}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() =>
                          setSelectedHighlight((current) =>
                            current === place ? null : place,
                          )
                        }
                        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                          isActive
                            ? "border-brand-orange bg-brand-orange text-brand-navy"
                            : "border-brand-navy/10 bg-white text-brand-navy hover:border-brand-orange/50"
                        }`}
                      >
                        {place}
                      </button>
                    );
                  })}
                </div>

                <PillButton href="/planner" variant="dark">
                  {ctaLabel}
                </PillButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
