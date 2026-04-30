"use client";

import React from "react";
import { ArrowLeft, Bell, BellOff } from "lucide-react";
import Link from "next/link";

export default function Notifications() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <header className="pt-16 px-6 flex items-center gap-4">
        <Link href="/">
          <button className="w-10 h-10 bg-card rounded-full flex items-center justify-center border border-border active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
      </header>

      <div className="px-6 space-y-4">
        <NotificationItem 
          title="Security Alert" 
          desc="New login from Chrome on Mac OS" 
          time="2m ago" 
          urgent 
        />
        <NotificationItem 
          title="Payment Received" 
          desc="You received $500.00 from John Doe" 
          time="1h ago" 
        />
        <NotificationItem 
          title="Weekly Summary" 
          desc="Your spending is down by 12% this week" 
          time="Yesterday" 
        />
      </div>

      <div className="flex flex-col items-center justify-center py-20 opacity-20">
        <BellOff size={48} />
        <p className="mt-4 font-medium">No more notifications</p>
      </div>
    </div>
  );
}

function NotificationItem({ title, desc, time, urgent = false }: { title: string, desc: string, time: string, urgent?: boolean }) {
  return (
    <div className="bg-card border border-border p-4 rounded-2xl flex gap-4 items-start shadow-premium">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${urgent ? 'bg-accent/10 text-accent' : 'bg-foreground/5 text-muted'}`}>
        <Bell size={20} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-sm">{title}</h3>
          <span className="text-[10px] text-muted font-medium">{time}</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
