"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

interface FloatingAddButtonProps {
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export default function FloatingAddButton({ onClick, size = "md" }: FloatingAddButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        ${sizes[size]}
        relative
        bg-primary
        text-foreground
        rounded-full
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110
        active:scale-95
        ${isPressed ? 'scale-95' : ''}
        shadow-lg
      `}
    >
      <Plus 
        size={iconSizes[size]} 
        className={`
          transition-transform duration-500 ease-out
          group-hover:rotate-90
        `}
      />
    </button>
  );
}
