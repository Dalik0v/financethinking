"use client";

interface AiTipCardProps {
  tip: string;
  highlight?: string;
  onAction?: () => void;
}

export default function AiTipCard({ tip, highlight, onAction }: AiTipCardProps) {
  return (
    <div className="mx-6 rounded-3xl bg-gradient-to-br from-fuchsia-500/10 via-purple-500/10 to-pink-500/10 border border-fuchsia-500/20 p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-fuchsia-500/20 flex items-center justify-center shrink-0">
          <span className="text-fuchsia-400 font-black text-sm">AI</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/80 leading-relaxed">
            {highlight ? (
              <>
                {tip.split(highlight)[0]}
                <span className="text-fuchsia-400 font-semibold">{highlight}</span>
                {tip.split(highlight)[1]}
              </>
            ) : tip}
          </p>
          {onAction && (
            <button
              onClick={onAction}
              className="mt-3 text-xs font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors"
            >
              Learn more →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}