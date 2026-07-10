"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Message } from "ai";
import ChatWindow from "@/components/planner/ChatWindow";
import ItineraryMapPanel from "@/components/planner/ItineraryMapPanel";
import SaveItineraryButton from "@/components/planner/SaveItineraryButton";
import { detectGeographyWarnings } from "@/lib/itinerary/geography";
import { previewItineraryFromContent } from "@/lib/itinerary/parser";
import type {
  ItineraryMapMarker,
  PlaceCatalogEntry,
} from "@/types/itinerary.types";

interface PlannerClientProps {
  userName: string;
  defaultRegion?: string;
}

/** Extrae texto plano del mensaje (compatible con streaming del AI SDK) */
function getAssistantText(message: Message | undefined): string | null {
  if (!message || message.role !== "assistant") {
    return null;
  }

  if (typeof message.content === "string" && message.content.trim()) {
    return message.content;
  }

  return null;
}

export default function PlannerClient({
  userName,
  defaultRegion = "caribe",
}: PlannerClientProps) {
  const [catalog, setCatalog] = useState<PlaceCatalogEntry[]>([]);
  const [markers, setMarkers] = useState<ItineraryMapMarker[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [lastAssistantContent, setLastAssistantContent] = useState<string | null>(
    null,
  );
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      const response = await fetch("/api/places/catalog");
      if (!response.ok) {
        setCatalogError("No se pudo cargar el catálogo de lugares");
        return;
      }
      const json = (await response.json()) as {
        data?: PlaceCatalogEntry[];
      };
      setCatalog(json.data ?? []);
      setCatalogError(null);
    }

    void loadCatalog();
  }, []);

  const handleMessagesChange = useCallback((messages: Message[]) => {
    const lastAssistant = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");

    const text = getAssistantText(lastAssistant);
    if (text) {
      setLastAssistantContent(text);
    }
  }, []);

  // Re-parsear cuando llega el catálogo O cuando Colu responde (evita race condition)
  useEffect(() => {
    if (!lastAssistantContent || catalog.length === 0) {
      return;
    }

    const preview = previewItineraryFromContent(
      lastAssistantContent,
      catalog,
      defaultRegion,
    );

    setMarkers(preview.markers);
    setWarnings(detectGeographyWarnings(preview.days));
  }, [lastAssistantContent, catalog, defaultRegion]);

  const hasPlan = useMemo(() => markers.length > 0, [markers]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-colombia-green text-lg font-bold text-white">
              C
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Colu — Tu guía de Colombia
              </h1>
              <p className="text-sm text-gray-500">
                Chat + mapa en tiempo real con lugares verificados
              </p>
            </div>
          </div>

          <SaveItineraryButton
            rawContent={lastAssistantContent}
            disabled={!hasPlan}
          />
        </div>
        {catalogError && (
          <p className="mx-auto mt-3 max-w-7xl text-sm text-red-600">
            {catalogError}
          </p>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 lg:flex-row lg:items-stretch lg:min-h-[calc(100vh-10rem)]">
        <section className="flex min-h-[480px] flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:max-w-[55%]">
          <ChatWindow
            userName={userName}
            onMessagesChange={handleMessagesChange}
          />
        </section>

        <section className="flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <ItineraryMapPanel
            markers={markers}
            catalog={catalog}
            warnings={warnings}
          />
        </section>
      </main>
    </div>
  );
}
