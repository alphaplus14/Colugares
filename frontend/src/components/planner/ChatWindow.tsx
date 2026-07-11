"use client";

import { useChat } from "ai/react";
import { FormEvent, useEffect, useRef } from "react";
import type { Message } from "ai";
import ColuAvatar from "@/components/planner/ColuAvatar";
import QuickPrompts from "@/components/planner/QuickPrompts";
import TypingIndicator from "@/components/planner/TypingIndicator";
import { quickPrompts } from "@/lib/planner-content";

interface ChatWindowProps {
  userName: string;
  onMessagesChange?: (messages: Message[]) => void;
}

function renderMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-brand-navy">
          {part.slice(2, -2)}
        </strong>
      );
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

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    error,
  } = useChat({
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

  function handleQuickPrompt(message: string) {
    if (isLoading) {
      return;
    }
    void append({ role: "user", content: message });
  }

  const showTyping =
    isLoading && messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex h-full flex-col">
      {/* Cabecera del chat */}
      <div className="flex items-center gap-3 border-b border-brand-navy/10 bg-gradient-to-r from-brand-cream/80 to-white px-4 py-3">
        <ColuAvatar size="md" pulse={isLoading} />
        <div className="min-w-0">
          <p className="font-display text-base text-brand-navy">Colu</p>
          <p className="truncate text-xs text-brand-navy/50">
            {isLoading
              ? "Planificando tu aventura..."
              : "Tu guía de Colombia · lugares verificados"}
          </p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scrollbar-planner flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-brand-cream/40 to-white px-4 py-5"
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex animate-fade-in gap-2 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
            style={{ animationDelay: `${Math.min(index, 6) * 40}ms` }}
          >
            {message.role === "assistant" && (
              <ColuAvatar size="sm" className="mt-1" />
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                message.role === "user"
                  ? "rounded-br-md bg-brand-navy text-white"
                  : "rounded-bl-md border border-brand-navy/10 bg-white text-brand-navy/90 shadow-sm"
              }`}
            >
              {message.role === "assistant" && (
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange-deep">
                  Colu
                </p>
              )}
              {renderMarkdown(message.content)}
            </div>
          </div>
        ))}

        {showTyping && (
          <div className="flex animate-fade-in items-start gap-2">
            <ColuAvatar size="sm" pulse />
            <div className="rounded-2xl rounded-bl-md border border-brand-navy/10 bg-white px-4 py-3 shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {parseChatError(
              error.message ?? "Ocurrió un error. Intenta de nuevo.",
            )}
          </div>
        )}
      </div>

      <div className="border-t border-brand-navy/10 bg-white/95 p-3 sm:p-4">
        <QuickPrompts
          prompts={quickPrompts}
          onSelect={handleQuickPrompt}
          disabled={isLoading}
          className="mb-3"
        />

        <form onSubmit={onSubmit}>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ej: Quiero 3 días en Cartagena..."
              disabled={isLoading}
              className="flex-1 rounded-full border border-brand-navy/15 bg-brand-cream/50 px-4 py-2.5 text-sm text-brand-navy placeholder:text-brand-navy/40 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-brand-orange/90 hover:shadow-lg hover:shadow-brand-orange/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
