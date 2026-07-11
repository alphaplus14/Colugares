"use client";

import { useState } from "react";
import Link from "next/link";

interface SaveItineraryButtonProps {
  rawContent: string | null;
  disabled?: boolean;
}

export default function SaveItineraryButton({
  rawContent,
  disabled,
}: SaveItineraryButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  async function handleSave() {
    if (!rawContent || loading) {
      return;
    }

    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/itineraries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_content: rawContent }),
    });

    const data = (await response.json()) as {
      message?: string;
      data?: { _id: string };
    };

    setLoading(false);

    if (!response.ok) {
      setMessage(data.message ?? "No pudimos guardar el itinerario");
      return;
    }

    setSavedId(data.data?._id ?? null);
    setMessage("Itinerario guardado en tu perfil");
  }

  const canSave = Boolean(rawContent) && !disabled;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleSave}
        disabled={!canSave || loading}
        className="rounded-full bg-brand-orange px-5 py-2 text-xs font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-brand-orange/90 hover:shadow-lg hover:shadow-brand-orange/25 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? "Guardando..." : "Guardar itinerario"}
      </button>

      {savedId && (
        <Link
          href={`/mi-perfil/itinerarios/${savedId}`}
          className="text-sm font-medium text-brand-orange hover:underline"
        >
          Ver en mi perfil →
        </Link>
      )}

      {message && (
        <span
          className={`text-sm ${savedId ? "text-brand-orange" : "text-red-400"}`}
        >
          {message}
        </span>
      )}
    </div>
  );
}
