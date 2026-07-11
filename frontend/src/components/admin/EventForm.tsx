"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { COLOMBIA_REGIONS } from "@/lib/constants/colombia-regions";
import type { AdminEventItem } from "@/types/event.types";
import type { ColombiaRegion } from "@/types/place.types";

interface EventFormProps {
  mode: "create" | "edit";
  initialData?: AdminEventItem;
}

const inputClass =
  "w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20";

function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

export function EventForm({ mode, initialData }: EventFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [region, setRegion] = useState<ColombiaRegion>(
    initialData?.region ?? "caribe",
  );
  const [city, setCity] = useState(initialData?.city ?? "");
  const [startDate, setStartDate] = useState(
    initialData ? toDateInput(initialData.start_date) : "",
  );
  const [endDate, setEndDate] = useState(
    initialData ? toDateInput(initialData.end_date) : "",
  );
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [tags, setTags] = useState((initialData?.tags ?? []).join(", "));
  const [active, setActive] = useState(initialData?.active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      region,
      city,
      start_date: startDate,
      end_date: endDate,
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      active,
    };

    const url =
      mode === "create"
        ? "/api/admin/events"
        : `/api/admin/events/${initialData?._id}`;

    const response = await fetch(url, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = (await response.json()) as { message?: string };
    setLoading(false);

    if (!response.ok) {
      setError(json.message ?? "No se pudo guardar");
      return;
    }

    router.push("/admin/eventos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Field label="Nombre">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Región">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as ColombiaRegion)}
            className={inputClass}
          >
            {COLOMBIA_REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ciudad">
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Inicio">
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Fin">
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Descripción">
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Tags (separados por coma)">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={inputClass}
          placeholder="cultura, música, carnaval"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-brand-navy">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Activo (visible en home y RAG)
      </label>

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-50"
      >
        {loading
          ? "Guardando..."
          : mode === "create"
            ? "Crear festividad"
            : "Guardar cambios"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-brand-navy">
        {label}
      </label>
      {children}
    </div>
  );
}
