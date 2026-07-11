import ProfileNav from "@/components/profile/ProfileNav";
import VisitedPlacesManager from "@/components/profile/VisitedPlacesManager";
import { requireViajeroPage } from "@/lib/viajero-guard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Lugares visitados | Colugares",
  description: "Marca destinos que ya conoces para mejorar las recomendaciones de Colu",
};

export default async function VisitadosPage() {
  await requireViajeroPage();

  return (
    <>
      <h1 className="mb-2 font-display text-3xl text-brand-navy">
        Lugares visitados
      </h1>
      <p className="mb-6 text-brand-navy/60">
        Estos destinos se excluyen del AI Trip Planner para no repetirte planes.
      </p>
      <ProfileNav current="visitados" />
      <VisitedPlacesManager />
    </>
  );
}
