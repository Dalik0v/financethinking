"use client";

import React, { useState, useEffect } from "react";

const THEMES = [
  { id: "dark", color: "#ef4444", label: "Dark" },
  { id: "green", color: "#22c55e", label: "Green" },
  { id: "purple", color: "#8b5cf6", label: "Purple" },
  { id: "beige", color: "#d6d3d1", label: "Beige" },
] as const;

type ThemeId = typeof THEMES[number]["id"];

export default function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState<ThemeId>("dark");

  useEffect(() => {
    // Get saved theme or use data-theme default from layout
    const saved = localStorage.getItem("theme") as ThemeId | null;
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const theme = saved || current;
    setActiveTheme(theme as ThemeId);
    document.documentElement.setAttribute("data-theme", theme);
  }, []);


  const handleThemeSelect = (themeId: ThemeId) => {
    setActiveTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("theme", themeId);
  };

  return (
    <div className="flex items-center gap-3">
      {THEMES.map((theme) => (
        <button
          key={theme.id}
          onClick={() => handleThemeSelect(theme.id)}
          className={`
            relative w-9 h-9 rounded-full transition-all duration-300
            hover:scale-110 cursor-pointer
            ${activeTheme === theme.id 
              ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-card" 
              : "opacity-70 hover:opacity-100"
            }
          `}
          style={{ backgroundColor: theme.color }}
          title={theme.label}
          aria-label={`Select ${theme.label} theme`}
        />
      ))}
    </div>
  );
}

// Hook for accessing current theme
export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as ThemeId | null;
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme((saved || current) as ThemeId);
  }, []);

  return theme;
}

