"use client";

import { useState } from "react";
import { passionCategories } from "@/lib/home-content";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function PassionCategories() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="bg-brand-navy py-24 text-white md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <SectionHeading
            eyebrow="Vive tu pasión"
            title="¿Qué te mueve a viajar?"
            description="Cada rincón de Colombia es una invitación a sentir la libertad. Elige tu interés y deja que Colu planifique por ti."
            light
          />
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {passionCategories.map((category, index) => (
            <ScrollReveal key={category.id} delay={index * 60}>
              <button
                type="button"
                className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl text-left md:aspect-[4/5]"
                onMouseEnter={() => setHovered(category.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(category.id)}
                onBlur={() => setHovered(null)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-godo group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div
                  className={`absolute inset-0 transition-colors duration-500 ${
                    hovered === category.id
                      ? "bg-brand-orange-deep/75"
                      : "bg-brand-navy/55 group-hover:bg-brand-navy/40"
                  }`}
                />

                <div className="relative flex h-full flex-col justify-end p-5 md:p-6">
                  <span className="mb-2 text-2xl md:text-3xl">{category.icon}</span>
                  <h3 className="font-display text-lg md:text-xl">{category.title}</h3>
                  <p
                    className={`text-sm text-white/85 transition-all duration-300 ${
                      hovered === category.id
                        ? "mt-2 max-h-10 opacity-100"
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
