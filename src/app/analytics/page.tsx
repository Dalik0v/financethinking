"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  ClipboardList,
  Sparkles,
  Wallet,
  Wallet2,
  Zap,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import AiButton from "@/components/ai/AiButton";
import AiDrawer from "@/components/ai/AiDrawer";

type Timeframe = "24H" | "7D" | "1M" | "3M" | "ALL";

type BalanceHistoryPoint = {
  date: string; // yyyy-MM-dd
  balance: number;
};

type Transaction = {
  id: number;
  amount: number;
  type: number; // 0 = Income, 1 = Expense
  date: string;
};

type ChartPoint = {
  dateLabel: string;
  balance: number;
  ts: number;
};

function formatUsd(n: number) {
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(safe);
}

function parsePointTs(dateStr: string) {
  // yyyy-MM-dd => local midnight
  const [y, m, d] = dateStr.split("-").map((x) => Number(x));
  if (!y || !m || !d) return Date.parse(dateStr);
  return new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
}

function formatDayLabel(dateStr: string) {
  const ts = parsePointTs(dateStr);
  const dt = new Date(ts);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function timeframeStartTs(tf: Timeframe) {
  const now = new Date();
  if (tf === "24H") return now.getTime() - 24 * 60 * 60 * 1000;
  if (tf === "7D") return now.getTime() - 7 * 24 * 60 * 60 * 1000;
  if (tf === "1M") {
    const dt = new Date(now);
    dt.setMonth(dt.getMonth() - 1);
    return dt.getTime();
  }
  if (tf === "3M") {
    const dt = new Date(now);
    dt.setMonth(dt.getMonth() - 3);
    return dt.getTime();
  }
  return Number.NEGATIVE_INFINITY;
}

type PremiumTooltipPayload = { value?: number };

function PremiumTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: PremiumTooltipPayload[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  const balance = payload[0]?.value;
  const dateLabel = typeof label === "string" ? label : "";

  return (
    <div className="rounded-2xl border border-border/60 bg-black/60 backdrop-blur-xl px-3 py-2 shadow-lg shadow-accent-glow/10">
      <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{dateLabel}</div>
      <div className="mt-1 text-sm font-black tabular-nums">
        {formatUsd(typeof balance === "number" ? balance : 0)}
      </div>
    </div>
  );
}

function PremiumStatCard({
  title,
  value,
  sub,
  icon,
  trend,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  trend?: { dir: "up" | "down"; pct: number } | null;
}) {
  const trendColor = trend?.dir === "up" ? "text-success" : "text-danger";
  const TrendIcon = trend?.dir === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="group relative bg-card/60 border border-border/60 rounded-3xl p-5 overflow-hidden shadow-premium hover:border-muted transition-all">
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-accent/10 blur-2xl opacity-70 transition-opacity group-hover:opacity-100" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="w-11 h-11 rounded-2xl bg-foreground/5 flex items-center justify-center border border-border/40">
            {icon}
          </div>

          {trend ? (
            <div
              className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${trendColor}`}
            >
              <TrendIcon size={12} className="opacity-90" />
              {trend.pct.toFixed(1)}%
            </div>
          ) : (
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted opacity-70">{sub}</div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{title}</p>
          <div className="flex items-end justify-between gap-3 mt-2">
            <h3 className="text-xl font-bold tabular-nums">{value}</h3>
            <span className="text-[10px] font-bold text-muted opacity-60 uppercase">{sub}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("7D");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BalanceHistoryPoint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);
        const [res, txRes] = await Promise.all([
          apiFetch<BalanceHistoryPoint[]>("/analytics/balance-history"),
          apiFetch<{ items: Transaction[] }>("/transactions?take=10000&page=1").catch(() => ({ items: [] })),
        ]);
        if (!cancelled) {
          setData(Array.isArray(res) ? res : []);
          setTransactions(Array.isArray(txRes) ? txRes : (txRes as { items: Transaction[] }).items ?? []);
        }
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

  const chartPoints: ChartPoint[] = useMemo(() => {
    const pts = (data ?? []).map((p) => ({
      dateLabel: formatDayLabel(p.date),
      balance: typeof p.balance === "number" && Number.isFinite(p.balance) ? p.balance : 0,
      ts: parsePointTs(p.date),
    }));

    pts.sort((a, b) => a.ts - b.ts);
    return pts;
  }, [data]);

  const filtered = useMemo(() => {
    const start = timeframeStartTs(timeframe);
    return chartPoints.filter((p) => p.ts >= start);
  }, [chartPoints, timeframe]);

  const currentBalance = filtered.length ? filtered[filtered.length - 1].balance : 0;

  const balanceChange = useMemo(() => {
    if (chartPoints.length < 2) return { pct: 0, dir: "up" as const };

    const start = timeframeStartTs(timeframe);
    const windowPts = chartPoints.filter((p) => p.ts >= start);
    if (windowPts.length < 2) return { pct: 0, dir: "up" as const };

    const first = windowPts[0].balance;
    const last = windowPts[windowPts.length - 1].balance;
    const pct = first === 0 ? 0 : ((last - first) / Math.abs(first)) * 100;
    const dir = pct >= 0 ? "up" : "down";

    return { pct, dir };
  }, [chartPoints, timeframe]);

  const { totalIncome, totalExpense } = useMemo(() => {
    const start = timeframeStartTs(timeframe);
    const filtered = transactions.filter((t) => new Date(t.date).getTime() >= start);
    const totalIncome = filtered.filter((t) => t.type === 0).reduce((s, t) => s + t.amount, 0);
    const totalExpense = filtered.filter((t) => t.type === 1).reduce((s, t) => s + t.amount, 0);
    return { totalIncome, totalExpense };
  }, [transactions, timeframe]);

  const insightsText = useMemo(() => {
    const pctAbs = Math.abs(balanceChange.pct);
    if (filtered.length < 2) return "Add transactions to see growth insights.";

    if (balanceChange.dir === "up") {
      return `Your balance increased ${pctAbs.toFixed(1)}% over ${timeframe === "ALL" ? "your selected range" : timeframe}.`;
    }

    return `Your balance decreased ${pctAbs.toFixed(1)}% over ${timeframe === "ALL" ? "your selected range" : timeframe}.`;
  }, [balanceChange.dir, balanceChange.pct, filtered.length, timeframe]);

  return (
    <div className="flex flex-col gap-6 pb-32">
      {/* Header */}
      <header className="pt-16 px-6 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 shadow-accent-glow/10">
            <Sparkles size={14} className="text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Analytics</span>
          </div>
          <h1 className="mt-3 text-2xl font-black tracking-tight">Track your financial growth</h1>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-bold text-muted uppercase tracking-widest">Current balance</div>
          <div className="mt-2 text-2xl font-black tabular-nums">{formatUsd(currentBalance)}</div>
        </div>
      </header>

      {/* Timeframe selector */}
      <div className="px-6">
        <div className="glass rounded-full border border-border/70 p-2 flex gap-2 shadow-premium">
          {(["24H", "7D", "1M", "3M", "ALL"] as Timeframe[]).map((tf) => {
            const active = timeframe === tf;
            return (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`flex-1 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                  active
                    ? "bg-accent/20 text-accent border border-accent/40 shadow-[0_0_20px_rgba(124,58,237,0.35)]"
                    : "text-muted hover:text-foreground/90 hover:bg-foreground/5"
                }`}
              >
                {tf}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main chart */}
      <div className="px-6">
        <div className="relative bg-card/40 border border-border/60 rounded-3xl shadow-premium overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_20%_0%,rgba(124,58,237,0.22),transparent_40%),radial-gradient(420px_circle_at_90%_20%,rgba(249,115,22,0.14),transparent_42%)]" />
          <div className="relative p-4 sm:p-6">
            {loading ? (
              <div className="h-[320px] rounded-2xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                <div className="w-44 h-7 rounded-full bg-foreground/10 animate-pulse" />
              </div>
            ) : error ? (
              <div className="h-[320px] rounded-2xl border border-border/60 flex flex-col items-center justify-center gap-2 text-center">
                <div className="text-red-400 font-bold">{error}</div>
                <div className="text-muted text-sm">Failed to load analytics.</div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="h-[320px] rounded-2xl border border-border/60 flex flex-col items-center justify-center gap-2 text-center">
                <div className="text-muted font-bold">No analytics yet</div>
                <div className="text-muted text-sm">Add transactions to see the balance curve.</div>
              </div>
            ) : (
              <div className="h-[320px]">
                <ResponsiveContainer width="99%" height={320}>
                  <AreaChart data={filtered} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
                        <stop offset="65%" stopColor="#7c3aed" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="balanceStroke" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="55%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="dateLabel"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#6b7280", fontSize: 11, fontWeight: 700 }}
                    />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "transparent" }} domain={["auto", "auto"]} />
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 6" vertical={false} />

                    <Tooltip content={<PremiumTooltip />} />

                    <Area
                      type="monotone"
                      dataKey="balance"
                      name="Balance"
                      stroke="url(#balanceStroke)"
                      strokeWidth={3.5}
                      fill="url(#balanceFill)"
                      isAnimationActive
                      animationDuration={900}
                      dot={false}
                      activeDot={{ r: 4.5, strokeWidth: 0, fill: "#f97316" }}
                      connectNulls
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional cards */}
      <div className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PremiumStatCard
            title="Income"
            value={formatUsd(totalIncome)}
            sub={timeframe === "ALL" ? "All time" : timeframe}
            icon={<Wallet className="text-success" size={20} />}
            trend={null}
          />
          <PremiumStatCard
            title="Expenses"
            value={formatUsd(totalExpense)}
            sub={timeframe === "ALL" ? "All time" : timeframe}
            icon={<Wallet2 className="text-danger" size={20} />}
            trend={null}
          />
          <PremiumStatCard
            title="Net Growth"
            value={`${balanceChange.pct >= 0 ? "+" : "-"}${Math.abs(balanceChange.pct).toFixed(1)}%`}
            sub={`over ${timeframe}`}
            icon={<TrendingUpFakeIcon />}
            trend={{ dir: balanceChange.dir === "up" ? "up" : "down", pct: Math.abs(balanceChange.pct) }}
          />
          <PremiumStatCard
            title="Transactions"
            value={`${filtered.length}`}
            sub="Days"
            icon={<ClipboardList className="text-accent" size={20} />}
            trend={null}
          />
        </div>
      </div>

      {/* Insights */}
      <div className="px-6">
        <div className="glass rounded-3xl border border-border/70 p-5 shadow-premium">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-foreground/5 border border-border/40 flex items-center justify-center">
              <Zap className="text-accent" size={20} />
            </div>

            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Insights</p>
              <h3 className="mt-2 text-sm font-bold">{insightsText}</h3>
              <p className="text-muted text-sm mt-2">Hover the curve to inspect daily balance points.</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-3 inline-flex items-center gap-2">
                <CalendarClock size={12} />
                Timeframe: {timeframe}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI overlay layer (fixed) must be last so dashboard layout stays unchanged */}
      <AiButton onClick={() => setOpen(true)} badgeCount={3} />
      <AiDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function TrendingUpFakeIcon() {
  // Keeps premium look without importing more icons; replace if desired.
  return <Zap className="text-success" size={20} />;
}

