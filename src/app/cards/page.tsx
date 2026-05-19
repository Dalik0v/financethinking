"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { PremiumCard } from "@/components/shared/PremiumCard";
import type { CardResponse } from "@/components/shared/types";

export default function CardDetails() {
  const [card, setCard] = useState<CardResponse | null>(null);
  const [isHidden, setIsHidden] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await apiFetch<CardResponse>("/card");
        if (!isMounted) return;
        setCard(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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

      <section className="px-6 flex justify-center">
        <div className="relative w-full max-w-[420px]">
          {loading || !card ? (
            <div className="glass rounded-[28px] p-6 shadow-premium/1 animate-pulse">
              <div className="h-44 rounded-[24px] bg-foreground/5" />
            </div>
          ) : (
            <PremiumCard
              balance={card.balance}
              cardNumber={card.cardNumber}
              holder={card.holder}
              isHidden={isHidden}
              onToggleHidden={() => setIsHidden((v) => !v)}
            />
          )}
        </div>
      </section>
    </div>
  );
}

