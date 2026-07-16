"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Compte à rebours punitif (anneau SVG). Monter avec `key={questionId}` :
 * chaque question relance un timer neuf. onExpire n'est appelé qu'une fois.
 */
export function Countdown({
  seconds,
  onExpire,
  paused = false,
}: {
  seconds: number;
  onExpire: () => void;
  paused?: boolean;
}) {
  const [left, setLeft] = useState(seconds);
  const expired = useRef(false);

  useEffect(() => {
    if (paused) return;
    const started = Date.now();
    const base = left; // reprend où on en était si dé-pause
    const iv = setInterval(() => {
      const remaining = Math.max(0, base - (Date.now() - started) / 1000);
      setLeft(remaining);
      if (remaining <= 0 && !expired.current) {
        expired.current = true;
        clearInterval(iv);
        onExpire();
      }
    }, 100);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  const ratio = left / seconds;
  const critical = left <= 10;
  const R = 20;
  const C = 2 * Math.PI * R;

  return (
    <div
      className={`flex items-center gap-2 ${critical ? "animate-pulse" : ""}`}
      role="timer"
      aria-label={`${Math.ceil(left)} secondes restantes`}
    >
      <svg width="52" height="52" viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r={R} fill="none" stroke="var(--border)" strokeWidth="5" />
        <circle
          cx="26"
          cy="26"
          r={R}
          fill="none"
          stroke={critical ? "var(--destructive)" : "var(--electra-orange)"}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ratio)}
          transform="rotate(-90 26 26)"
        />
        <text
          x="26"
          y="31"
          textAnchor="middle"
          className="fill-current font-mono text-[15px] font-bold"
        >
          {Math.ceil(left)}
        </text>
      </svg>
      <span
        className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${
          critical ? "text-destructive" : "text-[var(--electra-orange)]"
        }`}
      >
        Question piégée
        <br />
        par Albert
      </span>
    </div>
  );
}
