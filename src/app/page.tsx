"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Plus, Search, X } from "lucide-react";
import { PremiumCard } from "@/components/shared/PremiumCard";

import type { CardResponse } from "@/components/shared/types";
import QuickActions from "@/components/layout/QuickActions";
import { apiFetch } from "@/lib/api";
import RecentActivity from "./RecentActivity";


type TransactionsApiResponse = {
  currentBalance: number;
};

export default function Dashboard() {
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<{
    name: string;
    domain: string;
  } | null>(null);

  const [card, setCard] = useState<CardResponse | null>(null);
  const [isHidden, setIsHidden] = useState(true);

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // backend returns currentBalance
        const res = await apiFetch<TransactionsApiResponse>(
"/api/transactions?take=1&page=1"
        );
        if (!cancelled) setBalance(res.currentBalance);
      } catch (e: any) {
        if (!cancelled) setBalanceError(e?.message ?? "Failed to load balance");
      }

      try {
        const cardData = await apiFetch<CardResponse>("/card");
        if (!cancelled) setCard(cardData);
      } catch {
        // optional: ignore card load errors for the demo page
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedBalance = useMemo(() => {
    if (balance === null) return "$0.00";
    return `$${balance.toFixed(2)}`;
  }, [balance]);

  const handleAddBank = () => {
    setIsAddBankOpen(false);
    setSelectedBank(null);
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <header className="pt-16 px-6 flex justify-between items-start">
        <div>
          <p className="text-muted text-sm font-medium tracking-wide uppercase mb-1">
            Total Balance
          </p>
          <h1 className="text-5xl font-bold tracking-tight">
            {formattedBalance}
          </h1>
          {balanceError ? (
            <p className="text-red-400 text-xs font-semibold mt-1">
              {balanceError}
            </p>
          ) : null}
        </div>
        <Link href="/notifications">
          <button className="w-12 h-12 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-all shadow-premium hover:bg-card/80">
            <Bell className="w-5 h-5 text-foreground" />
          </button>
        </Link>
      </header>

      {/* Bank Cards */}
      <section className="mb-10">
        <div className="flex justify-start gap-4 overflow-x-auto lg:overflow-visible no-scrollbar w-full px-6 py-2 items-start">
          <div className="shrink-0">
            <PremiumCard
              balance={card?.balance ?? 0}
              cardNumber={card?.cardNumber ?? "4281"}
              holder={card?.holder ?? ""}
              isHidden={isHidden}
              onToggleHidden={() => setIsHidden((v) => !v)}
            />
          </div>

          <button
            onClick={() => setIsAddBankOpen(true)}
            className="w-[160px] h-44 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 text-muted hover:text-foreground hover:border-muted transition-all active:scale-95 group shrink-0"
          >
            <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">
              Add Bank
            </span>
          </button>
        </div>
      </section>


      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Transactions */}
      <section className="px-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
          <Link href="/transactions">
            <button className="text-accent text-sm font-semibold hover:opacity-80">
              See All
            </button>
          </Link>
        </div>

        <div>
          {/* Live from backend */}
          <RecentActivity />
        </div>
      </section>

      {/* Add Bank Modal Simulation */}
      {isAddBankOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAddBankOpen(false)}
          />
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-8 relative shadow-premium animate-in fade-in slide-in-from-bottom-10 duration-300">
            <button
              onClick={() => setIsAddBankOpen(false)}
              className="absolute right-6 top-6 w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Connect a Bank</h2>
            <p className="text-muted text-sm mb-8 font-medium">
              Select your bank to sync your transactions automatically.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <BankOption
                name="Revolut"
                domain="revolut.com"
                color="bg-[#191C1F]"
                logo="R"
                selected={selectedBank?.name === "Revolut"}
                onSelect={() => setSelectedBank({ name: "Revolut", domain: "revolut.com" })}
              />
              <BankOption
                name="Swedbank"
                domain="swedbank.com"
                color="bg-[#EE7023]"
                logo="S"
                selected={selectedBank?.name === "Swedbank"}
                onSelect={() => setSelectedBank({ name: "Swedbank", domain: "swedbank.com" })}
              />
              <BankOption
                name="SEB"
                domain="seb.se"
                color="bg-[#009241]"
                logo="SEB"
                selected={selectedBank?.name === "SEB"}
                onSelect={() => setSelectedBank({ name: "SEB", domain: "seb.se" })}
              />
              <BankOption
                name="HSBC"
                domain="hsbc.com"
                color="bg-[#DB0011]"
                logo="H"
                selected={selectedBank?.name === "HSBC"}
                onSelect={() => setSelectedBank({ name: "HSBC", domain: "hsbc.com" })}
              />
              <BankOption
                name="Barclays"
                domain="barclays.co.uk"
                color="bg-[#00AEEF]"
                logo="B"
                selected={selectedBank?.name === "Barclays"}
                onSelect={() => setSelectedBank({ name: "Barclays", domain: "barclays.co.uk" })}
              />
              <BankOption
                name="BNP Paribas"
                domain="bnpparibas.com"
                color="bg-[#009159]"
                logo="BNP"
                selected={selectedBank?.name === "BNP Paribas"}
                onSelect={() => setSelectedBank({ name: "BNP Paribas", domain: "bnpparibas.com" })}
              />
            </div>

            <button
              onClick={handleAddBank}
              disabled={!selectedBank}
              className="w-full bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold shadow-accent-glow active:scale-[0.98] transition-all"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function BankOption({
  name,
  domain,
  color,
  logo,
  selected,
  onSelect,
}: {
  name: string;
  domain: string;
  color: string;
  logo: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <button
      onClick={onSelect}
      className={`bg-card border p-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95 text-sm font-bold shadow-premium group ${
        selected ? "border-accent ring-1 ring-accent" : "border-border hover:border-muted"
      }`}
    >
      <div
        className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-white text-[10px] font-black group-hover:scale-110 transition-transform shadow-lg overflow-hidden shrink-0`}
      >
        {!imgError ? (
          <img
            src={`https://logo.clearbit.com/${domain}`}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          logo
        )}
      </div>
      <span className="truncate">{name}</span>
    </button>
  );
}

