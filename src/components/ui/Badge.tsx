import type { ReactNode } from "react";

const TONES = {
  neutral: "border-ink-600 bg-ink-800 text-ink-200",
  accent: "border-accent/40 bg-accent-soft text-accent",
  ok: "border-ok/40 bg-ok-soft text-ok",
  info: "border-info/40 bg-info-soft text-info",
  deep: "border-deep/40 bg-deep-soft text-deep",
} as const;

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: keyof typeof TONES }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
