"use client";

import React, { useState } from "react";
import { Plus, Target, PiggyBank, Briefcase, X, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface Plan {
  id: string;
  title: string;
  goal: number;
  saved: number;
  icon: React.ReactNode;
  color: string;
}

const INITIAL_PLANS: Plan[] = [
  { id: "1", title: "New Car", goal: 45000, saved: 12400, icon: <Briefcase size={20} />, color: "text-blue-400" },
  { id: "2", title: "Emergency Fund", goal: 10000, saved: 8200, icon: <PiggyBank size={20} />, color: "text-green-400" },
  { id: "3", title: "Vacation", goal: 5000, saved: 1200, icon: <Target size={20} />, color: "text-accent" },
];

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [savingsAmount, setSavingsAmount] = useState("");

  const handleAddSavings = () => {
    const amount = parseFloat(savingsAmount);
    if (isNaN(amount) || amount <= 0 || !selectedPlanId) return;

    setPlans(plans.map(p => 
      p.id === selectedPlanId ? { ...p, saved: Math.min(p.goal, p.saved + amount) } : p
    ));
    setSelectedPlanId(null);
    setSavingsAmount("");
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="pt-16 px-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Plans</h1>
          <p className="text-muted text-sm font-medium">Save for your future goals</p>
        </div>
        <button 
          onClick={() => setIsAddPlanOpen(true)}
          className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center shadow-accent-glow active:scale-90 transition-all hover:rotate-90"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* AI Recommendation Box */}
      <section className="px-6">
        <div className="bg-gradient-to-r from-accent/20 to-accent-orange/20 border border-accent/20 p-5 rounded-3xl relative overflow-hidden group">
          <div className="relative z-10 flex gap-4 items-center">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent animate-pulse">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">AI Savings Tip</h3>
              <p className="text-xs text-muted leading-relaxed max-w-[200px]">
                You can reach your <span className="text-accent font-bold">Emergency Fund</span> goal 2 months faster if you save $50 more weekly.
              </p>
            </div>
            <button 
              onClick={() => setSelectedPlanId("2")}
              className="ml-auto w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all hover:bg-accent-orange"
            >
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>
      </section>

      <div className="px-6 grid gap-4">
        {plans.map((plan) => (
          <PlanCard 
            key={plan.id}
            plan={plan}
            onClick={() => setSelectedPlanId(plan.id)}
          />
        ))}
      </div>

      {/* Add Savings Modal */}
      {selectedPlanId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPlanId(null)} />
          <div className="bg-card border border-border w-full max-w-sm rounded-3xl p-8 relative shadow-premium animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-6">Add Savings</h2>
            <div className="relative mb-8">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted">$</span>
              <input 
                type="number"
                value={savingsAmount}
                onChange={(e) => setSavingsAmount(e.target.value)}
                placeholder="0.00"
                autoFocus
                className="w-full bg-foreground/5 border border-border rounded-2xl py-6 pl-12 pr-6 text-3xl font-black focus:border-accent outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleAddSavings}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold shadow-accent-glow active:scale-[0.98] transition-all"
            >
              Confirm Deposit
            </button>
          </div>
        </div>
      )}

      {/* Add Plan Placeholder Modal */}
      {isAddPlanOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddPlanOpen(false)} />
          <div className="bg-card border border-border w-full max-w-sm rounded-3xl p-8 relative shadow-premium text-center">
            <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">New Savings Plan</h2>
            <p className="text-muted text-sm mb-8">Define your goal and start saving today!</p>
            <button 
              onClick={() => setIsAddPlanOpen(false)}
              className="w-full bg-accent text-white py-4 rounded-2xl font-bold transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanCard({ plan, onClick }: { plan: Plan, onClick: () => void }) {
  const progress = Math.round((plan.saved / plan.goal) * 100);
  
  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border p-6 rounded-3xl space-y-6 shadow-premium active:scale-[0.98] transition-all cursor-pointer group hover:border-muted"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center ${plan.color}`}>
            {plan.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{plan.title}</h3>
            <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
              ${plan.saved.toLocaleString()} of ${plan.goal.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-foreground/20 group-hover:text-accent/40 transition-colors">{progress}%</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/50">
          <div 
            className="h-full bg-accent rounded-full shadow-accent-glow transition-all duration-700" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
