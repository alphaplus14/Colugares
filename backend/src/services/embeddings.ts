import type { PlaceDocument } from "../types/place.types";

/** Modelo actual en Gemini API (text-embedding-004 fue retirado en 2026) */
const EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;

interface GeminiEmbedResponse {
  embedding?: { values?: number[] };
  error?: { message?: string };
}

function getApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está definida");
  }
  return apiKey;
}

/** Construye el texto que se vectoriza para el índice RAG */
export function buildEmbeddingText(place: Pick<
  PlaceDocument,
  "name" | "type" | "region" | "department" | "city" | "description" | "tags"
>): string {
  return [
    place.name,
    `${place.type} en ${place.city}, ${place.department}, región ${place.region}`,
    place.description,
    `Intereses: ${place.tags.join(", ")}`,
  ].join(". ");
}

/** Genera embedding de 768 dimensiones con Gemini (REST API) */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = getApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      taskType: "RETRIEVAL_DOCUMENT",
      outputDimensionality: EMBEDDING_DIMENSIONS,
    }),
  });

  const data = (await response.json()) as GeminiEmbedResponse;

  if (!response.ok) {
    const message =
      data.error?.message ?? `HTTP ${response.status} al generar embedding`;
    throw new Error(message);
  }

  const values = data.embedding?.values;

  if (!values || values.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Dimensión inesperada: ${values?.length ?? 0}, se esperaban ${EMBEDDING_DIMENSIONS}`,
    );
  }

  return values;
}

export async function generatePlaceEmbedding(
  place: Pick<
    PlaceDocument,
    "name" | "type" | "region" | "department" | "city" | "description" | "tags"
  >,
): Promise<number[]> {
  const text = buildEmbeddingText(place);
  return generateEmbedding(text);
}
