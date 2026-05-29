"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { TransactionItem } from "@/components/shared/TransactionItem";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { apiFetch as apiFetchFn } from "@/lib/api";

type TransactionType = 0 | 1;

type TransactionResponseDto = {
  id: number;
  amount: number;
  type: TransactionType;
  category: string;
  description?: string | null;
  date: string;
};

type TransactionsApiResponse = {
  currentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalCount: number;
  recentTransactions: TransactionResponseDto[];
};

type Props = {
  apiFetch?: typeof apiFetchFn;
};

function formatAmount(amount: number, isIncome: boolean) {
  const abs = Math.abs(amount);
  const sign = isIncome ? "+" : "-";
  return `${sign}$${abs.toFixed(2)}`;
}

export default function RecentActivity({ apiFetch = apiFetchFn }: Props) {
  const [items, setItems] = useState<TransactionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      setError(null);

      const data = await apiFetch<TransactionsApiResponse>(
        "/transactions?take=4&page=1",
        { signal }
      );

      const recentTransactions = data?.recentTransactions;
      if (!Array.isArray(recentTransactions)) {
        throw new Error("Invalid transactions response");
      }

      setItems(recentTransactions);
    } catch (e: unknown) {
      if (signal?.aborted) return;
      setError(e instanceof Error ? e.message : "Failed to load transactions");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const refresh = async () => {
      if (!mounted) return;
      await load(controller.signal);
    };

    refresh();

    window.addEventListener("transaction:created", refresh);

    return () => {
      mounted = false;
      controller.abort();
      window.removeEventListener("transaction:created", refresh);
    };
  }, [load]);

  const ui = useMemo(() => {
    return items.map((t) => {
      const isIncome = t.type === 0;
      const title = t.description?.trim() ? t.description.trim() : t.category || "Transaction";
      const amountText = formatAmount(t.amount, isIncome);
      return { id: t.id, title, category: t.category, amountText, isIncome };
    });
  }, [items]);

  if (loading) return <div className="text-sm text-zinc-400">Loading transactions...</div>;
  if (error) return <div className="text-sm text-red-400">{error}</div>;
  if (ui.length === 0) return <div className="text-sm text-zinc-400">No transactions yet</div>;

  return (
    <div className="space-y-3">
      {ui.map((tx) => (
        <Link key={tx.id} href="/transactions" className="block">
          <TransactionItem
            title={tx.title}
            category={tx.category}
            amount={tx.amountText}
            isIncome={tx.isIncome}
            icon={
              tx.isIncome ? (
                <ArrowDownRight className="w-5 h-5 rotate-180" />
              ) : (
                <ArrowUpRight className="w-5 h-5" />
              )
            }
          />
        </Link>
      ))}
    </div>
  );
}