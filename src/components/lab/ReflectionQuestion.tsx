"use client";

import { useState } from "react";
import type { ReflectionQuestion as RQ } from "@/content/types";

export function ReflectionQuestion({
  question,
  savedAnswer,
  onAnswer,
}: {
  question: RQ;
  savedAnswer?: string;
  onAnswer: (optionId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(savedAnswer ?? null);
  const answered = selected !== null;

  return (
    <div className="rounded-xl border border-ink-700 bg-ink-800/50 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Micro-pregunta</h3>
      <p className="mt-2 font-medium text-ink-50">{question.question}</p>
      <ul className="mt-4 space-y-2">
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          const isCorrect = option.id === question.correctId;
          const state =
            !answered
              ? "border-ink-600 hover:border-ink-500 hover:bg-ink-800"
              : isCorrect
                ? "border-ok/50 bg-ok-soft"
                : isSelected
                  ? "border-bad/50 bg-bad-soft"
                  : "border-ink-700 opacity-60";
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={answered}
                onClick={() => {
                  setSelected(option.id);
                  onAnswer(option.id);
                }}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${state}`}
              >
                <span className="font-mono text-xs text-ink-400">{option.id.toUpperCase()}</span>
                <span className="text-ink-100">{option.text}</span>
                {answered && isCorrect && <span className="ml-auto text-ok">✓</span>}
                {answered && isSelected && !isCorrect && <span className="ml-auto text-bad">✗</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <p className="mt-4 animate-rise rounded-lg bg-ink-800 px-4 py-3 text-sm text-ink-200">
          {selected === question.correctId ? "Correcto. " : "No exactamente. "}
          {question.explanation}
        </p>
      )}
    </div>
  );
}
