"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

interface TransactionItemProps {
  title: string;
  category: string;
  amount: string;
  isIncome?: boolean;
  icon?: React.ReactNode;
}

export function TransactionItem({ title, category, amount, isIncome = false, icon }: TransactionItemProps) {
  return (
    <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer hover:bg-card/80">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isIncome ? 'bg-success/10 text-success' : 'bg-foreground/5 text-muted'}`}>
          {icon || <ArrowUpRight className={`w-5 h-5 ${isIncome ? 'rotate-180' : 'text-accent'}`} />}
        </div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted font-medium">{category}</p>
        </div>
      </div>
      <p className={`font-bold text-lg ${isIncome ? 'text-success' : 'text-foreground'}`}>
        {amount}
      </p>
    </div>
  );
}
