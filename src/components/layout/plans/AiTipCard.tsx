"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, X, ArrowRight, ChevronDown } from "lucide-react";

interface AiTipCardProps {
  tip: string;
  highlight?: string;
  onAction?: () => void;
}

export default function AiTipCard({ tip, highlight = "Emergency Fund", onAction }: AiTipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded]);

  if (isHidden) return null;

  return (
    <section className="px-6">
      <div 
        className={`
          relative overflow-hidden rounded-3xl 
          bg-card/60 backdrop-blur-xl 
          border border-border/50 
          transition-all duration-500 ease-out
          ${isExpanded ? 'shadow-premium' : 'hover:border-border'}
        `}
        style={{
          maxHeight: isExpanded ? `${height + 80}px` : '80px',
        }}
      >
        {/* Content */}
        <div className="relative z-10">
          {/* Header - Always visible */}
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-4 p-5 cursor-pointer"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground">AI Savings Tip</h3>
              <p className="text-xs text-muted-foreground truncate">
                {isExpanded ? 'Tap to collapse' : 'Tap to see your tip'}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsHidden(true);
              }}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors"
            >
              <X size={16} />
            </button>
            <div className={`w-8 h-8 flex items-center justify-center text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronDown size={18} />
            </div>
          </div>

          {/* Expandable content */}
          <div 
            ref={contentRef}
            className={`
              transition-all duration-500 ease-out
              ${isExpanded ? 'opacity-100 pb-5 px-5' : 'opacity-0 absolute -top-full pointer-events-none'}
            `}
          >
            <p className="text-sm text-muted-foreground leading-relaxed px-5 -mt-2 mb-4">
              {tip.includes(highlight) ? (
                <>
                  You can reach your <span className="text-primary font-semibold">{highlight}</span> goal 
                  {tip.replace(/.*?target /, '').replace(highlight, '')}
                </>
              ) : (
                tip
              )}
            </p>
            {onAction && (
              <div className="px-5">
                <button 
                  onClick={onAction}
                  className="
                    w-full py-3 px-4 
                    bg-primary/10 hover:bg-primary/20 
                    text-primary font-semibold text-sm
                    rounded-xl 
                    flex items-center justify-center gap-2
                    transition-all duration-300
                  "
                >
                  Take Action
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
