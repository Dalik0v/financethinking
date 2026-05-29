"use client";

import React from "react";
import Link from "next/link";
import { Target, Lightbulb, ArrowRight } from "lucide-react";

type Action = {
  href: string;
  icon: React.ReactElement;
  label: string;
  sublabel: string;
};

const ACTIONS: Action[] = [
  {
    href: "/plans",
    icon: <Target size={16} />,
    label: "Goals",
    sublabel: "Track progress",
  },
  {
    href: "/analytics",
    icon: <Lightbulb size={16} />,
    label: "Insights",
    sublabel: "AI analysis",
  },
];

export default function QuickActions() {
  return (
    <section className="px-6">
      <div className="grid grid-cols-2 gap-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group flex items-center justify-between bg-[#0f0f0f] border border-white/5 px-4 py-3 rounded-xl hover:border-white/20 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-white/60 group-hover:bg-white/10 group-hover:text-white transition-all">
                {React.cloneElement(action.icon, { size: 16 })}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white/90 leading-none">
                  {action.label}
                </span>
                <span className="text-[10px] text-white/40 mt-0.5 leading-none">
                  {action.sublabel}
                </span>
              </div>
            </div>
            <ArrowRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}