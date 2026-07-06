"use client";

import { useState } from "react";
import Link from "next/link";
import { regions, type RegionData } from "@/lib/home-content";
import { ScrollReveal } from "./ScrollReveal";

export function RegionExplorer() {
  const [selected, setSelected] = useState<RegionData>(regions[0]);

  return (
    <section id="regiones" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-colombia-green">
            Explora Colombia
          </p>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Seis regiones, infinitas experiencias
          </h2>
          <p className="mb-12 max-w-2xl text-gray-600">
            Selecciona una región en el mapa interactivo y descubre qué te
            espera. Colugares solo recomienda destinos verificados en nuestra
            base de datos.
          </p>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Mapa interactivo simplificado */}
          <ScrollReveal delay={100}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-colombia-green/20 to-colombia-gold/10 lg:aspect-square">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-700"
                style={{ backgroundImage: `url(${selected.image})` }}
              />

              {/* Silueta estilizada de Colombia */}
              <svg
                viewBox="0 0 200 280"
                className="absolute inset-0 h-full w-full p-8 opacity-20"
                fill="currentColor"
              >
                <path
                  className="text-colombia-green"
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
                    selected.id === region.id ? "z-20 scale-110" : "z-10 hover:scale-105"
                  }`}
                  style={{ top: region.position.top, left: region.position.left }}
                >
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-sm transition-colors ${
                      selected.id === region.id
                        ? "bg-colombia-red text-white"
                        : "bg-white/90 text-gray-800 hover:bg-white"
                    }`}
                  >
                    {selected.id === region.id && (
                      <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                    )}
                    {region.name}
                  </span>
                </button>
              ))}

              <p className="absolute bottom-4 left-4 text-xs text-gray-500">
                Toca una región para explorar
              </p>
            </div>
          </ScrollReveal>

          {/* Panel de detalle con transición */}
          <ScrollReveal delay={200}>
            <div className="flex flex-col justify-center">
              <div
                key={selected.id}
                className="animate-fade-in overflow-hidden rounded-2xl"
              >
                <div
                  className="mb-6 h-48 rounded-xl bg-cover bg-center transition-all duration-500"
                  style={{ backgroundImage: `url(${selected.image})` }}
                />
                <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-colombia-red">
                  {selected.tagline}
                </p>
                <h3 className="mb-4 text-3xl font-bold text-gray-900">
                  {selected.name}
                </h3>
                <p className="mb-6 text-gray-600">{selected.description}</p>

                <div className="mb-8 flex flex-wrap gap-2">
                  {selected.highlights.map((place) => (
                    <span
                      key={place}
                      className="rounded-full bg-colombia-green/10 px-4 py-1.5 text-sm font-medium text-colombia-green"
                    >
                      {place}
                    </span>
                  ))}
                </div>

                <Link
                  href="/planner"
                  className="inline-flex items-center gap-2 rounded-full bg-colombia-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-colombia-green/90"
                >
                  Planificar viaje a {selected.name}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
