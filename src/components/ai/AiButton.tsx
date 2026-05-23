"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function AiButton({
  onClick,
  badgeCount = 3,
}: {
  onClick: () => void;
  badgeCount?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open AI Financial Advisor"
      className={
        "fixed z-50 bottom-28 right-6 w-16 h-16 rounded-full " +
        "bg-gradient-to-br from-fuchsia-500 via-rose-500 to-red-500 " +
        "shadow-[0_0_60px_rgba(168,85,247,0.35)] shadow-rose-500/20 " +
        "border border-white/10 backdrop-blur-xl " +
        "flex items-center justify-center " +
        "transition-all duration-300 hover:scale-110 hover:shadow-[0_0_80px_rgba(236,72,153,0.45)]"
      }
    >
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)] opacity-70 pointer-events-none" />
      <Sparkles className="relative text-white" size={22} strokeWidth={2.5} />

      <span
        className={
          "absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full " +
          "bg-black/60 border border-white/15 backdrop-blur-xl " +
          "text-[11px] font-bold text-white flex items-center justify-center"
        }
      >
        {badgeCount}
      </span>
    </button>
  );
}

