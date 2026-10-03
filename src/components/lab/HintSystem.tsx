"use client";

import { useState } from "react";
import type { Hint, Rich } from "@/content/types";
import { Prose } from "@/components/ui/Prose";
import type { HelpStep } from "@/progress/types";

interface HintSystemProps {
  hints: [Hint, Hint, Hint];
  lost: Rich;
  openedSteps: HelpStep[];
  onOpen: (step: HelpStep) => void;
  /** Checkpoints: hasta que el jugador confirma que lo ha intentado, no hay pistas. */
  gated?: boolean;
  onConfirmAttempt?: () => void;
}

const HINT_STEPS: HelpStep[] = ["hint-1", "hint-2", "hint-3"];

function Disclosure({
  label,
  tone,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  tone: "hint" | "lost";
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const accent = tone === "lost" ? "border-deep/40" : "border-ink-600";
  return (
    <div className={`overflow-hidden rounded-lg border ${isOpen ? accent : "border-ink-700"} bg-ink-800/50`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-ink-100 hover:bg-ink-800"
      >
        <span className={tone === "lost" ? "text-deep" : ""}>{label}</span>
        <span className={`text-ink-400 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <div className="animate-rise border-t border-ink-700 px-4 py-3.5">
          <Prose content={children as never} />
        </div>
      )}
    </div>
  );
}

export function HintSystem({ hints, lost, openedSteps, onOpen, gated, onConfirmAttempt }: HintSystemProps) {
  const [expanded, setExpanded] = useState<HelpStep | null>(null);

  if (gated) {
    return (
      <div className="rounded-lg border border-ink-700 bg-ink-800/50 p-5 text-center">
        <p className="text-sm text-ink-300">
          Este es un checkpoint: primero inténtalo por tu cuenta. Si te atascas de verdad, puedes desbloquear las
          pistas.
        </p>
        <button
          type="button"
          onClick={onConfirmAttempt}
          className="mt-3 rounded-lg border border-ink-600 bg-ink-800 px-4 py-2 text-sm text-ink-100 hover:border-ink-500 hover:bg-ink-700"
        >
          Ya lo he intentado, muéstrame las pistas
        </button>
      </div>
    );
  }

  function toggle(step: HelpStep, content: () => void) {
    const willOpen = expanded !== step;
    setExpanded(willOpen ? step : null);
    if (willOpen && !openedSteps.includes(step)) content();
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-400">¿Atascado?</h3>
      {hints.map((hint, i) => {
        const step = HINT_STEPS[i];
        return (
          <Disclosure
            key={step}
            label={hint.label}
            tone="hint"
            isOpen={expanded === step}
            onToggle={() => toggle(step, () => onOpen(step))}
          >
            {hint.body as never}
          </Disclosure>
        );
      })}
      <Disclosure
        label="Estoy totalmente perdido"
        tone="lost"
        isOpen={expanded === "lost"}
        onToggle={() => toggle("lost", () => onOpen("lost"))}
      >
        {lost as never}
      </Disclosure>
    </div>
  );
}
