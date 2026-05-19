"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MoreHorizontal,
  TrendingUp,
  Bot,
  X,
  Send,
  PieChart,
  ShoppingBag,
  Utensils,
  Car,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

import { apiFetch } from "@/lib/api";

type TransactionType = 1 | 2; // backend expects: 1=Expense, 2=TopUp

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

type ChartPoint = {
  name: string;
  total: number;
};

type CategoryPoint = {
  name: string;
  total: number;
  icon: React.ReactNode;
  colorClass: string;
  progress: number;
  amountText: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function safeAmount(n: number) {
  return Number.isFinite(n) ? n : 0;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d: Date) {
  const x = startOfDay(d);
  return x.toISOString().slice(0, 10);
}

function weekdayShort(d: Date) {
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function monthShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short" });
}

function formatUsdInt(n: number) {
  return Math.round(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function pickCategoryIcon(category: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("food") || c.includes("grocery") || c.includes("utensil")) return <Utensils size={18} />;
  if (c.includes("travel") || c.includes("transport") || c.includes("car") || c.includes("uber") || c.includes("taxi"))
    return <Car size={18} />;
  return <ShoppingBag size={18} />;
}

function pickCategoryColor(category: string) {
  const c = (category || "").toLowerCase();
  if (c.includes("food") || c.includes("grocery") || c.includes("utensil")) return "bg-orange-500";
  if (c.includes("travel") || c.includes("transport") || c.includes("car") || c.includes("uber") || c.includes("taxi"))
    return "bg-blue-500";
  return "bg-accent";
}

export default function Analytics() {
  const [period, setPeriod] = useState<"Week" | "Month" | "Year">("Week");

  // Existing AI chat UI state (kept)
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "ai" | "user"; text: string }>
  >([
    {
      role: "ai",
      text: "Hello! I'm your AI Financial Assistant. How can I help you today?",
    },
  ]);
  const [userInput, setUserInput] = useState("");

  // analytics data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<TransactionsApiResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<TransactionsApiResponse>(`/api/transactions?take=200&page=1`);
        if (!cancelled) setApiData(res);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Failed to load analytics";
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const expenseTx = useMemo(() => {
    const items = apiData?.recentTransactions ?? [];
    // requirement: type === 1 => Expense only
    return items
      .filter((t) => t.type === 1)
      .map((t) => ({
        ...t,
        amount: safeAmount(t.amount),
        dateObj: new Date(t.date),
      }));
  }, [apiData]);

  const totalSpent = useMemo(() => {
    return expenseTx.reduce((sum, t) => sum + safeAmount(t.amount), 0);
  }, [expenseTx]);

  const chartData: ChartPoint[] = useMemo(() => {
    const now = new Date();

    if (period === "Week") {
      // last 7 days by weekday label
      const map = new Map<string, number>();
      const points: ChartPoint[] = [];


      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = dayKey(d);
        void key;
        // TODO: chart aggregation by day not implemented in this file version
      }

      return points;
    }

    // Fallback for other periods
    return points;
  }, [apiData, period]);

  const handleSendMessage = async () => {
    // Placeholder: keep UI compiling
    if (!userInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user" as const, text: userInput.trim() },
    ]);
    setUserInput("");
  };

  return (
    <div>
      {/* Floating AI Button */}
      <button
        onClick={() => setIsAIChatOpen(true)}
        className="fixed bottom-28 right-6 w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center shadow-accent-glow active:scale-90 transition-all z-40 group"
      >
        <Bot size={32} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-accent rounded-full flex items-center justify-center text-[10px] font-black border-2 border-accent">
          1
        </div>
      </button>

      {/* AI Chat */}
      {isAIChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAIChatOpen(false)}
          />
          <div className="bg-card border border-border w-full max-w-lg h-[80vh] rounded-t-[40px] sm:rounded-[40px] flex flex-col relative shadow-premium animate-in slide-in-from-bottom-20 duration-300">
            {/* Chat Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
                  <Bot size={28} />
                </div>
                <div>
                  <h2 className="font-bold">FinAI Assistant</h2>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                      Online & Analyzing
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAIChatOpen(false)}
                className="w-10 h-10 bg-foreground/5 rounded-full flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-tr-none"
                        : "bg-foreground/5 text-foreground rounded-tl-none border border-border"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-border flex gap-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about your budget..."
                className="flex-1 bg-foreground/5 border border-border rounded-2xl px-5 outline-none focus:border-accent transition-all text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center shadow-accent-glow active:scale-90 transition-all"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function SummaryCard({ label, amount, icon, trend }: { label: string, amount: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-card border border-border p-5 rounded-3xl space-y-4 shadow-premium">
      <div className="w-10 h-10 bg-foreground/5 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{label}</p>
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-bold">{amount}</h3>
          <span className="text-[10px] font-bold text-muted opacity-60 uppercase">{trend}</span>
        </div>
      </div>
    </div>
  );
}
