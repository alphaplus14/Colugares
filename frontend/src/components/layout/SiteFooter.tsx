import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";

export function SiteFooter() {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <h2 className="text-display-md mb-6 text-brand-orange">
              Siente la alegría
              <br />
              en cada rincón
            </h2>
            <p className="max-w-md text-white/70">
              Colugares conecta viajeros con destinos curados y verificados en
              Colombia. Tu itinerario, guiado por inteligencia artificial.
            </p>
          </div>

          <div className="flex flex-col items-start gap-6 lg:items-end">
            <PillButton href="/planner" size="lg">
              Iniciar Aventura
            </PillButton>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              <a href="#regiones" className="hover:text-white">
                Regiones
              </a>
              <a href="#destinos" className="hover:text-white">
                Destinos
              </a>
              <a href="#festividades" className="hover:text-white">
                Festividades
              </a>
              <Link href="/login" className="hover:text-white">
                Acceso staff
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Colugares. Portal turístico de Colombia.</p>
          <p>Datos curados · Recomendaciones sin alucinaciones</p>
        </div>
      </div>
    </footer>
  );
}
