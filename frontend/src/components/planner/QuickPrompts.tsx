"use client";

import type { QuickPrompt } from "@/lib/planner-content";
import { cn } from "@/lib/utils";

interface QuickPromptsProps {
  prompts: QuickPrompt[];
  onSelect: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

/** Chips de sugerencias rápidas — acelera el inicio del viaje */
export default function QuickPrompts({
  prompts,
  onSelect,
  disabled,
  className,
}: QuickPromptsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {prompts.map((prompt) => (
        <button
          key={prompt.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt.message)}
          className="group flex items-center gap-1.5 rounded-full border border-colombia-green/20 bg-colombia-green/5 px-3 py-1.5 text-xs font-medium text-colombia-green-dark transition-all hover:border-colombia-green/40 hover:bg-colombia-green/10 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="transition-transform group-hover:scale-110">
            {prompt.emoji}
          </span>
          {prompt.label}
        </button>
      ))}
    </div>
  );
}
