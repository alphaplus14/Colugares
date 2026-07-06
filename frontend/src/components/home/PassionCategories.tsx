"use client";

import { useState } from "react";
import { passionCategories } from "@/lib/home-content";
import { ScrollReveal } from "./ScrollReveal";

export function PassionCategories() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="bg-neutral-950 py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-colombia-gold">
            Vive tu pasión
          </p>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            ¿Qué te mueve a viajar?
          </h2>
          <p className="mb-12 max-w-2xl text-white/70">
            Cada rincón de Colombia es una invitación a sentir la libertad y la
            emoción de un paraíso biodiverso. Elige tu interés y deja que Colu
            planifique por ti.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {passionCategories.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 60}>
              <button
                type="button"
                className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl text-left md:aspect-[3/4]"
                onMouseEnter={() => setHovered(category.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(category.id)}
                onBlur={() => setHovered(null)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 group-focus:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div
                  className={`absolute inset-0 transition-colors duration-500 ${
                    hovered === category.id
                      ? "bg-colombia-green/70"
                      : "bg-black/50 group-hover:bg-black/40"
                  }`}
                />

                <div className="relative flex h-full flex-col justify-end p-5">
                  <span className="mb-2 text-3xl">{category.icon}</span>
                  <h3 className="text-lg font-bold md:text-xl">{category.title}</h3>
                  <p
                    className={`text-sm text-white/80 transition-all duration-300 ${
                      hovered === category.id
                        ? "mt-1 max-h-10 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {category.subtitle}
                  </p>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
