"use client";

import { useChat } from "ai/react";
import { FormEvent, useEffect, useRef } from "react";
import type { Message } from "ai";

interface ChatWindowProps {
  userName: string;
  onMessagesChange?: (messages: Message[]) => void;
}

function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

function parseChatError(raw: string): string {
  if (raw === "An error occurred.") {
    return "Colu no pudo responder. Intenta de nuevo en un momento.";
  }

  try {
    const parsed = JSON.parse(raw) as { message?: string };
    if (parsed.message) {
      return parsed.message;
    }
  } catch {
    // no es JSON
  }
  return raw;
}

export default function ChatWindow({
  userName,
  onMessagesChange,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, append, error } =
    useChat({
      api: "/api/planner/chat",
    });

  useEffect(() => {
    if (messages.length === 0 && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      void append({
        role: "user",
        content: `Hola Colu, soy ${userName}. Ayúdame a planear mi viaje según mi perfil.`,
      });
    }
  }, [messages.length, append, userName]);

  useEffect(() => {
    onMessagesChange?.(messages);
  }, [messages, onMessagesChange]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!input.trim() || isLoading) {
      return;
    }
    handleSubmit(event);
  }

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-6"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                message.role === "user"
                  ? "bg-colombia-green text-white"
                  : "border border-gray-200 bg-white text-gray-800 shadow-sm"
              }`}
            >
              {message.role === "assistant" && (
                <p className="mb-1 text-xs font-semibold text-colombia-green">
                  Colu
                </p>
              )}
              {renderMarkdown(message.content)}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
              Colu está planificando tu aventura...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {parseChatError(error.message ?? "Ocurrió un error. Intenta de nuevo.")}
          </div>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-gray-200 bg-white p-4"
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ej: Quiero 3 días en Cartagena..."
            disabled={isLoading}
            className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:border-colombia-green focus:outline-none focus:ring-1 focus:ring-colombia-green disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-colombia-green px-5 py-2.5 text-sm font-semibold text-white hover:bg-colombia-green/90 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
