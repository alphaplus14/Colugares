import ProfileNav from "@/components/profile/ProfileNav";
import PreferencesForm from "@/components/profile/PreferencesForm";
import { requireViajeroPage } from "@/lib/viajero-guard";

export const dynamic = "force-dynamic";

export default async function PreferenciasPage() {
  await requireViajeroPage();

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold text-colombia-green">
        Mis preferencias
      </h1>
      <p className="mb-6 text-gray-500">
        Los cambios afectan inmediatamente las recomendaciones de Colu.
      </p>
      <ProfileNav current="preferencias" />
      <PreferencesForm />
    </>
  );
}
