"use client";

import React, { useState } from "react";
import { 
  User, 
  CreditCard, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Check,
  Palette
} from "lucide-react";
import Link from "next/link";
import ThemeSelector from "@/components/shared/ThemeSelector";

export default function Settings() {
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleThemeChange = () => {
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="pt-16 px-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted text-sm font-medium">Manage your profile and preferences</p>
      </header>

      {/* Profile Section */}
      <section className="px-6">
        <div className="bg-card border border-border p-6 rounded-[32px] flex items-center justify-between shadow-premium group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-tr from-accent to-accent-orange rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-accent-glow group-hover:rotate-6 transition-transform">
                JD
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success border-4 border-card rounded-full" />
            </div>
            <div>
              <h2 className="font-bold text-lg">John Doe</h2>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-accent" />
                <span className="text-[10px] text-accent font-black uppercase tracking-widest">Premium Member</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => {
              setShowSavedToast(true);
              setTimeout(() => setShowSavedToast(false), 2000);
            }}
            className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Edit
          </button>
        </div>
      </section>

      {/* Settings Groups */}
      <div className="px-6 space-y-8">
        <SettingsGroup title="Account">
          <SettingsItem icon={<User size={20} />} label="Personal Information" />
          <Link href="/plans">
            <SettingsItem icon={<CreditCard size={20} />} label="Linked Banks & Cards" badge="3" />
          </Link>
        </SettingsGroup>

        <SettingsGroup title="Preferences">
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-foreground/5 rounded-xl flex items-center justify-center text-foreground">
                <Palette size={20} />
              </div>
              <span className="font-bold text-sm">Theme</span>
            </div>
            <ThemeSelector />
          </div>
        </SettingsGroup>

        <SettingsGroup title="Support">
          <SettingsItem icon={<HelpCircle size={20} />} label="Help Center" />
          <button onClick={() => setIsLoggingOut(true)} className="w-full">
            <SettingsItem icon={<LogOut size={20} />} label="Log Out" color="text-accent" hideArrow />
          </button>
        </SettingsGroup>
      </div>

      <div className="px-6 text-center">
        <p className="text-[10px] text-muted font-bold uppercase tracking-[4px]">Version 2.4.0 (2024)</p>
      </div>

      {/* Success Toast */}
      {showSavedToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-300">
          <div className="bg-success text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm">
            <Check size={18} />
            Settings Updated
          </div>
        </div>
      )}

      {/* Logout Dialog */}
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLoggingOut(false)} />
          <div className="bg-card border border-border w-full max-w-sm rounded-[40px] p-8 relative shadow-premium text-center animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <LogOut size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Wait, really?</h2>
            <p className="text-muted text-sm mb-8">Are you sure you want to log out from your account?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsLoggingOut(false)}
                className="flex-1 py-4 bg-foreground/5 rounded-2xl font-bold transition-all hover:bg-foreground/10"
              >
                Cancel
              </button>
              <Link href="/" className="flex-1">
                <button className="w-full py-4 bg-accent text-white rounded-2xl font-bold shadow-accent-glow">
                  Log Out
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[10px] font-black text-muted uppercase tracking-[2px] ml-2">{title}</h3>
      <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-premium">
        {children}
      </div>
    </div>
  );
}

function SettingsItem({ 
  icon, 
  label, 
  badge, 
  hasToggle, 
  toggleValue, 
  onToggle, 
  color = "text-foreground",
  hideArrow = false
}: { 
  icon: React.ReactNode, 
  label: string, 
  badge?: string, 
  hasToggle?: boolean, 
  toggleValue?: boolean, 
  onToggle?: () => void,
  color?: string,
  hideArrow?: boolean
}) {
  return (
    <div 
      onClick={onToggle}
      className="flex items-center justify-between p-5 hover:bg-foreground/5 transition-all cursor-pointer border-b border-border/50 last:border-0 group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 bg-foreground/5 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <span className={`font-bold text-sm ${color}`}>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className="bg-accent text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-accent-glow">
            {badge}
          </span>
        )}
        {hasToggle ? (
          <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${toggleValue ?? true ? 'bg-accent' : 'bg-muted/30'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${toggleValue ?? true ? 'translate-x-5' : 'translate-x-0'}`} />
          </div>
        ) : !hideArrow && (
          <ChevronRight size={18} className="text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </div>
  );
}