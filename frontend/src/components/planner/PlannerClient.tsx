"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Message } from "ai";
import ChatWindow from "@/components/planner/ChatWindow";
import ColuAvatar from "@/components/planner/ColuAvatar";
import ItineraryMapPanel from "@/components/planner/ItineraryMapPanel";
import SaveItineraryButton from "@/components/planner/SaveItineraryButton";
import { detectGeographyWarnings } from "@/lib/itinerary/geography";
import { previewItineraryFromContent } from "@/lib/itinerary/parser";
import {
  plannerPosterUrl,
  plannerVideoUrl,
} from "@/lib/planner-content";
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
    <div className="relative flex min-h-screen flex-col pt-20">
      {/* Fondo cinematográfico */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={plannerPosterUrl}
          className="h-full w-full object-cover"
        >
          <source src={plannerVideoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/95 via-brand-navy/80 to-brand-navy/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(250,171,85,0.12),_transparent_55%)]" />
      </div>

      {/* Toolbar */}
      <div className="relative z-10 border-b border-white/10 bg-brand-navy/40 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ColuAvatar size="md" />
            <div>
              <p className="font-display text-lg text-white">
                Colu — Tu guía de Colombia
              </p>
              <p className="text-xs text-white/55">
                Chat y mapa en tiempo real · lugares verificados
              </p>
            </div>
          </div>
          <SaveItineraryButton
            rawContent={lastAssistantContent}
            disabled={!hasPlan}
          />
        </div>
        {catalogError && (
          <p className="mx-auto mt-2 max-w-7xl text-sm text-red-300">
            {catalogError}
          </p>
        )}
      </div>

      {/* Paneles glass */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 lg:flex-row lg:items-stretch lg:min-h-[calc(100vh-9rem)]">
        <section className="planner-glass flex min-h-[480px] flex-1 flex-col overflow-hidden rounded-2xl animate-fade-up lg:max-w-[55%]">
          <ChatWindow
            userName={userName}
            onMessagesChange={handleMessagesChange}
          />
        </section>

        <section
          className="planner-glass flex min-h-[420px] flex-1 flex-col overflow-hidden rounded-2xl animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <ItineraryMapPanel
            markers={markers}
            catalog={catalog}
            warnings={warnings}
          />
        </section>
      </div>
    </div>
  );
}
