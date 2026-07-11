"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Detail {
  _id: string;
  title: string;
  region: string;
  raw_content: string;
  user_name: string;
  user_email: string;
  days: Array<{ day_number: number; title: string }>;
  geography_warnings: string[];
}

interface Props {
  id: string;
}

export function ItineraryAdminDetailClient({ id }: Props) {
  const router = useRouter();
  const [data, setData] = useState<Detail | null>(null);
  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("");
  const [rawContent, setRawContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const response = await fetch(`/api/admin/itineraries/${id}`);
      const json = (await response.json()) as { data?: Detail; message?: string };
      if (!response.ok || !json.data) {
        setError(json.message ?? "No encontrado");
        return;
      }
      setData(json.data);
      setTitle(json.data.title);
      setRegion(json.data.region);
      setRawContent(json.data.raw_content);
    }
    void load();
  }, [id]);

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/admin/itineraries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, region, raw_content: rawContent }),
    });

    const json = (await response.json()) as { message?: string };
    setLoading(false);

    if (!response.ok) {
      setError(json.message ?? "Error al guardar");
      return;
    }

    router.push("/admin/itinerarios");
    router.refresh();
  }

  if (error && !data) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-brand-navy/40">Cargando...</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/itinerarios"
        className="mb-4 inline-block text-sm text-brand-navy/50 hover:text-brand-navy"
      >
        ← Volver
      </Link>
      <h1 className="mb-1 text-2xl font-bold text-brand-navy">Editar itinerario</h1>
      <p className="mb-6 text-sm text-brand-navy/50">
        Viajero: {data.user_name} ({data.user_email})
      </p>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Región</label>
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Contenido (markdown de Colu)
          </label>
          <textarea
            value={rawContent}
            onChange={(e) => setRawContent(e.target.value)}
            rows={14}
            className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 font-mono text-xs"
            required
          />
        </div>

        {data.geography_warnings.length > 0 && (
          <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <p className="font-semibold">Alertas geográficas</p>
            <ul className="mt-1 list-disc pl-4">
              {data.geography_warnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
