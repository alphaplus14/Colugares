"use client";

import Link from "next/link";
import type { EventListItem } from "@/types/event.types";
import { ScrollReveal } from "./ScrollReveal";

interface EventsTeaserProps {
  events: EventListItem[];
}

export function EventsTeaser({ events }: EventsTeaserProps) {
  return (
    <section className="bg-colombia-green/5 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-colombia-red">
                Festividades
              </p>
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                Siente el calor de los festivales
              </h2>
              <p className="mt-3 max-w-xl text-gray-600">
                Colu detectará automáticamente si tu viaje coincide con un
                evento y lo incluirá en tu itinerario.
              </p>
            </div>
            <Link
              href="/planner"
              className="text-sm font-semibold text-colombia-green underline-offset-4 hover:underline"
            >
              Planear mi viaje →
            </Link>
          </div>
        </ScrollReveal>

        {events.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500">
            Próximamente publicaremos el calendario de festividades.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {events.slice(0, 3).map((event, index) => (
              <ScrollReveal key={event._id} delay={index * 80}>
                <article className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-colombia-gold hover:shadow-lg">
                  <div className="mb-4 flex items-start justify-between">
                    <span className="rounded-full bg-colombia-gold/20 px-3 py-1 text-xs font-semibold text-colombia-green">
                      {event.month_label}
                    </span>
                    <span className="text-2xl opacity-0 transition group-hover:opacity-100">
                      🎉
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-bold text-gray-900">
                    {event.name}
                  </h3>
                  <p className="mb-3 text-sm font-medium text-colombia-red">
                    {event.city}
                  </p>
                  <p className="text-sm text-gray-600">{event.description}</p>
                  {event.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {event.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
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
