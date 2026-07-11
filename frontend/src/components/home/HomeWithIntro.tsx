"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { IntroSplash, hasSeenIntro } from "./IntroSplash";

interface HomeWithIntroProps {
  children: ReactNode;
}

/**
 * Envuelve la home: muestra la intro animada una vez por sesión
 * y luego revela el contenido principal.
 */
export function HomeWithIntro({ children }: HomeWithIntroProps) {
  const [ready, setReady] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seen = hasSeenIntro();
    setShowIntro(!seen);
    setReady(true);
  }, []);

  const handleComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  // Evita flash de contenido antes de saber si hay intro
  if (!ready) {
    return (
      <div className="fixed inset-0 z-[100] bg-white" aria-hidden />
    );
  }

  return (
    <>
      {showIntro && <IntroSplash onComplete={handleComplete} />}
      <div
        className={`transition-opacity duration-700 ease-godo ${
          showIntro ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </>
  );
}
