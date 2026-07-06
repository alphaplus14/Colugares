import { PlaceForm } from "@/components/admin/PlaceForm";

export default function NuevoLugarPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Nuevo lugar</h1>
      <PlaceForm mode="create" />
    </div>
  );
}
