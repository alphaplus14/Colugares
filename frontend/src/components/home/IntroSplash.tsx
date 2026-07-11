"use client";

import { useEffect, useState } from "react";

const INTRO_STORAGE_KEY = "colugares-intro-seen";
const INTRO_DURATION_MS = 3800;
const EXIT_DURATION_MS = 700;

/** Imagen central de la intro — Caribe colombiano */
const INTRO_IMAGE = "/images/ui/splash.jpg";

interface IntroSplashProps {
  onComplete: () => void;
}

/**
 * Pantalla de bienvenida animada (estilo GoDominican).
 * Tipografía + imagen + silueta de Colombia recorriendo un arco,
 * luego se desvanece hacia la home.
 */
export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [phase, setPhase] = useState<"enter" | "exit">("enter");

  useEffect(() => {
    const exitTimer = window.setTimeout(() => {
      setPhase("exit");
    }, INTRO_DURATION_MS);

    const doneTimer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // sessionStorage no disponible
      }
      onComplete();
    }, INTRO_DURATION_MS + EXIT_DURATION_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

  function handleSkip() {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setPhase("exit");
    window.setTimeout(onComplete, EXIT_DURATION_MS);
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-white transition-opacity duration-700 ease-godo ${
        phase === "exit" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="Bienvenida a Colugares"
      aria-live="polite"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[min(70vw,28rem)] w-[min(70vw,28rem)] rounded-full bg-brand-orange/10 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6">
        <div className="relative flex w-full items-center justify-center gap-3 sm:gap-5 md:gap-8">
          <p className="intro-fade-left max-w-[9rem] text-right font-body text-sm font-medium leading-snug text-brand-navy sm:max-w-[12rem] sm:text-base md:max-w-[14rem] md:text-lg lg:text-xl">
            Tu viaje a Colombia
          </p>

          <div className="relative shrink-0">
            <svg
              className="pointer-events-none absolute left-1/2 top-0 h-[72%] w-[165%] -translate-x-1/2 -translate-y-[58%]"
              viewBox="0 0 320 140"
              fill="none"
              aria-hidden
            >
              <path
                d="M 20 120 Q 160 -10 300 120"
                stroke="#101B25"
                strokeWidth="1.4"
                strokeDasharray="2.5 5.5"
                strokeLinecap="round"
                className="intro-arc-draw"
              />

              {/* Silueta simplificada de Colombia viajando por el arco */}
              <g>
                <animateMotion
                  dur="2.6s"
                  begin="0.5s"
                  fill="freeze"
                  path="M 20 120 Q 160 -10 300 120"
                  calcMode="spline"
                  keyTimes="0;1"
                  keySplines="0.45 0 0.2 1"
                />
                <path
                  d="M7 1c2.2.4 4.2 1.8 4.8 3.8.5 1.6.2 3.3-.6 4.7-.7 1.2-1.8 2.2-2.6 3.4-.7 1-1.2 2.2-2.3 2.8-1.1.6-2.5.4-3.5-.3C1.6 14.6.8 13.2.5 11.7.2 10 .4 8.2 1.1 6.7 1.9 4.9 3.5 3.4 5.4 2.4 6 2.1 6.5 1.4 7 1z"
                  fill="#101B25"
                  transform="translate(-5.5 -8) scale(1.4)"
                />
              </g>
            </svg>

            <div className="intro-image-scale relative h-24 w-36 overflow-hidden rounded-sm shadow-lg sm:h-32 sm:w-48 md:h-40 md:w-60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={INTRO_IMAGE}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <p className="intro-fade-right max-w-[7rem] text-left font-body text-sm font-medium leading-snug text-brand-navy sm:max-w-[9rem] sm:text-base md:max-w-[11rem] md:text-lg lg:text-xl">
            empieza ahora
          </p>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="intro-fade-up mt-16 text-xs font-medium uppercase tracking-[0.25em] text-brand-navy/40 transition hover:text-brand-navy/70"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

/** Comprueba si la intro ya se mostró en esta sesión del navegador */
export function hasSeenIntro(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
