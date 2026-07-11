"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Place,
  PlaceFormData,
  PlaceType,
  ColombiaRegion,
  BudgetTier,
  PriceUnit,
} from "@/types/place.types";
import {
  PLACE_TYPE_LABELS,
  REGION_LABELS,
} from "@/types/place.types";

const defaultForm: PlaceFormData = {
  name: "",
  type: "hotel",
  region: "caribe",
  department: "",
  city: "",
  description: "",
  tags: "",
  budget_tier: "medio",
  price_amount: "",
  price_unit: "persona",
  price_season_note: "",
  lat: "",
  lng: "",
  photos: "",
  phone: "",
  email: "",
  website: "",
  recommended_transport: "",
  is_subscriber: true,
  active: true,
};

function placeToForm(place: Place): PlaceFormData {
  return {
    name: place.name,
    type: place.type,
    region: place.region,
    department: place.department,
    city: place.city,
    description: place.description,
    tags: place.tags.join(", "),
    budget_tier: place.budget_tier,
    price_amount: place.price_real?.amount.toString() ?? "",
    price_unit: place.price_real?.unit ?? "persona",
    price_season_note: place.price_real?.season_note ?? "",
    lat: place.coordinates.lat.toString(),
    lng: place.coordinates.lng.toString(),
    photos: place.photos.join("\n"),
    phone: place.contact.phone ?? "",
    email: place.contact.email ?? "",
    website: place.contact.website ?? "",
    recommended_transport: place.recommended_transport.join(", "),
    is_subscriber: place.is_subscriber,
    active: place.active,
  };
}

function formToPayload(form: PlaceFormData) {
  const payload: Record<string, unknown> = {
    name: form.name,
    type: form.type,
    region: form.region,
    department: form.department,
    city: form.city,
    description: form.description,
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    budget_tier: form.budget_tier,
    coordinates: {
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
    },
    photos: form.photos.split("\n").map((p) => p.trim()).filter(Boolean),
    contact: {
      phone: form.phone || undefined,
      email: form.email || undefined,
      website: form.website || undefined,
    },
    recommended_transport: form.recommended_transport
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    is_subscriber: form.is_subscriber,
    active: form.active,
  };

  if (form.price_amount) {
    payload.price_real = {
      amount: parseFloat(form.price_amount),
      unit: form.price_unit,
      currency: "COP",
      ...(form.price_season_note
        ? { season_note: form.price_season_note }
        : {}),
    };
  }

  return payload;
}

interface PlaceFormProps {
  initialData?: Place;
  mode: "create" | "edit";
}

export function PlaceForm({ initialData, mode }: PlaceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PlaceFormData>(
    initialData ? placeToForm(initialData) : defaultForm,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof PlaceFormData>(
    key: K,
    value: PlaceFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const url =
      mode === "create"
        ? "/api/places"
        : `/api/places/${initialData?._id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formToPayload(form)),
    });

    const data = (await response.json()) as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    setLoading(false);

    if (!response.ok) {
      const fieldErrors = data.errors
        ? Object.values(data.errors).flat().join(". ")
        : "";
      setError(data.message ?? fieldErrors ?? "Error al guardar el lugar");
      return;
    }

    router.push("/admin/lugares");
    router.refresh();
  }

  const inputClass =
    "w-full rounded-md border border-brand-navy/15 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-brand-navy/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-brand-navy">
          Información básica
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Nombre *</label>
            <input
              required
              className={inputClass}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Tipo *</label>
            <select
              className={inputClass}
              value={form.type}
              onChange={(e) => updateField("type", e.target.value as PlaceType)}
            >
              {Object.entries(PLACE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Región *</label>
            <select
              className={inputClass}
              value={form.region}
              onChange={(e) =>
                updateField("region", e.target.value as ColombiaRegion)
              }
            >
              {Object.entries(REGION_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Departamento *</label>
            <input
              required
              className={inputClass}
              value={form.department}
              onChange={(e) => updateField("department", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Ciudad *</label>
            <input
              required
              className={inputClass}
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Descripción * (se vectoriza para la IA)
            </label>
            <textarea
              required
              rows={5}
              className={inputClass}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Tags * (separados por coma)
            </label>
            <input
              required
              className={inputClass}
              placeholder="playa, familia, buceo"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-brand-navy/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-brand-navy">
          Ubicación y transporte
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Latitud *</label>
            <input
              required
              type="number"
              step="any"
              className={inputClass}
              value={form.lat}
              onChange={(e) => updateField("lat", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Longitud *</label>
            <input
              required
              type="number"
              step="any"
              className={inputClass}
              value={form.lng}
              onChange={(e) => updateField("lng", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Medios de transporte * (separados por coma)
            </label>
            <input
              required
              className={inputClass}
              placeholder="Avión, Taxi, Bus"
              value={form.recommended_transport}
              onChange={(e) =>
                updateField("recommended_transport", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-brand-navy/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-brand-navy">
          Precio y contacto
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Presupuesto *
            </label>
            <select
              className={inputClass}
              value={form.budget_tier}
              onChange={(e) =>
                updateField("budget_tier", e.target.value as BudgetTier)
              }
            >
              <option value="bajo">Bajo</option>
              <option value="medio">Medio</option>
              <option value="alto">Alto</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Precio COP (opcional)
            </label>
            <input
              type="number"
              className={inputClass}
              value={form.price_amount}
              onChange={(e) => updateField("price_amount", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Unidad precio</label>
            <select
              className={inputClass}
              value={form.price_unit}
              onChange={(e) =>
                updateField("price_unit", e.target.value as PriceUnit)
              }
            >
              <option value="noche">Por noche</option>
              <option value="persona">Por persona</option>
              <option value="grupo">Por grupo</option>
              <option value="dia">Por día</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Nota temporada</label>
            <input
              className={inputClass}
              value={form.price_season_note}
              onChange={(e) => updateField("price_season_note", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Teléfono</label>
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Sitio web</label>
            <input
              type="url"
              className={inputClass}
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              URLs de fotos (una por línea)
            </label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.photos}
              onChange={(e) => updateField("photos", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-brand-navy/10 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-brand-navy">Estado</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_subscriber}
              onChange={(e) => updateField("is_subscriber", e.target.checked)}
            />
            Suscriptor activo (visible para la IA)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => updateField("active", e.target.checked)}
            />
            Publicado en el portal
          </label>
        </div>
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 disabled:opacity-50"
        >
          {loading ? "Guardando..." : mode === "create" ? "Publicar lugar" : "Guardar cambios"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-brand-navy/15 px-6 py-2.5 text-sm font-medium hover:bg-brand-cream"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
