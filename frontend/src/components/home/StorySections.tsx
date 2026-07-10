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
    <section id="historias" className="relative bg-brand-navy text-white">
      <div className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
        {storySlides.map((slide, index) => (
          <button
            key={slide.number}
            type="button"
            aria-label={`Ir a sección ${slide.number}`}
            className={`pointer-events-auto flex items-center gap-3 transition-all duration-500 ${
              activeIndex === index ? "opacity-100" : "opacity-35 hover:opacity-60"
            }`}
            onClick={() =>
              sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span
              className={`h-px transition-all duration-500 ${
                activeIndex === index
                  ? "w-10 bg-brand-orange"
                  : "w-5 bg-white/40"
              }`}
            />
            <span className="font-display text-xs">{slide.number}</span>
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
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[2.5s] ease-godo"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: activeIndex === index ? "scale(1.08)" : "scale(1)",
            }}
          />
          <div className="absolute inset-0 bg-brand-navy/60" />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28">
            <ScrollReveal delay={index * 80}>
              <span className="mb-5 block font-display text-sm text-brand-orange">
                {slide.number}
              </span>
              <h2 className="text-display-lg mb-2 font-normal">
                {slide.title}
              </h2>
              <h2 className="text-display-lg mb-8 text-brand-orange">
                {slide.highlight}
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-white/80 md:text-lg">
                {slide.description}
              </p>
            </ScrollReveal>
          </div>
        </article>
      ))}
    </section>
  );
}
