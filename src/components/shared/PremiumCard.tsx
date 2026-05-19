"use client";

import React from "react";
import { CreditCard } from "lucide-react";

export type PremiumCardProps = {
  balance: number | string;
  cardNumber: string;
  holder: string;
  isHidden: boolean;
  onToggleHidden: () => void;
};

function formatMaskedCardNumber(full: string) {
  const digitsOnly = (full ?? "").replace(/\D/g, "");
  const last4 = digitsOnly.slice(-4);
  return `**** **** **** ${last4}`;
}

function formatCardNumber(full: string) {
  const digitsOnly = (full ?? "").replace(/\D/g, "");
  const groups: string[] = [];
  for (let i = digitsOnly.length; i > 0; i -= 4) {
    groups.unshift(digitsOnly.slice(Math.max(0, i - 4), i));
  }
  return groups.join(" ");
}

export function PremiumCard({
  balance,
  cardNumber,
  holder,
  isHidden,
  onToggleHidden,
}: PremiumCardProps) {
  const mask = formatMaskedCardNumber(cardNumber);
  const display = isHidden ? mask : formatCardNumber(cardNumber);

  const formattedBalance = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(Number(balance)) ? Number(balance) : 0);


  return (
    <div className="relative w-[340px] h-44 shrink-0 snap-start">
      <div className="absolute inset-0 -z-10 rounded-[20px] bg-gradient-to-br from-accent/20 via-accent-orange/10 to-transparent blur-xl shadow-accent-glow" />

      <div className="glass rounded-[20px] p-6 shadow-premium/1">
        <div className="group relative h-full overflow-hidden rounded-[18px]">
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(1000px circle at 20% 0%, rgba(239,68,68,0.18), transparent 40%), radial-gradient(800px circle at 80% 20%, rgba(249,115,22,0.12), transparent 45%)",
            }}
          />

          <div
            className="relative rounded-[18px] bg-gradient-to-br from-accent to-accent-orange text-white p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-accent-glow/40"
          >
            <div className="flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div className="bg-white/15 p-2 rounded-xl backdrop-blur-md">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="text-xs font-bold tracking-widest opacity-90">
                  PREMIUM
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4">
                <p className="min-w-0 flex-1 text-xl font-mono tracking-[4px] leading-none whitespace-nowrap overflow-hidden text-ellipsis">
                  {display}
                </p>

                <button
                  type="button"
                  onClick={onToggleHidden}
                  className="shrink-0 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/22 border border-white/10 transition-all duration-300"
                >
                  {isHidden ? "Show" : "Hide"}
                </button>
              </div>

              <div className="flex justify-between items-end mt-4">
                <p className="text-sm font-medium opacity-90">{holder}</p>
                <p className="text-xl font-bold tabular-nums whitespace-nowrap">
                  {formattedBalance}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

