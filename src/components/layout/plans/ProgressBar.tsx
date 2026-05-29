"use client";

import React, { useEffect, useState, useRef } from "react";

interface ProgressBarProps {
  progress: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function ProgressBar({ progress, size = "md", showLabel = false }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const heights = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Animate from 0 to target progress
      const duration = 1200;
      const startTime = Date.now();
      const startWidth = 0;
      const targetWidth = Math.min(progress, 100);
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        
        // Ease out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progressRatio, 3);
        const currentWidth = startWidth + (targetWidth - startWidth) * easeOut;
        
        setWidth(currentWidth);
        
        if (progressRatio < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [progress, isVisible]);

  return (
    <div className="space-y-2 w-full">
      <div className={`w-full bg-foreground/5 rounded-full overflow-hidden border border-border/30 ${heights[size]}`}>
        <div 
          ref={progressRef}
          className="
            h-full rounded-full
            bg-primary
            transition-all duration-300
          "
          style={{ 
            width: `${width}%`,
          }}
        >
          {/* Animated shine effect */}
          <div className="w-full h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>
      {showLabel && (
        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground font-medium">{Math.round(width)}%</span>
        </div>
      )}
    </div>
  );
}
