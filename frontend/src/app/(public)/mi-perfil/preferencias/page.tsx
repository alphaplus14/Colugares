import ProfileNav from "@/components/profile/ProfileNav";
import PreferencesForm from "@/components/profile/PreferencesForm";
import { requireViajeroPage } from "@/lib/viajero-guard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Preferencias | Colugares",
  description: "Ajusta tus intereses de viaje para Colu",
};

export default async function PreferenciasPage() {
  await requireViajeroPage();

  return (
    <>
      <h1 className="mb-2 font-display text-3xl text-brand-navy">
        Mis preferencias
      </h1>
      <p className="mb-6 text-brand-navy/60">
        Los cambios afectan inmediatamente las recomendaciones de Colu.
      </p>
      <ProfileNav current="preferencias" />
      <PreferencesForm />
    </>
  );
}
