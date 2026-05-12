"use client";

import React from "react";
import { ArrowLeft, Shield, Settings } from "lucide-react";
import Link from "next/link";
import { BankCard } from "@/components/shared/BankCard";

export default function CardDetails() {
  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="pt-16 px-6 flex items-center justify-between">
        <Link href="/">
          <button className="w-10 h-10 bg-card/60 rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>

        <h1 className="text-xl font-bold tracking-tight">Card Management</h1>

        <Link href="/settings" aria-label="Settings">
          <button className="w-10 h-10 bg-card/60 rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
            <Settings className="w-5 h-5" />
          </button>
        </Link>
      </header>

      {/* Card Preview */}
      <section className="px-6 flex justify-center">
        <div className="relative w-full max-w-[420px]">
          <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-accent/20 via-accent-orange/10 to-transparent blur-2xl shadow-accent-glow" />
          <div className="glass rounded-[28px] p-4 shadow-premium/1">
            <div className="flex justify-center">
              <BankCard
                variant="accent"
                number="4281"
                type="visa"
                name="Salary Account"
                balance="$12,400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Essential Info Cards */}
      <section className="px-6 flex flex-col gap-3 items-center">
        <div className="w-full max-w-[420px] glass rounded-[24px] border border-border/50 shadow-premium p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[2px]">
                Balance
              </p>
              <p className="mt-2 text-xl font-bold tracking-tight">$12,400</p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center text-accent">
              {/* subtle decorative shield icon for premium feel */}
              <Shield size={18} />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[420px] glass rounded-[24px] border border-border/50 shadow-premium p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-muted uppercase tracking-[2px]">
                Insurance Status
              </p>
              <p className="mt-2 text-xl font-bold tracking-tight">Active</p>
              <p className="mt-1 text-[12px] text-muted font-medium">
                Coverage enabled for purchases
              </p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center text-accent">
              <Shield size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* Minimal bottom informational text */}
      <footer className="px-6 mt-2">
        <p className="text-center text-[12px] text-muted font-medium leading-relaxed">
          Your card details are protected with secure transaction safeguards.
        </p>
      </footer>
    </div>
  );
}
