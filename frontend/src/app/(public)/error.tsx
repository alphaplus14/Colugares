"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PublicError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Colugares public error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 pb-20 pt-28 text-center">
      <h1 className="font-display text-3xl text-brand-navy">
        Algo salió mal
      </h1>
      <p className="mt-3 max-w-md text-sm text-brand-navy/60">
        No pudimos cargar esta sección. Intenta de nuevo o vuelve al inicio.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="rounded-full border border-brand-navy/20 px-6 py-2.5 text-sm font-medium text-brand-navy"
        >
          Inicio
        </Link>
      </div>
    </div>
  );
}
