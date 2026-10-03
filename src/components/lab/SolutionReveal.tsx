"use client";

import { useState } from "react";
import type { Rich } from "@/content/types";
import { Prose } from "@/components/ui/Prose";

/** "Ver solución": último recurso. Requiere una confirmación para no revelarla por accidente. */
export function SolutionReveal({
  solution,
  viewed,
  onReveal,
}: {
  solution: Rich;
  viewed: boolean;
  onReveal: () => void;
}) {
  const [open, setOpen] = useState(viewed);

  if (!open) {
    return (
      <details
        className="rounded-lg border border-ink-700 bg-ink-850/60"
        onToggle={(e) => {
          if ((e.currentTarget as HTMLDetailsElement).open) {
            setOpen(true);
            onReveal();
          }
        }}
      >
        <summary className="cursor-pointer list-none px-4 py-3 text-sm text-ink-300 hover:text-ink-100">
          <span className="font-medium">Ver solución completa</span>
          <span className="ml-2 text-ink-500">— último recurso, sin penalización</span>
        </summary>
      </details>
    );
  }

  return (
    <div className="animate-rise rounded-lg border border-deep/30 bg-deep-soft/40 p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-deep">Solución completa</h3>
      <Prose content={solution} />
    </div>
  );
}
