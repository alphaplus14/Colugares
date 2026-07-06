"use client";

import Link from "next/link";
import { upcomingEvents } from "@/lib/home-content";
import { ScrollReveal } from "./ScrollReveal";

export function EventsTeaser() {
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
              Ver calendario completo →
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 md:grid-cols-3">
          {upcomingEvents.map((event, index) => (
            <ScrollReveal key={event.id} delay={index * 80}>
              <article className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-colombia-gold hover:shadow-lg">
                <div className="mb-4 flex items-start justify-between">
                  <span className="rounded-full bg-colombia-gold/20 px-3 py-1 text-xs font-semibold text-colombia-green">
                    {event.month}
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
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
