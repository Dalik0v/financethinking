"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

export default function RecentActivity({
  apiFetch = apiFetchFn,
}: Props) {
  const [items, setItems] = useState<TransactionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const inFlightRef = useRef(false);

  async function load(signal?: AbortSignal) {
    if (inFlightRef.current) return;

    inFlightRef.current = true;

    try {
      setError(null);

      const data = await apiFetch<TransactionsApiResponse>(
        "/transactions?take=4&page=1",
        {
          signal,
        }
      );

      console.log("LIVE API RESPONSE", data);

      const recentTransactions = data?.recentTransactions;
      if (!Array.isArray(recentTransactions)) {
        throw new Error("Invalid transactions response");
      }

      setItems(recentTransactions);


    } catch (e) {
      if (signal?.aborted) return;

      const message =
        e instanceof Error
          ? e.message
          : "Failed to load transactions";

      console.error("RecentActivity error:", e);

      setError(message);
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    const controller = new AbortController();

    const start = async () => {
      if (!mounted) return;

      await load(controller.signal);
    };

    start();

    const interval = window.setInterval(() => {
      if (!mounted || inFlightRef.current) return;

      const intervalController = new AbortController();

      load(intervalController.signal);
    }, 5000);

    return () => {
      mounted = false;

      controller.abort();

      window.clearInterval(interval);
    };
  }, [apiFetch]);

  const ui = useMemo(() => {
    return items.map((t) => {
      const isIncome = t.type === 0;

      const title = t.description?.trim()

        ? t.description.trim()
        : t.category || "Transaction";

      const amountText = formatAmount(t.amount, isIncome);

      return {
        id: t.id,
        title,
        category: t.category,
        amountText,
        isIncome,
      };
    });
  }, [items]);

  if (loading) {
    return (
      <div className="text-sm text-zinc-400">
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (ui.length === 0) {
    return (
      <div className="text-sm text-zinc-400">
        No transactions yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ui.map((tx) => (
        <Link
          key={tx.id}
          href="/transactions"
          className="block"
        >
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