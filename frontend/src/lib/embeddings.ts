const EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;

type EmbeddingTaskType = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";

interface GeminiEmbedResponse {
  embedding?: { values?: number[] };
  error?: { message?: string };
}

import { getGeminiApiKey } from "@/lib/gemini-config";

/** Genera embedding de consulta del usuario para búsqueda semántica RAG */
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  return generateEmbedding(text, "RETRIEVAL_QUERY");
}

/** Genera embedding de 768 dimensiones con Gemini REST API */
async function generateEmbedding(
  text: string,
  taskType: EmbeddingTaskType,
): Promise<number[]> {
  const apiKey = getGeminiApiKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      taskType,
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
