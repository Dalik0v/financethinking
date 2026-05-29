"use client";

import React, { useState } from "react";
import {
  User,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Check,
  Palette,
  Camera,
  Eye,
  EyeOff,
  X
} from "lucide-react";
import Link from "next/link";
import ThemeSelector from "@/components/shared/ThemeSelector";
import { apiFetch } from "@/lib/api";

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export default function Settings() {
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const cachedName = typeof document !== "undefined"
    ? document.cookie.match(/(?:^|;\s*)username=([^;]+)/)?.[1] ?? ""
    : "";
  const [displayName, setDisplayName] = useState(cachedName || "...");
  const [initials, setInitials] = useState(cachedName ? getInitials(cachedName) : "..");
  const [isSaving, setIsSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [profileError, setProfileError] = useState("");

  const handleSaveProfile = async () => {
    setProfileError("");

    if (!displayName.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) { setProfileError("Enter your current password."); return; }
      if (newPassword.length < 6) { setProfileError("New password must be at least 6 characters."); return; }
      if (newPassword !== confirmPassword) { setProfileError("Passwords do not match."); return; }
    }

    setIsSaving(true);
    try {
      if (currentPassword && newPassword) {
        await apiFetch("/auth/password", {
          method: "PATCH",
          body: JSON.stringify({ currentPassword, newPassword }),
        });
      }

      setInitials(getInitials(displayName));
      document.cookie = `username=${encodeURIComponent(displayName.trim())}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      setIsEditingProfile(false);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2000);
    } catch (e: unknown) {
      setProfileError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setIsSaving(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-32">
      <header className="pt-16 px-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted text-sm font-medium">Manage your profile and preferences</p>
      </header>

      <section className="px-6">
        <div className="bg-card border border-border p-6 rounded-[32px] flex items-center justify-between shadow-premium group">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div suppressHydrationWarning className="w-16 h-16 bg-gradient-to-tr from-accent to-accent-orange rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-accent-glow group-hover:rotate-6 transition-transform">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success border-4 border-card rounded-full" />
            </div>
            <div>
              <h2 suppressHydrationWarning className="font-bold text-lg">{displayName}</h2>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-accent" />
                <span className="text-[10px] text-accent font-black uppercase tracking-widest">Premium Member</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditingProfile(true)}
            className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            Edit
          </button>
        </div>
      </section>

      <div className="px-6 space-y-8">
        <SettingsGroup title="Account">
          <div onClick={() => setIsEditingProfile(true)}>
            <SettingsItem icon={<User size={20} />} label="Personal Information" />
          </div>
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

        <SettingsGroup title="Account Actions">
          <button onClick={() => setIsLoggingOut(true)} className="w-full">
            <SettingsItem icon={<LogOut size={20} />} label="Log Out" color="text-accent" hideArrow />
          </button>
        </SettingsGroup>
      </div>

      <div className="px-6 text-center">
        <p className="text-[10px] text-muted font-bold uppercase tracking-[4px]">Version 1.0.0 (2026)</p>
      </div>

      {isEditingProfile && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditingProfile(false)} />
          <div className="bg-card border border-border w-full max-w-sm rounded-[40px] p-8 relative shadow-premium animate-in slide-in-from-bottom-10 duration-300 z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Personal Information</h2>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-9 h-9 bg-foreground/5 hover:bg-foreground/10 rounded-xl flex items-center justify-center transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex justify-center mb-8">
              <div className="relative">
                <div suppressHydrationWarning className="w-20 h-20 bg-gradient-to-tr from-accent to-accent-orange rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-accent-glow">
                  {initials}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-xl flex items-center justify-center shadow-accent-glow">
                  <Camera size={14} className="text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-muted uppercase tracking-[2px] ml-1 mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-foreground/5 border border-border rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-accent transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div className="border-t border-border/50 pt-4">
                <p className="text-[10px] font-black text-muted uppercase tracking-[2px] ml-1 mb-4">
                  Change Password
                </p>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full bg-foreground/5 border border-border rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-accent transition-colors pr-12"
                      placeholder="Current password"
                    />
                    <button
                      onClick={() => setShowCurrentPw(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    >
                      {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full bg-foreground/5 border border-border rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-accent transition-colors pr-12"
                      placeholder="New password"
                    />
                    <button
                      onClick={() => setShowNewPw(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    >
                      {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPw ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-foreground/5 border border-border rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-accent transition-colors pr-12"
                      placeholder="Confirm new password"
                    />
                    <button
                      onClick={() => setShowConfirmPw(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    >
                      {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {profileError && (
                <p className="text-xs text-red-400 font-bold ml-1">{profileError}</p>
              )}

              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="w-full py-4 bg-accent text-white rounded-2xl font-bold shadow-accent-glow hover:opacity-90 transition-all active:scale-95 mt-2 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSavedToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-10 duration-300">
          <div className="bg-success text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm">
            <Check size={18} />
            Settings Updated
          </div>
        </div>
      )}

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
              <button
                onClick={() => {
                  document.cookie = "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                  document.cookie = "username=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                  window.localStorage.removeItem("auth_token");
                  window.location.href = "/login";
                }}
                className="flex-1 py-4 bg-accent text-white rounded-2xl font-bold shadow-accent-glow"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
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
  hideArrow = false,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
  color?: string;
  hideArrow?: boolean;
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
          <div className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 ${toggleValue ?? true ? "bg-accent" : "bg-muted/30"}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${toggleValue ?? true ? "translate-x-5" : "translate-x-0"}`} />
          </div>
        ) : !hideArrow && (
          <ChevronRight size={18} className="text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </div>
  );
}