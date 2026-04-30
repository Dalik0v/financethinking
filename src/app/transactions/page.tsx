"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Filter, Download, ArrowUpRight, ArrowDownRight, Coffee, ShoppingBag, Utensils, Home, Zap } from "lucide-react";
import Link from "next/link";

const TRANSACTIONS = [
  { id: 1, title: "Apple Store", category: "Electronics", amount: -1299.00, date: "Today", icon: <ShoppingBag className="text-accent" /> },
  { id: 2, title: "Monthly Salary", category: "Work", amount: 5500.00, date: "Today", icon: <Zap className="text-success" />, isIncome: true },
  { id: 3, title: "Starbucks", category: "Coffee", amount: -12.50, date: "Yesterday", icon: <Coffee className="text-orange-400" /> },
  { id: 4, title: "Netflix", category: "Entertainment", amount: -15.99, date: "Yesterday", icon: <Zap className="text-purple-400" /> },
  { id: 5, title: "Rent Payment", category: "Housing", amount: -2100.00, date: "2 days ago", icon: <Home className="text-blue-400" /> },
  { id: 6, title: "Whole Foods", category: "Grocery", amount: -145.20, date: "3 days ago", icon: <Utensils className="text-green-400" /> },
];

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filteredTransactions = TRANSACTIONS.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || (activeTab === "Income" && t.isIncome) || (activeTab === "Outcome" && !t.isIncome);
    return matchesSearch && matchesTab;
  });

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
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? "bg-foreground text-background" : "text-muted hover:text-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        <div className="space-y-6">
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="bg-card border border-border p-4 rounded-3xl flex items-center justify-between shadow-premium hover:border-muted transition-all cursor-pointer active:scale-[0.98] group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {tx.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{tx.title}</h4>
                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-black ${tx.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                  </span>
                  <div className="flex items-center justify-end gap-1 mt-1 opacity-40">
                    {tx.amount > 0 ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                    <span className="text-[8px] font-bold uppercase">USD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
