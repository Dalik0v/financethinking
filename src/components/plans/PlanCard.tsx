"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

interface Plan {
  id: string;
  title: string;
  goal: number;
  saved: number;
  icon: React.ReactNode;
  color: string;
  category?: string;
  deadline?: string;
  deleting?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export default function PlanCard({ plan, onClick, onDelete }: PlanCardProps) {
  const progress = Math.min((plan.saved / plan.goal) * 100, 100);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleting = isDeleting || plan.deleting;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleting) return;
    setIsDeleting(true);
    await onDelete(plan.id);
  };

  if (deleting) {
    return (
      <div className="bg-card border border-border rounded-3xl p-5 opacity-50 flex items-center justify-center h-24">
        <p className="text-sm text-muted">Deleting... Refresh the page</p>
      </div>
    );
  }

  return (
    <div
      className="bg-card border border-border rounded-3xl p-5 cursor-pointer active:scale-[0.98] transition-all"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl bg-foreground/5 flex items-center justify-center ${plan.color}`}>
            {plan.icon}
          </div>
          <div>
            <p className="font-bold text-sm">{plan.title}</p>
            {plan.deadline && (
              <p className="text-xs text-muted">Due {new Date(plan.deadline).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={!!deleting}
          className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          <Trash2 size={14} className="text-red-400" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted">${plan.saved.toLocaleString()} saved</span>
          <span className="font-bold">${plan.goal.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted text-right">{progress.toFixed(0)}%</p>
      </div>
    </div>
  );
}
