"use client";

import React from "react";
import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Analyze my spending",
  "How can I save more?",
  "Why did my balance drop?",
  "Create a budget plan",
] as const;

export default function AiSuggestions({
  onPick,
}: {
  onPick: (prompt: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onPick(s)}
          className="group w-full text-left bg-white/5 border border-white/10 rounded-2xl px-4 py-3 hover:border-white/20 transition-all duration-300 shadow-[0_0_40px_rgba(168,85,247,0.12)]"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-500/20 via-rose-500/10 to-red-500/20 border border-white/10 flex items-center justify-center">
              <Sparkles size={16} className="text-accent" />
            </span>
            <span className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
              {s}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

