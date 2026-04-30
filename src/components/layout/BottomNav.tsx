"use client";

import React from "react";
import { Home, BarChart2, Plus, Target, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: <Home />, label: "Home", href: "/" },
    { icon: <BarChart2 />, label: "Stats", href: "/analytics" },
    { icon: <Plus />, label: "Transfer", href: "/transfer" },
    { icon: <Target />, label: "Plans", href: "/plans" },
    { icon: <Settings />, label: "Settings", href: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border px-6 py-3 flex justify-between items-center z-50 h-20 pb-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link 
            key={item.label} 
            href={item.href} 
            className={`flex flex-col items-center gap-1 group transition-all active:scale-90 ${isActive ? 'text-accent' : 'text-muted hover:text-foreground'}`}
          >
            <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24, strokeWidth: isActive ? 2.5 : 2 })}
            </div>
            <span className={`text-[10px] font-bold tracking-tight transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
