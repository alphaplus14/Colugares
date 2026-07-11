import { EventForm } from "@/components/admin/EventForm";

export default function NuevoEventoPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-brand-navy">
        Nueva festividad
      </h1>
      <EventForm mode="create" />
    </div>
  );
}
