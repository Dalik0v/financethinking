"use client";

import React from "react";
import { CreditCard } from "lucide-react";

interface BankCardProps {
  number: string;
  type: string;
  balance: string;
  name: string;
  variant?: "accent" | "dark";
}

export function BankCard({ number, type, balance, name, variant = "dark" }: BankCardProps) {
  const isAccent = variant === "accent";
  
  return (
    <div className={`min-w-[280px] h-44 rounded-2xl p-6 flex flex-col justify-between transition-all active:scale-[0.98] cursor-pointer ${
      isAccent 
        ? 'bg-gradient-to-br from-accent to-accent-orange text-white shadow-accent-glow' 
        : 'bg-card border border-border text-foreground'
    }`}>
      <div className="flex justify-between items-start">
        <div className={`${isAccent ? 'bg-white/20' : 'bg-foreground/5'} p-2 rounded-xl backdrop-blur-md`}>
          <CreditCard className={`w-6 h-6 ${isAccent ? 'text-white' : 'text-accent'}`} />
        </div>
        <span className={`text-xs font-bold tracking-widest ${isAccent ? 'opacity-80' : 'text-muted'}`}>
          {type.toUpperCase()}
        </span>
      </div>
      <div>
        <p className={`text-xl font-mono tracking-[4px] mb-1 ${isAccent ? 'text-white' : 'text-foreground/90'}`}>
          •••• {number.slice(-4)}
        </p>
        <div className="flex justify-between items-end">
          <p className={`text-sm font-medium ${isAccent ? 'opacity-90' : 'text-muted'}`}>{name}</p>
          <p className="text-xl font-bold">{balance}</p>
        </div>
      </div>
    </div>
  );
}
