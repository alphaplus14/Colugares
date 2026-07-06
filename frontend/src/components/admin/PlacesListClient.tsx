"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Place, PlacesListResponse } from "@/types/place.types";
import {
  EMBEDDING_STATUS_LABELS,
  PLACE_TYPE_LABELS,
  REGION_LABELS,
} from "@/types/place.types";

function EmbeddingBadge({ status }: { status: Place["embedding_status"] }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    ready: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[status]}`}
    >
      {EMBEDDING_STATUS_LABELS[status]}
    </span>
  );
}

export function PlacesListClient() {
  const { data: session } = useSession();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ region: "", type: "" });

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter.region) params.set("region", filter.region);
    if (filter.type) params.set("type", filter.type);

    const response = await fetch(`/api/places?${params.toString()}`);
    const data = (await response.json()) as PlacesListResponse;
    setPlaces(data.data ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    void loadPlaces();
  }, [loadPlaces]);

  async function handleDeactivate(id: string) {
    if (!confirm("¿Desactivar este lugar?")) return;
    await fetch(`/api/places/${id}?action=deactivate`, { method: "PATCH" });
    void loadPlaces();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar permanentemente? Solo administradores.")) return;
    const response = await fetch(`/api/places/${id}`, { method: "DELETE" });
    if (response.ok) void loadPlaces();
    else alert("No tienes permiso o el lugar no existe");
  }

  async function handleReindex(id: string) {
    await fetch(`/api/places/${id}?action=reindex`, { method: "PATCH" });
    void loadPlaces();
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CMS de Lugares</h1>
          <p className="text-sm text-gray-500">
            {places.length} lugares · embeddings con Gemini
          </p>
        </div>
        <Link
          href="/admin/lugares/nuevo"
          className="rounded-md bg-colombia-green px-4 py-2 text-sm font-semibold text-white hover:bg-colombia-green/90"
        >
          + Nuevo lugar
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={filter.region}
          onChange={(e) => setFilter((f) => ({ ...f, region: e.target.value }))}
        >
          <option value="">Todas las regiones</option>
          {Object.entries(REGION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={filter.type}
          onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="">Todos los tipos</option>
          {Object.entries(PLACE_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Cargando lugares...</p>
      ) : places.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="mb-4 text-gray-500">No hay lugares registrados aún.</p>
          <Link
            href="/admin/lugares/nuevo"
            className="text-sm font-semibold text-colombia-green hover:underline"
          >
            Crear el primero →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Nombre</th>
                <th className="px-4 py-3 font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-3 font-medium text-gray-600">Ciudad</th>
                <th className="px-4 py-3 font-medium text-gray-600">IA</th>
                <th className="px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place._id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium">{place.name}</td>
                  <td className="px-4 py-3 capitalize">
                    {PLACE_TYPE_LABELS[place.type]}
                  </td>
                  <td className="px-4 py-3">
                    {place.city}, {REGION_LABELS[place.region]}
                  </td>
                  <td className="px-4 py-3">
                    <EmbeddingBadge status={place.embedding_status} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        place.active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {place.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/lugares/${place._id}/editar`}
                        className="text-colombia-green hover:underline"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleReindex(place._id)}
                        className="text-gray-500 hover:underline"
                      >
                        Re-indexar
                      </button>
                      {place.active && (
                        <button
                          type="button"
                          onClick={() => void handleDeactivate(place._id)}
                          className="text-orange-600 hover:underline"
                        >
                          Desactivar
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(place._id)}
                          className="text-red-600 hover:underline"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
