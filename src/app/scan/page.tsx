"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Zap, Scan as ScanIcon, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";

export default function Scan() {
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
      {/* Camera View  */}
      <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
        {!isScanning && (
          <div className="bg-card border border-border p-8 rounded-3xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center">
              <Zap size={32} />
            </div>
            <h2 className="text-xl font-bold">QR Code Detected</h2>
            <p className="text-sm text-muted mb-4 text-center">Pay $15.50 to "Starbucks Coffee"</p>
            <Link href="/transfer">
              <button className="bg-accent text-white px-8 py-3 rounded-2xl font-bold shadow-accent-glow active:scale-95 transition-all">
                Proceed to Pay
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Scanning Animation */}
      {isScanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-accent/50 rounded-[40px] relative overflow-hidden">
            <div className="absolute inset-0 border-t-4 border-accent shadow-[0_-10px_30px_rgba(255,77,77,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <ScanIcon size={120} />
            </div>
          </div>
          <p className="absolute bottom-40 text-sm font-bold tracking-[4px] uppercase text-accent animate-pulse">
            Scanning QR Code...
          </p>
        </div>
      )}

      {/* Controls */}
      <header className="absolute top-16 left-0 right-0 px-6 flex justify-between items-center z-10">
        <Link href="/">
          <button className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </Link>
        <div className="flex gap-4">
          <button className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <Zap className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
            <ImageIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      <footer className="absolute bottom-12 left-0 right-0 flex justify-center z-10">
        <div className="bg-black/50 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
          <p className="text-xs font-medium opacity-80">Align QR code within the frame</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(256px); }
        }
      `}</style>
    </div>
  );
}
