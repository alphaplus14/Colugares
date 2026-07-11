/** Modelo LLM por defecto — gemini-1.5-flash fue retirado de la API en 2026 */
export const DEFAULT_GEMINI_LLM_MODEL = "gemini-2.5-flash";

/** Obtiene y valida la API key de Gemini (misma key en backend y frontend) */
export function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY no está definida");
  }

  // Placeholders comunes en desarrollo
  if (apiKey.length < 30 || apiKey.includes("tu_api_key") || apiKey === "your_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY inválida en frontend/.env.local — copia la misma key de backend/.env",
    );
  }

  return apiKey;
}

export function getGeminiLlmModel(): string {
  const configured = process.env.GEMINI_LLM_MODEL?.trim();
  if (!configured || configured === "gemini-1.5-flash") {
    return DEFAULT_GEMINI_LLM_MODEL;
  }
  return configured;
}

/** Mensaje amigable en español según el error de Gemini */
export function mapGeminiErrorToMessage(error: unknown): string | null {
  const message = extractErrorText(error);

  if (
    message.includes("API key not valid") ||
    message.includes("API_KEY_INVALID") ||
    message.includes("GEMINI_API_KEY inválida")
  ) {
    return "La clave de Gemini no es válida. Copia GEMINI_API_KEY de backend/.env a frontend/.env.local y reinicia el servidor.";
  }

  if (message.includes("GEMINI_API_KEY no está definida")) {
    return "Falta GEMINI_API_KEY en frontend/.env.local.";
  }

  if (
    message.includes("is not found for API version") ||
    message.includes("gemini-1.5-flash")
  ) {
    return "El modelo de IA configurado ya no está disponible. Usa GEMINI_LLM_MODEL=gemini-2.5-flash en frontend/.env.local.";
  }

  if (
    message.includes("quota") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("429")
  ) {
    return "Se agotó la cuota gratuita de Gemini. Espera unos minutos o cambia a gemini-2.5-flash-lite en GEMINI_LLM_MODEL.";
  }

  return null;
}

function extractErrorText(error: unknown): string {
  if (error instanceof Error) {
    const retryError = error as Error & {
      lastError?: Error;
      errors?: Error[];
    };
    const nested = retryError.lastError?.message ?? retryError.errors?.[0]?.message;
    return nested ?? error.message;
  }
  return String(error);
}
