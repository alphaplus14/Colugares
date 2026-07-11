import { redirect } from "next/navigation";
import { requireViajeroPage } from "@/lib/viajero-guard";

export const dynamic = "force-dynamic";

/** Índice de perfil → preferencias */
export default async function MiPerfilIndexPage() {
  await requireViajeroPage();
  redirect("/mi-perfil/preferencias");
}
