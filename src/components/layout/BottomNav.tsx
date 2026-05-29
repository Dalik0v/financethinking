"use client";

import React from "react";
import { Home, Target, Plus, Lightbulb, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  icon: React.ReactElement;
  label: string;
  href: string;
  isCenter?: boolean;
};

export default function BottomNav() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { icon: <Home />, label: "Home", href: "/" },
    { icon: <Target />, label: "Plans", href: "/plans" },
    { icon: <Plus />, label: "Create", href: "/create-transaction", isCenter: true },
    { icon: <Lightbulb />, label: "Insights", href: "/analytics" },
    { icon: <Settings />, label: "Settings", href: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border px-6 py-3 flex justify-between items-center z-50 h-20 pb-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        if (item.isCenter) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 group transition-all active:scale-90 -mt-8"
            >
              <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-accent-glow group-hover:scale-105 transition-all border-4 border-background">
                {React.cloneElement(item.icon, { size: 28, strokeWidth: 2.5, className: "text-white" })}
              </div>
              <span className="text-[10px] font-bold tracking-tight text-accent">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 group transition-all active:scale-90 ${isActive ? "text-accent" : "text-muted hover:text-foreground"}`}
          >
            <div className={`transition-all duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
              {React.cloneElement(item.icon, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}
            </div>
            <span className={`text-[10px] font-bold tracking-tight transition-all ${isActive ? "opacity-100" : "opacity-60"}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}