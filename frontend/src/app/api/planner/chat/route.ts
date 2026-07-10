import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { getGeminiApiKey, getGeminiLlmModel, mapGeminiErrorToMessage } from "@/lib/gemini-config";
import { runRagPipeline } from "@/lib/rag/chain";
import { requireViajeroSession } from "@/lib/session-guards";
import { plannerChatSchema } from "@/lib/validators/planner.schema";

export const maxDuration = 60;

function getGoogleProvider() {
  return createGoogleGenerativeAI({
    apiKey: getGeminiApiKey(),
  });
}

const LLM_MODEL = getGeminiLlmModel();

/** Endpoint RAG principal del AI Trip Planner — siempre responde con SSE */
export async function POST(request: Request) {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body: unknown = await request.json();
    const parsed = plannerChatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "Formato de mensajes inválido" },
        { status: 400 },
      );
    }

    const lastUserMessage = [...parsed.data.messages]
      .reverse()
      .find((message) => message.role === "user");

    if (!lastUserMessage) {
      return NextResponse.json(
        { status: "error", message: "Se requiere un mensaje del usuario" },
        { status: 400 },
      );
    }

    const { systemPrompt } = await runRagPipeline({
      userId: authResult.userId,
      userName: authResult.userName,
      userMessage: lastUserMessage.content,
    });

    const chatMessages = parsed.data.messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role as "user" | "assistant",
        content: message.content,
      }));

    const result = streamText({
      model: getGoogleProvider()(LLM_MODEL),
      system: systemPrompt,
      messages: chatMessages,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (streamError) =>
        mapGeminiErrorToMessage(streamError) ??
        "Colu no pudo generar la respuesta. Intenta de nuevo en un momento.",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    if (errorMessage === "Onboarding incompleto") {
      return NextResponse.json(
        {
          status: "error",
          message: "Completa el onboarding antes de usar el planner",
        },
        { status: 403 },
      );
    }

    const friendlyMessage = mapGeminiErrorToMessage(error);
    if (friendlyMessage) {
      console.error("[planner/chat]", errorMessage);
      return NextResponse.json(
        { status: "error", message: friendlyMessage },
        { status: 503 },
      );
    }

    console.error("[planner/chat]", errorMessage);

    return NextResponse.json(
      {
        status: "error",
        message: "No pudimos procesar tu mensaje. Intenta de nuevo en un momento.",
      },
      { status: 500 },
    );
  }
}
