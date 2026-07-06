"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { featuredDestinations } from "@/lib/home-content";
import { ScrollReveal } from "./ScrollReveal";

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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-colombia-green">
                Destinos destacados
              </p>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Explora el paraíso
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Destino anterior"
                onClick={() => goTo(current - 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition hover:bg-gray-100"
              >
                ←
              </button>
              <span className="min-w-[3rem] text-center text-sm text-gray-500">
                {String(current + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                aria-label="Destino siguiente"
                onClick={() => goTo(current + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition hover:bg-gray-100"
              >
                →
              </button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="grid overflow-hidden rounded-2xl bg-gray-100 lg:grid-cols-2">
            <div
              key={destination.id}
              className="relative min-h-[320px] animate-fade-in bg-cover bg-center lg:min-h-[480px]"
              style={{ backgroundImage: `url(${destination.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r" />
            </div>

            <div
              key={`${destination.id}-info`}
              className="flex flex-col justify-center p-8 lg:p-12"
            >
              <span className="mb-2 text-sm font-medium text-colombia-red">
                {destination.region} · {destination.category}
              </span>
              <h3 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                {destination.name}
              </h3>
              <p className="mb-8 text-gray-600">{destination.description}</p>

              {/* Indicadores de carrusel */}
              <div className="mb-8 flex gap-2">
                {featuredDestinations.map((dest, index) => (
                  <button
                    key={dest.id}
                    type="button"
                    aria-label={`Ver ${dest.name}`}
                    onClick={() => setCurrent(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      index === current
                        ? "w-8 bg-colombia-green"
                        : "w-4 bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              <Link
                href="/planner"
                className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-colombia-green px-6 py-3 text-sm font-semibold text-colombia-green transition hover:bg-colombia-green hover:text-white"
              >
                Explorar destino
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
