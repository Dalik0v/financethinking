"use client";

import React from "react";

export default function AiMessage({
  responseText,
  errorText,
}: {
  responseText?: string | null;
  errorText?: string | null;
}) {
  const hasResponse = !!responseText && responseText.trim().length > 0;
  const hasError = !!errorText && errorText.trim().length > 0;

  return (
    <div className="px-1">
      <p className="text-sm text-white/90 leading-relaxed">
        Hi! I’m your AI financial advisor.
      </p>
      <p className="text-sm text-white/70 mt-1 leading-relaxed">
        How can I help you today?
      </p>

      {hasResponse && (
        <p className="text-sm text-white/85 mt-3 leading-relaxed whitespace-pre-wrap">
          {responseText}
        </p>
      )}

      {hasError && (
        <p className="text-sm text-red-300 mt-3 leading-relaxed whitespace-pre-wrap">
          {errorText}
        </p>
      )}
    </div>
  );
}


