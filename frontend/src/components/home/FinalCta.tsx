"use client";

import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 py-32 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1580976010575-92a8068a12a8?w=1920&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-colombia-green/40 to-colombia-red/30" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-colombia-gold">
            Colombia te espera
          </p>
          <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            Tu próxima aventura empieza aquí
          </h2>
          <p className="mb-10 text-lg text-white/80">
            Cuéntale a Colu tus intereses y recibe un itinerario personalizado
            con destinos reales, precios verificados y cero alucinaciones.
          </p>
          <Link
            href="/planner"
            className="inline-block rounded-full bg-colombia-red px-10 py-4 text-lg font-semibold text-white transition hover:bg-colombia-red/90 hover:shadow-xl hover:shadow-colombia-red/20"
          >
            Iniciar Aventura
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
