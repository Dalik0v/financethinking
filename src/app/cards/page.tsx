"use client";

import React, { useState } from "react";
import { ArrowLeft, Lock, Eye, EyeOff, Snowflake, Shield, Settings, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import { BankCard } from "@/components/shared/BankCard";

export default function CardDetails() {
  const [isFrozen, setIsFrozen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="pt-16 px-6 flex items-center justify-between">
        <Link href="/">
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Card Management</h1>
        <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Card Preview */}
      <section className="px-6 flex justify-center">
        <div className={`transition-all duration-500 transform ${isFrozen ? 'grayscale opacity-50 scale-95' : 'scale-105'}`}>
          <BankCard 
            variant="accent"
            number="4281"
            type="visa"
            name="Salary Account"
            balance="$12,400"
          />
        </div>
      </section>

      {/* Quick Controls */}
      <section className="px-6 grid grid-cols-2 gap-4">
        <button 
          onClick={() => setIsFrozen(!isFrozen)}
          className={`p-6 rounded-[32px] border border-border flex flex-col items-center gap-3 transition-all active:scale-95 ${isFrozen ? 'bg-accent text-white shadow-accent-glow border-accent' : 'bg-card'}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isFrozen ? 'bg-white/20' : 'bg-foreground/5 text-accent'}`}>
            <Snowflake size={24} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{isFrozen ? 'Unfreeze' : 'Freeze'}</span>
        </button>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className={`p-6 rounded-[32px] border border-border flex flex-col items-center gap-3 transition-all active:scale-95 ${showDetails ? 'bg-foreground text-background border-foreground' : 'bg-card'}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${showDetails ? 'bg-background/20' : 'bg-foreground/5 text-accent'}`}>
            {showDetails ? <EyeOff size={24} /> : <Eye size={24} />}
          </div>
          <span className="text-xs font-black uppercase tracking-widest">{showDetails ? 'Hide Info' : 'Show Info'}</span>
        </button>
      </section>

      {/* Detailed Info */}
      {showDetails && (
        <section className="px-6 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-card border border-border p-6 rounded-[32px] space-y-6 shadow-premium">
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
              <span className="text-muted text-xs font-bold uppercase tracking-widest">Card Number</span>
              <span className="font-mono font-bold tracking-[2px]">4281 9012 3456 7890</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/50 pb-4">
              <span className="text-muted text-xs font-bold uppercase tracking-widest">Expiry Date</span>
              <span className="font-bold">08/27</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted text-xs font-bold uppercase tracking-widest">CVV</span>
              <span className="font-bold">***</span>
            </div>
          </div>
        </section>
      )}

      {/* Menu Options */}
      <section className="px-6 space-y-3">
        <h3 className="text-[10px] font-black text-muted uppercase tracking-[2px] ml-2">Security</h3>
        <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-premium">
          <MenuItem icon={<Lock size={20} />} label="Change PIN" />
          <MenuItem icon={<Shield size={20} />} label="Insurance Details" />
          <MenuItem icon={<Zap size={20} />} label="Daily Limits" sub="Current: $5,000" />
        </div>
      </section>
    </div>
  );
}

function MenuItem({ icon, label, sub, color = "text-foreground" }: { icon: React.ReactNode, label: string, sub?: string, color?: string }) {
  return (
    <div className="flex items-center justify-between p-5 hover:bg-foreground/5 transition-all cursor-pointer border-b border-border/50 last:border-0 group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 bg-foreground/5 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <h4 className={`font-bold text-sm ${color}`}>{label}</h4>
          {sub && <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{sub}</p>}
        </div>
      </div>
      <ChevronRight size={18} className="text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all" />
    </div>
  );
}
