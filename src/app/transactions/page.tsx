"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Filter, Download, ArrowUpRight, ArrowDownRight, Coffee, ShoppingBag, Utensils, Home, Zap } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type TransactionType = 1 | 2; // matches backend enum values

type TransactionResponseDto = {
  id: number;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string | null;
  date: string;
  userId?: string | null;
};

type TransactionsApiResponse = {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalCount: number;
  recentTransactions: TransactionResponseDto[];
};

type UiTx = {
  id: number;
  title: string;
  category: string;
  amount: number;
  dateLabel: string;
  isIncome: boolean;
  icon: React.ReactNode;
};

function formatDateLabel(dateIso: string) {
  const d = new Date(dateIso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

function pickIcon(category: string, isIncome: boolean) {
  if (isIncome) return <Zap className="text-success" />;

  const c = category.toLowerCase();
  if (c.includes("coffee")) return <Coffee className="text-orange-400" />;
  if (c.includes("grocery") || c.includes("food") || c.includes("utensil")) return <Utensils className="text-green-400" />;
  if (c.includes("rent") || c.includes("housing") || c.includes("home")) return <Home className="text-blue-400" />;
  if (c.includes("entertain") || c.includes("netflix")) return <Zap className="text-purple-400" />;
  return <ShoppingBag className="text-accent" />;
}

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Income" | "Outcome">("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [apiData, setApiData] = useState<TransactionsApiResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);

        // take/page are supported by backend
        const res = await apiFetch<TransactionsApiResponse>(`/api/transactions?take=200&page=1`);
        if (!cancelled) setApiData(res);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load transactions");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const transactions: UiTx[] = useMemo(() => {
    const items = apiData?.recentTransactions ?? [];

    return items.map((t) => {
      // backend: Expense=1, TopUp=2
      const isIncome = t.type === 2;

      return {
        id: t.id,
        title: t.description?.trim() ? t.description!.trim() : (t.category || "Transaction"),
        category: t.category,
        amount: isIncome ? Math.abs(t.amount) : -Math.abs(t.amount),
        dateLabel: formatDateLabel(t.date),
        isIncome,
        icon: pickIcon(t.category, isIncome),
      };
    });
  }, [apiData]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab =
        activeTab === "All" ||
        (activeTab === "Income" && t.isIncome) ||
        (activeTab === "Outcome" && !t.isIncome);
      return matchesSearch && matchesTab;
    });
  }, [transactions, searchQuery, activeTab]);

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="pt-16 px-6 flex items-center justify-between">
        <Link href="/">
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Transactions</h1>
        <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
          <Download className="w-5 h-5" />
        </button>
      </header>

      <div className="px-6 space-y-6">
        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl py-3 pl-11 pr-4 outline-none focus:border-accent transition-all text-sm font-medium"
            />
          </div>
          <button className="w-12 h-12 bg-card border border-border rounded-2xl flex items-center justify-center text-muted hover:text-foreground transition-all">
            <Filter size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-card border border-border rounded-2xl shadow-premium">
          {["All", "Income", "Outcome"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab ? "bg-foreground text-background" : "text-muted hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-muted text-sm font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-red-400 text-sm font-semibold">{error}</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-muted text-sm font-semibold">No transactions found.</div>
        ) : (
          <div className="space-y-6">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-card border border-border p-4 rounded-3xl flex items-center justify-between shadow-premium hover:border-muted transition-all cursor-pointer active:scale-[0.98] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {tx.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{tx.title}</h4>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
                      {tx.dateLabel} • {tx.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-black ${tx.amount > 0 ? "text-success" : "text-foreground"}`}>
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount.toFixed(2)}
                  </span>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-40">
                    {tx.amount > 0 ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                    <span className="text-[8px] font-bold uppercase">USD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

