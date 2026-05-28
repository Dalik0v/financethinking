"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Target, PiggyBank, Briefcase, Car, Home, Plane, GraduationCap, Heart, Laptop, Gift, TrendingUp } from "lucide-react";
import AiTipCard from "@/components/plans/AiTipCard";
import PlanCard from "@/components/plans/PlanCard";
import FloatingAddButton from "@/components/plans/FloatingAddButton";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface GoalDto {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  category: string;
  deadline?: string;
  createdAt: string;
  progressPercent: number;
}

interface Plan {
  id: string;
  title: string;
  goal: number;
  saved: number;
  icon: React.ReactNode;
  color: string;
  category?: string;
  deadline?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Car: <Car size={20} />,
  Home: <Home size={20} />,
  Travel: <Plane size={20} />,
  Education: <GraduationCap size={20} />,
  Health: <Heart size={20} />,
  Tech: <Laptop size={20} />,
  Gift: <Gift size={20} />,
  Other: <Target size={20} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Car: "text-blue-400",
  Home: "text-green-400",
  Travel: "text-purple-400",
  Education: "text-yellow-400",
  Health: "text-red-400",
  Tech: "text-gray-400",
  Gift: "text-pink-400",
  Other: "text-primary",
};

function goalToplan(g: GoalDto): Plan {
  return {
    id: g.id,
    title: g.name,
    goal: g.targetAmount,
    saved: g.savedAmount,
    icon: CATEGORY_ICONS[g.category] ?? <Target size={20} />,
    color: CATEGORY_COLORS[g.category] ?? "text-primary",
    category: g.category,
    deadline: g.deadline,
  };
}

export default function Plans() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [savingsAmount, setSavingsAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = useCallback(async () => {
    try {
      const goals = await apiFetch<GoalDto[]>("/goals");
      setPlans(goals.map(goalToplan));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load goals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleAddSavings = async () => {
    const amount = parseFloat(savingsAmount);
    if (isNaN(amount) || amount <= 0 || !selectedPlanId) return;

    setIsDepositing(true);
    try {
      const updated = await apiFetch<GoalDto>(`/goals/${selectedPlanId}/deposit`, {
        method: "PATCH",
        body: JSON.stringify({ amount }),
      });
      setPlans(prev => prev.map(p => p.id === selectedPlanId ? goalToplan(updated) : p));
      setSelectedPlanId(null);
      setSavingsAmount("");
    } catch (e: any) {
      setError(e?.message ?? "Failed to deposit");
    } finally {
      setIsDepositing(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      await apiFetch(`/goals/${id}`, { method: "DELETE" });
      setPlans(prev => prev.filter(p => p.id !== id));
      setSelectedPlanId(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete goal");
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="pt-16 px-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Plans</h1>
          <p className="text-muted text-sm font-medium">Save for your future goals</p>
        </div>
        <FloatingAddButton onClick={() => router.push("/create-goal")} />
      </header>

      <AiTipCard
        tip="You can reach your Emergency Fund goal 2 months faster if you save $50 more weekly."
        highlight="Emergency Fund"
        onAction={() => {}}
      />

      <div className="px-6 grid gap-4">
        {loading && (
          <p className="text-muted text-sm text-center py-8">Loading goals...</p>
        )}
        {!loading && plans.length === 0 && (
          <p className="text-muted text-sm text-center py-8">No goals yet. Tap + to create one!</p>
        )}
        {plans.map((plan, index) => (
          <PlanCard
            key={`plan-${plan.id}-${index}`}
            plan={plan}
            onClick={() => setSelectedPlanId(plan.id)}
            onDelete={handleDeleteGoal}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-sm text-center px-6">{error}</p>
      )}

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
              disabled={isDepositing}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-accent-glow active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isDepositing ? "Saving..." : "Confirm Deposit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
