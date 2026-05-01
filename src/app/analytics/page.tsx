"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  MoreHorizontal, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  MessageSquare,
  X,
  Send,
  PieChart,
  ShoppingBag,
  Utensils,
  Car
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import Link from "next/link";

const DATA_PERIODS: Record<string, any[]> = {
  Week: [
    { name: "Mon", total: 400 }, { name: "Tue", total: 700 }, { name: "Wed", total: 500 },
    { name: "Thu", total: 1200 }, { name: "Fri", total: 900 }, { name: "Sat", total: 1500 }, { name: "Sun", total: 1100 },
  ],
  Month: [
    { name: "W1", total: 2400 }, { name: "W2", total: 3200 }, { name: "W3", total: 1800 }, { name: "W4", total: 4500 },
  ],
  Year: [
    { name: "Jan", total: 12000 }, { name: "Feb", total: 15000 }, { name: "Mar", total: 9000 }, { name: "Apr", total: 18000 },
  ],
};

const CATEGORIES = [
  { name: "Shopping", amount: "$1,240", icon: <ShoppingBag size={18} />, color: "bg-accent", progress: 65 },
  { name: "Food", amount: "$850", icon: <Utensils size={18} />, color: "bg-orange-500", progress: 40 },
  { name: "Transport", amount: "$420", icon: <Car size={18} />, color: "bg-blue-500", progress: 25 },
];

export default function Analytics() {
  const [period, setPeriod] = useState("Week");
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "Hello! I'm your AI Financial Assistant. How can I help you today?" }
  ]);
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    const newMessages = [...chatMessages, { role: "user", text: userInput }];
    setChatMessages(newMessages);
    setUserInput("");

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: "ai", 
        text: "Based on your spending in the last 7 days, you've spent 15% more on Coffee than usual. Would you like me to set a budget limit?" 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* Header */}
      <header className="pt-16 px-6 flex items-center justify-between">
        <Link href="/">
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Analytics</h1>
        <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </header>

      {/* Period Selector */}
      <div className="px-6">
        <div className="bg-card p-1 rounded-2xl flex gap-1 border border-border shadow-premium">
          {["Week", "Month", "Year"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${period === p ? "bg-accent text-white shadow-accent-glow" : "text-muted hover:text-foreground"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats */}
      <div className="px-6 flex justify-between items-end">
        <div className="space-y-2">
          <p className="text-muted text-sm font-medium tracking-wide uppercase">Total Spent</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-5xl font-bold tracking-tight">$5,050<span className="text-muted text-3xl">.50</span></h2>
            <div className="bg-success/10 text-success px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
              <TrendingUp size={14} className="rotate-180" />
              12%
            </div>
          </div>
        </div>
        <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center animate-bounce">
          <PieChart size={24} />
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-72 w-full px-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA_PERIODS[period]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#737373", fontSize: 10, fontWeight: 600 }} 
              dy={15}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ backgroundColor: "#161616", borderColor: "#262626", borderRadius: "16px", color: "#fff", fontSize: "12px", fontWeight: "bold" }}
              itemStyle={{ color: "#FF4D4D" }}
              cursor={{ stroke: '#262626', strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="total" 
              stroke="#FF4D4D" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorTotal)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Categories Breakdown */}
      <section className="px-6 space-y-4">
        <h3 className="text-xs font-bold text-muted uppercase tracking-[2px]">Top Categories</h3>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="bg-card border border-border p-4 rounded-2xl space-y-3 shadow-premium">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${cat.color} bg-opacity-20 rounded-xl flex items-center justify-center`} style={{ color: "inherit" }}>
                    {cat.icon}
                  </div>
                  <span className="font-bold">{cat.name}</span>
                </div>
                <span className="font-bold">{cat.amount}</span>
              </div>
              <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

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

      {/* AI Chat  */}
      {isAIChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAIChatOpen(false)} />
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
                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Online & Analyzing</span>
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
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-accent text-white rounded-tr-none' 
                      : 'bg-foreground/5 text-foreground rounded-tl-none border border-border'
                  }`}>
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
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
