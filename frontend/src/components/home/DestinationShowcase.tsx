"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { featuredDestinations } from "@/lib/home-content";
import { ScrollReveal } from "./ScrollReveal";
import { PillButton } from "@/components/ui/PillButton";

export function DestinationShowcase() {
  const [current, setCurrent] = useState(0);
  const total = featuredDestinations.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total],
  );

  const destination = featuredDestinations[current];

  return (
    <section id="destinos" className="relative overflow-hidden bg-white py-24 md:py-32">
      <p
        aria-hidden
        className="section-watermark absolute left-6 top-16 hidden max-w-xl lg:block"
      >
        Explora el paraíso
      </p>

      <div className="relative mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange-deep">
                Destinos destacados
              </p>
              <h2 className="text-display-md text-brand-navy">
                Lugares que inspiran
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Destino anterior"
                onClick={() => goTo(current - 1)}
                className="flex h-10 w-14 items-center justify-center rounded-full border border-brand-navy/20 text-brand-navy transition hover:border-brand-navy hover:bg-brand-cream"
              >
                ←
              </button>
              <span className="min-w-[4rem] text-center font-display text-sm text-brand-navy/50">
                {String(current + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                aria-label="Destino siguiente"
                onClick={() => goTo(current + 1)}
                className="flex h-10 w-14 items-center justify-center rounded-full border border-brand-navy/20 text-brand-navy transition hover:border-brand-navy hover:bg-brand-cream"
              >
                →
              </button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="grid overflow-hidden rounded-3xl bg-brand-cream lg:grid-cols-2">
            <div
              key={destination.id}
              className="relative min-h-[320px] animate-fade-in lg:min-h-[520px]"
            >
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/50 to-transparent lg:bg-gradient-to-r" />
            </div>

            <div
              key={`${destination.id}-info`}
              className="flex flex-col justify-center p-8 lg:p-14"
            >
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-brand-orange/20 px-3 py-1 text-xs font-semibold text-brand-orange-deep">
                  {destination.region}
                </span>
                <span className="rounded-full border border-brand-navy/10 px-3 py-1 text-xs font-medium text-brand-navy/70">
                  {destination.category}
                </span>
              </div>

              <h3 className="text-display-md mb-4 text-brand-navy">
                {destination.name}
              </h3>
              <p className="mb-8 text-brand-navy/70">{destination.description}</p>

              <div className="mb-10 flex gap-2">
                {featuredDestinations.map((dest, index) => (
                  <button
                    key={dest.id}
                    type="button"
                    aria-label={`Ver ${dest.name}`}
                    onClick={() => setCurrent(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === current
                        ? "w-10 bg-brand-orange"
                        : "w-4 bg-brand-navy/20 hover:bg-brand-navy/40"
                    }`}
                  />
                ))}
              </div>

              <PillButton href="/planner" variant="dark" className="w-fit">
                Explorar destino
              </PillButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
