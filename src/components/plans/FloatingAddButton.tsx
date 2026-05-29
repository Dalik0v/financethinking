"use client";

import { Plus } from "lucide-react";

interface FloatingAddButtonProps {
  onClick: () => void;
}

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-accent-glow active:scale-95 transition-all"
    >
      <Plus size={22} className="text-white" />
    </button>
  );
}