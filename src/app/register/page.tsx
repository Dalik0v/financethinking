"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, BarChart2, Wallet, Bot, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";

type AuthResponse = { token: string; fullName: string; email: string };

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
      });
      document.cookie = `token=${res.token}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      document.cookie = `username=${encodeURIComponent(res.fullName)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      window.localStorage.setItem("auth_token", res.token);
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^API error \d+: /, "") : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const features = [
    { icon: <BarChart2 size={20} />, title: "Smart Analytics", desc: "AI-powered insights about your spending habits" },
    { icon: <Wallet size={20} />, title: "Budget Tracking", desc: "Set goals and track your financial progress" },
    { icon: <Bot size={20} />, title: "AI Assistant", desc: "Get personalized recommendations" },
    { icon: <ShieldCheck size={20} />, title: "Secure & Private", desc: "Bank-level security to protect your data" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white font-black text-sm">F</div>
          <span className="font-bold text-lg">FinanceThink</span>
        </div>
        <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors">
          ☀
        </button>
      </nav>

      <div className="flex flex-1 items-center justify-center px-6 py-10 gap-16 max-w-6xl mx-auto w-full">
        {/* Left — hero */}
        <div className="flex-1 hidden md:flex flex-col gap-8">
          <div>
            <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Welcome to</p>
            <h1 className="text-5xl font-black leading-tight">
              Finance<span className="text-accent">Think</span>
            </h1>
            <p className="mt-4 text-muted text-lg leading-relaxed max-w-sm">
              Take control of your finances with AI-powered insights, smart analytics, and automated tracking.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold text-sm">{f.title}</p>
                  <p className="text-muted text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="flex items-center gap-2 text-muted text-sm">
            <ShieldCheck size={14} /> Your data is encrypted and secure
          </p>
        </div>

        {/* Right — form */}
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-premium">
          <h2 className="text-2xl font-black mb-1">Create your account</h2>
          <p className="text-muted text-sm mb-7">Start your journey to financial freedom</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Full name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-background border border-border rounded-xl pl-10 pr-11 py-3 text-sm outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-orange text-white font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-semibold hover:underline">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
