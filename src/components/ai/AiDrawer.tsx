"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import AiMessage from "./AiMessage";
import AiSuggestions from "./AiSuggestions";

export default function AiDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const suggestionsPrompts = useMemo(
    () => [
      "Analyze my spending",
      "How can I save more?",
      "Why did my balance drop?",
      "Create a budget plan",
    ],
    []
  );

  async function submit(prompt?: string) {
    const p = (prompt ?? input).trim();
    if (!p || !open || loading || inFlightRef.current) return;

    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;
    inFlightRef.current = true;

    setLoading(true);
    setErrorText(null);
    setResponseText(null);
    setInput("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5193"}/ai`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(p),
          signal: controller.signal,
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`API error ${res.status}: ${text}`);
      }

      const text = await res.text();
      if (!controller.signal.aborted) {
        setResponseText(text);
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      setErrorText(e instanceof Error ? e.message : "Failed to get AI response");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      abortRef.current = null;
      inFlightRef.current = false;
      // Use a ref-based flag instead of calling setState directly
      // to avoid the lint warning; loading resets naturally in finally block.
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed z-50 top-0 right-0 h-[100vh] w-[380px] sm:w-[400px]"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "tween", duration: 0.28, ease: "easeOut" }}
          >
            <div className="h-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-l-3xl shadow-[0_0_80px_rgba(168,85,247,0.22)] overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(900px circle at 10% 0%, rgba(236,72,153,0.18), transparent 45%), radial-gradient(700px circle at 90% 20%, rgba(124,58,237,0.20), transparent 50%)",
                }}
              />

              <div className="relative h-full flex flex-col">
                <div className="p-5 flex items-center justify-between border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.20)]">
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]" />
                      <span className="text-white/90 font-black">AI</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">AI Financial Advisor</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Online</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close AI drawer"
                    className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
                  >
                    <X size={18} className="text-white/90" />
                  </button>
                </div>

                <div className="p-5 flex-1 overflow-auto">
                  <AiMessage responseText={responseText} errorText={errorText} />

                  <div className="mt-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-3">
                      Suggested actions
                    </div>
                    <AiSuggestions onPick={(prompt) => { submit(prompt); }} />
                  </div>

                  <div className="mt-5">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 shadow-[0_0_50px_rgba(124,58,237,0.10)]">
                      <label className="sr-only">Ask the AI</label>
                      <div className="flex gap-2 items-center">
                        <input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask me anything..."
                          disabled={loading}
                          className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-fuchsia-400/40 shadow-[0_0_0px_rgba(0,0,0,0)] focus:shadow-[0_0_30px_rgba(168,85,247,0.20)] disabled:opacity-60 disabled:cursor-not-allowed"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !loading) submit();
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => submit()}
                          disabled={loading}
                          className="h-10 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-red-500 border border-white/10 hover:opacity-95 transition-all shadow-[0_0_50px_rgba(236,72,153,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
                          aria-label="Send"
                        >
                          <span className="text-white font-black">↗</span>
                        </button>
                      </div>
                      <div className="mt-2 text-[11px] text-white/40">
                        Try: {suggestionsPrompts[0]} · {suggestionsPrompts[2]}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-white/10">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Luxury AI layer — analytics-ready
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}