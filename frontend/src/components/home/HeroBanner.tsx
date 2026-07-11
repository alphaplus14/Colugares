"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heroPosterUrl, heroVideoUrls } from "@/lib/home-content";
import { PillButton } from "@/components/ui/PillButton";

/**
 * Fondo hero con dos clips cortos que se alternan al terminar.
 * Usa dos capas con crossfade suave y pausa fuera de viewport / pestaña oculta.
 */
export function HeroBanner() {
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canPlayVideo, setCanPlayVideo] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([null, null]);
  const inViewRef = useRef(true);

  useEffect(() => {
    setLoaded(true);

    // Respeta usuarios que prefieren menos movimiento
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      return;
    }
    setCanPlayVideo(true);
  }, []);

  useEffect(() => {
    if (!canPlayVideo) {
      return;
    }

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const syncPlayback = () => {
      const visible = inViewRef.current && document.visibilityState === "visible";
      videoRefs.current.forEach((video, index) => {
        if (!video) {
          return;
        }
        if (!visible) {
          video.pause();
          return;
        }
        if (index === activeIndex) {
          void video.play().catch(() => {
            /* autoplay bloqueado: el poster sigue visible */
          });
        } else {
          video.pause();
        }
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.15 },
    );
    observer.observe(section);

    const onVisibility = () => syncPlayback();
    document.addEventListener("visibilitychange", onVisibility);
    syncPlayback();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [activeIndex, canPlayVideo]);

  function handleEnded(index: number) {
    if (index !== activeIndex) {
      return;
    }
    const next = (index + 1) % heroVideoUrls.length;
    const nextVideo = videoRefs.current[next];
    if (nextVideo) {
      nextVideo.currentTime = 0;
      void nextVideo.play().catch(() => undefined);
    }
    setActiveIndex(next);
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-end overflow-hidden bg-brand-navy"
    >
      <div className="absolute inset-0">
        {/* Poster estático como fallback / reduced-motion */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroPosterUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />

        {canPlayVideo &&
          heroVideoUrls.map((src, index) => (
            <video
              key={src}
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              muted
              playsInline
              preload={index === 0 ? "auto" : "metadata"}
              poster={heroPosterUrl}
              onEnded={() => handleEnded(index)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-godo ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            >
              <source src={src} type="video/mp4" />
            </video>
          ))}

        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-black/30" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-28 pt-32 text-center">
        <p
          className={`mb-6 font-body text-sm font-medium uppercase tracking-[0.35em] text-brand-orange transition-all duration-1000 ease-godo ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Tu próxima aventura
        </p>

        <h1
          className={`text-display-xl mb-6 max-w-4xl text-white transition-all duration-1000 delay-150 ease-godo ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="block">Descubre un país</span>
          <span className="block text-brand-orange">donde cada rincón</span>
          <span className="block">tiene una historia</span>
        </h1>

        <p
          className={`mb-10 max-w-xl text-base text-white/80 md:text-lg transition-all duration-1000 delay-300 ease-godo ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Colugares te guía con inteligencia artificial por destinos curados.
          Planifica tu viaje ideal en minutos.
        </p>

        <div
          className={`flex flex-wrap items-center justify-center gap-4 transition-all duration-1000 delay-500 ease-godo ${
            loaded ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <PillButton href="/planner" size="lg">
            Iniciar Aventura
          </PillButton>
          <a
            href="#regiones"
            className="inline-flex h-12 items-center rounded-full border border-white/40 px-8 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            Explorar regiones
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <div className="flex flex-col items-center gap-2 text-white/50">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="h-8 w-px animate-pulse bg-white/40" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 hidden border-t border-white/10 bg-black/20 backdrop-blur-sm lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 text-xs text-white/60">
          <span>Colombia · Portal turístico inteligente</span>
          <Link
            href="/planner"
            className="font-semibold uppercase tracking-wider text-white transition hover:text-brand-orange"
          >
            Planifica con Colu →
          </Link>
        </div>
      </div>
    </section>
  );
}
