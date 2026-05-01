"use client";

import React, { useState } from "react";
import { ArrowLeft, Target, Calendar, Sparkles, Car, Home, Plane, GraduationCap, Heart, Laptop, Gift, Plus, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { id: "car", name: "Car", icon: <Car size={20} />, color: "bg-blue-500" },
  { id: "home", name: "Home", icon: <Home size={20} />, color: "bg-green-500" },
  { id: "travel", name: "Travel", icon: <Plane size={20} />, color: "bg-purple-500" },
  { id: "education", name: "Education", icon: <GraduationCap size={20} />, color: "bg-yellow-500" },
  { id: "health", name: "Health", icon: <Heart size={20} />, color: "bg-red-500" },
  { id: "tech", name: "Tech", icon: <Laptop size={20} />, color: "bg-gray-500" },
  { id: "gift", name: "Gift", icon: <Gift size={20} />, color: "bg-pink-500" },
  { id: "other", name: "Other", icon: <Plus size={20} />, color: "bg-accent" },
];

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  deadline: string;
  category: string;
  saved: number;
}

export default function CreateGoal() {
  const router = useRouter();
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGoal = () => {
    // Validate: name and amount required
    if (!goalName.trim() || !targetAmount || !selectedCategory) return;
    
    // If "other" selected, require custom category name
    if (selectedCategory === "other" && !customCategory.trim()) return;
    
    setIsCreating(true);
    
    // Determine final category name
    const finalCategory = selectedCategory === "other" 
      ? customCategory 
      : CATEGORIES.find(c => c.id === selectedCategory)?.name || "Other";
    
    // Create goal object
    const newGoal: Goal = {
      id: Date.now().toString(),
      name: goalName.trim(),
      targetAmount: parseFloat(targetAmount),
      deadline,
      category: finalCategory,
      saved: 0,
    };
    
    // Save to localStorage
    const existingGoals = JSON.parse(localStorage.getItem("goals") || "[]");
    localStorage.setItem("goals", JSON.stringify([...existingGoals, newGoal]));
    
    // Redirect after short delay
    setTimeout(() => {
      router.push("/plans");
    }, 500);
  };

  const isFormValid = goalName.trim() && targetAmount && selectedCategory && 
    !(selectedCategory === "other" && !customCategory.trim());

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="pt-16 px-6 flex items-center gap-4 shrink-0">
        <Link href="/">
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Create Goal</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-6 space-y-6 pb-32">
        {/* Goal Name */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Goal Name</label>
          <div className="relative">
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
            <input 
              type="text" 
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g., New Car, Vacation, Emergency Fund"
              className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent transition-all font-medium"
            />
          </div>
        </div>

        {/* Target Amount */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Target Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted">$</span>
            <input 
              type="number" 
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent transition-all text-3xl font-black"
            />
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Deadline</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5 z-10" />
            <input 
              type="date" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent transition-all font-medium [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Category / Icon */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Category</label>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${
                  selectedCategory === cat.id 
                    ? 'border-accent bg-accent/10' 
                    : 'border-border bg-card hover:border-muted'
                }`}
              >
                <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-white`}>
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Category Input (show when "other" selected) */}
        {selectedCategory === "other" && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <label className="text-xs font-bold text-muted uppercase tracking-[2px]">Custom Category Name</label>
            <div className="relative">
              <input 
                type="text" 
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g., Wedding, Startup, New Phone"
                className="w-full bg-card border border-border rounded-2xl py-4 px-4 outline-none focus:border-accent transition-all font-medium"
              />
            </div>
          </div>
        )}

        {/* AI Suggestion */}
        <div className="bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center shrink-0">
            <Sparkles size={24} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">AI Tip</p>
            <p className="text-xs text-muted">Set a realistic deadline based on your saving ability</p>
          </div>
        </div>
      </main>

      {/* Create Button */}
      <div className="p-6 pb-8 absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border">
        <button 
          onClick={handleCreateGoal}
          disabled={!isFormValid || isCreating}
          className="w-full bg-accent disabled:opacity-50 disabled:cursor-not-allowed text-white py-5 rounded-3xl font-black text-lg shadow-accent-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Create Goal
              <Target size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
