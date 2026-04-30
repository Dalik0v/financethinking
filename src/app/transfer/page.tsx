"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Send, CheckCircle2, User } from "lucide-react";
import Link from "next/link";

const CONTACTS = [
  { id: "1", name: "Alex Johnson", initial: "AJ", color: "bg-blue-500" },
  { id: "2", name: "Maria Garcia", initial: "MG", color: "bg-purple-500" },
  { id: "3", name: "David Chen", initial: "DC", color: "bg-orange-500" },
  { id: "4", name: "Sarah Miller", initial: "SM", color: "bg-pink-500" },
];

export default function Transfer() {
  const [step, setStep] = useState(1); // 1: Select Contact, 2: Amount, 3: Success
  const [selectedContact, setSelectedContact] = useState<typeof CONTACTS[0] | null>(null);
  const [amount, setAmount] = useState("");

  const handleNext = () => {
    if (step === 1 && selectedContact) setStep(2);
    else if (step === 2 && amount) setStep(3);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <header className="pt-16 px-6 flex items-center gap-4">
        <Link href="/">
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Send Money</h1>
      </header>

      <main className="flex-1 px-6 pt-8 overflow-y-auto">
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-10 duration-300">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
              <input 
                type="text" 
                placeholder="Name, email or phone"
                className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent transition-all font-medium"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-muted uppercase tracking-[2px]">Recent Contacts</h3>
              <div className="grid gap-3">
                {CONTACTS.map((contact) => (
                  <button 
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      setStep(2);
                    }}
                    className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between hover:border-accent transition-all active:scale-95 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${contact.color} rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:rotate-6 transition-transform`}>
                        {contact.initial}
                      </div>
                      <span className="font-bold">{contact.name}</span>
                    </div>
                    <ArrowLeft className="w-5 h-5 rotate-180 text-muted group-hover:text-accent transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && selectedContact && (
          <div className="flex flex-col items-center justify-center pt-12 space-y-10 animate-in zoom-in duration-300">
            <div className="text-center space-y-4">
              <div className={`w-24 h-24 ${selectedContact.color} rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl mx-auto border-4 border-card`}>
                {selectedContact.initial}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedContact.name}</h2>
                <p className="text-muted text-sm font-medium">@alex_j_pay</p>
              </div>
            </div>

            <div className="relative w-full max-w-[240px]">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-5xl font-bold text-muted opacity-30">$</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                placeholder="0.00"
                className="w-full bg-transparent text-center text-6xl font-black outline-none placeholder:text-muted/20"
              />
            </div>

            <div className="w-full space-y-4">
              <div className="bg-card border border-border p-4 rounded-2xl flex justify-between items-center">
                <span className="text-muted text-sm font-bold">From</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-accent rounded-[2px]" />
                  <span className="font-bold text-sm">Salary Account (•• 4281)</span>
                </div>
              </div>
              <button 
                onClick={handleNext}
                disabled={!amount}
                className="w-full bg-accent disabled:opacity-50 text-white py-5 rounded-3xl font-black text-lg shadow-accent-glow active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Send Money <Send size={20} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedContact && (
          <div className="flex flex-col items-center justify-center pt-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mb-8 animate-bounce">
              <CheckCircle2 size={64} />
            </div>
            <h2 className="text-3xl font-black mb-2">Success!</h2>
            <p className="text-muted font-medium mb-12">
              You've successfully sent <span className="text-foreground font-bold">${amount}</span> to <br />
              <span className="text-foreground font-bold">{selectedContact.name}</span>
            </p>
            
            <Link href="/" className="w-full">
              <button className="w-full bg-foreground text-background py-5 rounded-3xl font-black text-lg active:scale-95 transition-all">
                Back to Home
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
