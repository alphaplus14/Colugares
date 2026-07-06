"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { heroPosterUrl, heroVideoUrl } from "@/lib/home-content";

export function HeroBanner() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-end overflow-hidden">
      {/* Video de fondo con fallback a imagen */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={heroPosterUrl}
          className="h-full w-full object-cover"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-32">
        <p
          className={`mb-4 text-sm font-medium uppercase tracking-[0.3em] text-colombia-gold transition-all duration-1000 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Tu aventura por Colombia
        </p>

        <h1
          className={`mb-6 max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl transition-all duration-1000 delay-150 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Descubre un país donde{" "}
          <span className="text-colombia-gold">cada rincón</span> tiene una
          historia
        </h1>

        <p
          className={`mb-10 max-w-xl text-lg text-white/85 transition-all duration-1000 delay-300 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Colugares te guía con inteligencia artificial por destinos curados y
          verificados. Planifica tu viaje ideal en minutos.
        </p>

        <div
          className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500 ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <Link
            href="/planner"
            className="group relative overflow-hidden rounded-full bg-colombia-red px-8 py-3.5 text-base font-semibold text-white transition hover:bg-colombia-red/90"
          >
            <span className="relative z-10">Iniciar Aventura</span>
            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0" />
          </Link>
          <a
            href="#regiones"
            className="rounded-full border border-white/60 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            Explorar regiones
          </a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
