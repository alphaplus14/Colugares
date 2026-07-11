"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminHeroImage,
  adminModuleVisuals,
} from "@/lib/admin-content";

interface StatsData {
  places: { total: number; active: number };
  events: { total: number; active: number };
  itineraries: { total: number };
  users: {
    viajeros: number;
    empleados: number;
    admins: number;
    total: number;
  };
}

export function AdminDashboardClient() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/stats");
      const json = (await response.json()) as {
        data?: StatsData;
        message?: string;
      };
      if (!response.ok) {
        setError(json.message ?? "Error al cargar métricas");
        return;
      }
      setStats(json.data ?? null);
    }
    void load();
  }, []);

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="animate-pulse text-sm text-brand-navy/40">
          Cargando panel...
        </p>
      </div>
    );
  }

  const modules = [
    {
      ...adminModuleVisuals.lugares,
      value: String(stats.places.active),
      hint: `${stats.places.total} en catálogo`,
    },
    {
      ...adminModuleVisuals.eventos,
      value: String(stats.events.active),
      hint: `${stats.events.total} registradas`,
    },
    {
      ...adminModuleVisuals.itinerarios,
      value: String(stats.itineraries.total),
      hint: "Planes de viajeros",
    },
    {
      ...adminModuleVisuals.usuarios,
      value: String(stats.users.viajeros),
      hint: `${stats.users.empleados} empleados`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero visual */}
      <section className="relative overflow-hidden rounded-3xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={adminHeroImage}
          alt=""
          className="h-48 w-full object-cover md:h-56"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-brand-navy/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange">
            Panel Colugares
          </p>
          <h1 className="font-display text-3xl text-white md:text-4xl">
            Gestiona Colombia
          </h1>
          <p className="mt-2 max-w-lg text-sm text-white/70">
            Destinos, festividades e itinerarios curados — la misma energía
            visual del portal, al servicio del equipo.
          </p>
        </div>
      </section>

      {/* Cards con imagen */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="group relative overflow-hidden rounded-2xl shadow-md transition duration-500 ease-godo hover:-translate-y-1 hover:shadow-xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mod.image}
              alt=""
              className="h-44 w-full object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/55 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                {mod.title}
              </p>
              <p className="font-display text-3xl text-white">{mod.value}</p>
              <p className="text-xs text-white/65">{mod.hint}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Acciones rápidas con preview */}
      <section>
        <h2 className="mb-4 font-display text-xl text-brand-navy">
          Acciones rápidas
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            href="/admin/lugares/nuevo"
            title="Nuevo lugar"
            image={adminModuleVisuals.lugares.image}
          />
          <QuickAction
            href="/admin/eventos/nuevo"
            title="Nueva festividad"
            image={adminModuleVisuals.eventos.image}
          />
          <QuickAction
            href="/admin/usuarios"
            title="Gestionar equipo"
            image={adminModuleVisuals.usuarios.image}
          />
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  href,
  title,
  image,
}: {
  href: string;
  title: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group flex overflow-hidden rounded-2xl border border-brand-navy/10 bg-white shadow-sm transition hover:border-brand-orange/40 hover:shadow-lg"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt=""
        className="h-24 w-24 object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="flex flex-1 items-center justify-between px-4">
        <span className="text-sm font-semibold text-brand-navy">{title}</span>
        <span className="text-brand-orange transition group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}
