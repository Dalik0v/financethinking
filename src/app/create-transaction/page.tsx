"use client";

import React, { useState } from "react";
import {
  ArrowLeft, PenLine, Calendar, Car, Home, Plane,
  GraduationCap, Heart, Laptop, Gift, Plus, Utensils,
  TrendingUp, TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const CATEGORIES = [
  { id: "Food",      name: "Food",      icon: <Utensils size={20} />,      color: "bg-orange-600" },
  { id: "Car",       name: "Car",       icon: <Car size={20} />,           color: "bg-blue-500" },
  { id: "Home",      name: "Home",      icon: <Home size={20} />,          color: "bg-green-500" },
  { id: "Travel",    name: "Travel",    icon: <Plane size={20} />,         color: "bg-purple-500" },
  { id: "Health",    name: "Health",    icon: <Heart size={20} />,         color: "bg-red-500" },
  { id: "Tech",      name: "Tech",      icon: <Laptop size={20} />,        color: "bg-gray-500" },
  { id: "Gift",      name: "Gift",      icon: <Gift size={20} />,          color: "bg-pink-500" },
  { id: "Other",     name: "Other",     icon: <Plus size={20} />,          color: "bg-accent" },
];

type TxType = 0 | 1;

export default function CreateTransaction() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [txType, setTxType] = useState<TxType>(1);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = description.trim() && amount && parseFloat(amount) > 0 && selectedCategory;

  const handleCreate = async () => {
    if (!isValid) return;
    setIsSaving(true);
    setError(null);
    try {
      await apiFetch("/transactions", {
        method: "POST",
        body: JSON.stringify({
          description: description.trim(),
          amount: parseFloat(amount),
          type: txType,
          category: selectedCategory,
          date: new Date(date).toISOString(),
        }),
      });
      window.dispatchEvent(new CustomEvent("transaction:created"));
      router.push("/");
    } catch (e: any) {
      setError(e?.message ?? "Failed to create transaction");
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="pt-16 px-6 flex items-center gap-4 shrink-0">
        <Link href="/">
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Create Transaction</h1>
      </header>

      <main className="flex-1 px-6 pt-6 space-y-6 pb-6">
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Transaction Name</label>
          <div className="relative">
            <PenLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Coffee, Salary, Rent..."
              className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent transition-all font-medium" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted">$</span>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00" min="0" step="0.01"
              className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent transition-all text-3xl font-black" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setTxType(0)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all active:scale-95 ${txType === 0 ? "border-green-500 bg-green-500/10 text-green-400" : "border-border bg-card text-muted hover:border-muted"}`}>
              <TrendingUp size={24} />
              <span className="text-sm font-bold">Income</span>
            </button>
            <button onClick={() => setTxType(1)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all active:scale-95 ${txType === 1 ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted hover:border-muted"}`}>
              <TrendingDown size={24} />
              <span className="text-sm font-bold">Expense</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5 z-10" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent transition-all font-medium [color-scheme:dark]" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Category</label>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${selectedCategory === cat.id ? "border-accent bg-accent/10" : "border-border bg-card hover:border-muted"}`}>
                <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white`}>{cat.icon}</div>
                <span className="text-[10px] font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

        <button onClick={handleCreate} disabled={!isValid || isSaving}
          className="w-full bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 rounded-3xl font-black text-lg shadow-accent-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          {isSaving ? (
            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
          ) : (
            <>Create Transaction <TrendingDown size={20} /></>
          )}
        </button>
      </main>
    </div>
  );
}