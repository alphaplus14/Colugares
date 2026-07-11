"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { regions, type RegionData } from "@/lib/home-content";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PillButton } from "@/components/ui/PillButton";

/** Relación real de las fotos en /public/images/regions (752×1024) */
const REGION_IMAGE_WIDTH = 752;
const REGION_IMAGE_HEIGHT = 1024;

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

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <ScrollReveal delay={100}>
            {/*
              El cuadro sigue el tamaño de la foto (3:4), sin forzar square/cover
              que desalinea los botones respecto al mapa dibujado en la imagen.
            */}
            <div className="relative mx-auto w-full max-w-[420px] overflow-hidden rounded-3xl bg-brand-navy shadow-xl lg:max-w-none">
              <Image
                key={selected.id}
                src={selected.image}
                alt={`Mapa de Colombia — región ${selected.name}`}
                width={REGION_IMAGE_WIDTH}
                height={REGION_IMAGE_HEIGHT}
                className="block h-auto w-full"
                sizes="(max-width: 1024px) 420px, 50vw"
                priority
              />

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
