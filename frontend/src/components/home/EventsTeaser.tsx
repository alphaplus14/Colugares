"use client";

import type { EventListItem } from "@/types/event.types";
import { ScrollReveal } from "./ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PillButton } from "@/components/ui/PillButton";

interface EventsTeaserProps {
  events: EventListItem[];
}

export function EventsTeaser({ events }: EventsTeaserProps) {
  return (
    <section id="festividades" className="bg-brand-sand py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Festividades"
              title="Siente el calor de los festivales"
              description="Colu detectará automáticamente si tu viaje coincide con un evento y lo incluirá en tu itinerario."
            />
            <PillButton href="/planner" variant="dark" size="sm" className="shrink-0">
              Planificar viaje
            </PillButton>
          </div>
        </ScrollReveal>

        {events.length === 0 ? (
          <p className="mt-12 rounded-2xl border border-dashed border-brand-navy/15 bg-white px-6 py-10 text-center text-sm text-brand-navy/50">
            Próximamente publicaremos el calendario de festividades.
          </p>
        ) : (
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {events.slice(0, 3).map((event, index) => (
              <ScrollReveal key={event._id} delay={index * 80}>
                <article className="group h-full rounded-2xl border border-brand-navy/5 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-orange/40 hover:shadow-xl hover:shadow-brand-orange/10">
                  <div className="mb-5 flex items-start justify-between">
                    <span className="rounded-full bg-brand-orange/25 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-orange-deep">
                      {event.month_label}
                    </span>
                    <span className="text-2xl opacity-0 transition group-hover:opacity-100">
                      🎉
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-brand-navy">
                    {event.name}
                  </h3>
                  <p className="mb-3 mt-1 text-sm font-semibold text-brand-orange-deep">
                    {event.city}
                  </p>
                  <p className="text-sm leading-relaxed text-brand-navy/65">
                    {event.description}
                  </p>
                  {event.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {event.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-brand-cream px-2 py-0.5 text-[10px] text-brand-navy/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
