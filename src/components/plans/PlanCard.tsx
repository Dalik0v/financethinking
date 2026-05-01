"use client";

import React from "react";
import ProgressBar from "./ProgressBar";

interface Plan {
  id: string;
  title: string;
  goal: number;
  saved: number;
  icon: React.ReactNode;
  color?: string;
}

interface PlanCardProps {
  plan: Plan;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export default function PlanCard({ plan, onClick, onDelete }: PlanCardProps) {
  const progress = Math.min(100, Math.round((plan.saved / plan.goal) * 100));
  const isComplete = progress >= 100;
  const [showConfirm, setShowConfirm] = React.useState(false);

  return (
    <div 
      onClick={onClick}
      className="
        group
        bg-card/80 backdrop-blur-sm
        border border-border/40 
        rounded-3xl 
        p-5 
        cursor-pointer
        transition-all duration-500 ease-out
        hover:bg-card hover:border-border/80
        hover:shadow-[0_8px_30px_-8px_var(--shadow-color)]
        hover:scale-[1.01]
        active:scale-[0.99]
      "
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div className="
            w-11 h-11 rounded-2xl flex items-center justify-center
            bg-primary/10 group-hover:bg-primary/20 
            transition-colors duration-300
            text-primary
          ">
            {plan.icon}
          </div>
          <div>
            <h3 className="
              font-semibold text-lg 
              text-foreground 
              group-hover:text-primary
              transition-colors duration-300
            ">
              {plan.title}
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              ${plan.saved.toLocaleString()} of ${plan.goal.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="
            text-xl font-bold 
            transition-colors duration-300
            ${isComplete ? 'text-success' : 'text-muted-foreground group-hover:text-primary/60'}
          ">
            {progress}%
          </span>
        </div>
      </div>
      
      <ProgressBar progress={progress} size="md" />
      
{/* Completed state */}
      {isComplete ? (
        <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between">
          <span className="text-xs font-medium text-success">
            Completed
          </span>
          {!showConfirm ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onDelete?.(plan.id)}
                className="text-xs text-destructive font-medium"
              >
                Yes
              </button>
              <span className="text-xs text-muted-foreground">/</span>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                No
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
