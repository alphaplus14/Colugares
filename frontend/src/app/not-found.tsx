import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-6 text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-orange-deep">
        404
      </p>
      <h1 className="font-display text-4xl text-brand-navy md:text-5xl">
        Página no encontrada
      </h1>
      <p className="mt-4 max-w-md text-brand-navy/60">
        Ese destino no está en el mapa de Colugares. Vuelve al inicio o explora
        el catálogo.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <PillButton href="/" variant="dark">
          Ir al inicio
        </PillButton>
        <Link
          href="/destinos"
          className="inline-flex h-11 items-center rounded-full border border-brand-navy/20 px-6 text-sm font-semibold text-brand-navy hover:bg-white"
        >
          Ver destinos
        </Link>
      </div>
    </div>
  );
}
