"use client";

import { useEffect, useRef, useState } from "react";
import { storySlides } from "@/lib/home-content";
import { ScrollReveal } from "./ScrollReveal";

export function StorySections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        },
        { threshold: 0.55 },
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="relative bg-neutral-950 text-white">
      {/* Navegación lateral fija — patrón GoDominican */}
      <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {storySlides.map((slide, index) => (
          <button
            key={slide.number}
            type="button"
            aria-label={`Ir a sección ${slide.number}`}
            className={`pointer-events-auto flex items-center gap-2 transition-all ${
              activeIndex === index ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
            onClick={() =>
              sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span
              className={`h-px transition-all ${
                activeIndex === index
                  ? "w-8 bg-colombia-gold"
                  : "w-4 bg-white/50"
              }`}
            />
            <span className="text-xs font-medium">{slide.number}</span>
          </button>
        ))}
      </div>

      {storySlides.map((slide, index) => (
        <article
          key={slide.number}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="relative flex min-h-screen items-center"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2s]"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
            }}
          />
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
            <ScrollReveal delay={index * 80}>
              <span className="mb-4 block text-sm font-medium text-colombia-gold">
                {slide.number}
              </span>
              <h2 className="mb-2 text-4xl font-light md:text-5xl lg:text-6xl">
                {slide.title}
              </h2>
              <h2 className="mb-6 text-4xl font-bold text-colombia-gold md:text-5xl lg:text-6xl">
                {slide.highlight}
              </h2>
              <p className="max-w-lg text-lg text-white/80">{slide.description}</p>
            </ScrollReveal>
          </div>
        </article>
      ))}
    </section>
  );
}
