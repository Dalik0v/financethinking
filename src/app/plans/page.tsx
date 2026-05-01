"use client";

import React, { useState } from "react";
import { Target, PiggyBank, Briefcase, TrendingUp } from "lucide-react";
import AiTipCard from "@/components/plans/AiTipCard";
import PlanCard from "@/components/plans/PlanCard";
import FloatingAddButton from "@/components/plans/FloatingAddButton";

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
  { id: "3", title: "Vacation", goal: 5000, saved: 1200, icon: <Target size={20} />, color: "text-primary" },
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

  const handleAction = () => {
    // Navigate to the Emergency Fund plan
    setSelectedPlanId("2");
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="pt-16 px-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Plans</h1>
          <p className="text-muted text-sm font-medium">Save for your future goals</p>
        </div>
        <FloatingAddButton onClick={() => setIsAddPlanOpen(true)} />
      </header>

      {/* Collapsible AI Tip - Default Collapsed */}
      <AiTipCard 
        tip="You can reach your Emergency Fund goal 2 months faster if you save $50 more weekly."
        highlight="Emergency Fund"
        onAction={handleAction}
      />

      {/* Plans List */}
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
                className="w-full bg-foreground/5 border border-border rounded-2xl py-6 pl-12 pr-6 text-3xl font-black focus:border-primary outline-none transition-all"
              />
            </div>
            <button 
              onClick={handleAddSavings}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-accent-glow active:scale-[0.98] transition-all"
            >
              Confirm Deposit
            </button>
          </div>
        </div>
      )}

      {/* Add New Plan Modal */}
      {isAddPlanOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddPlanOpen(false)} />
          <div className="bg-card border border-border w-full max-w-sm rounded-3xl p-8 relative shadow-premium text-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">New Savings Plan</h2>
            <p className="text-muted text-sm mb-8">Define your goal and start saving today!</p>
            <button 
              onClick={() => setIsAddPlanOpen(false)}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
