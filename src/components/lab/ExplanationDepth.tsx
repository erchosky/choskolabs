"use client";

import { useState } from "react";
import type { Rich } from "@/content/types";
import { Prose } from "@/components/ui/Prose";

type Depth = "simple" | "technical" | "deep";

const TABS: { id: Depth; label: string; hint: string; dot: string }[] = [
  { id: "simple", label: "Entiéndelo", hint: "Explicación cotidiana", dot: "bg-ok" },
  { id: "technical", label: "Entiéndelo técnicamente", hint: "Navegador, HTTP, servidor", dot: "bg-accent" },
  { id: "deep", label: "Profundiza", hint: "Variantes, términos, mitigaciones", dot: "bg-deep" },
];

/** Tres profundidades de explicación. No obliga a leer la parte profunda. */
export function ExplanationDepth({ simple, technical, deep }: { simple: Rich; technical: Rich; deep: Rich }) {
  const [active, setActive] = useState<Depth>("simple");
  const content = { simple, technical, deep }[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Profundidad de la explicación">
        {TABS.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                selected
                  ? "border-ink-500 bg-ink-700 text-ink-50"
                  : "border-ink-700 bg-ink-800/50 text-ink-300 hover:bg-ink-800"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${tab.dot}`} aria-hidden="true" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-ink-500">{TABS.find((t) => t.id === active)?.hint}</p>
      <div className="mt-4 animate-rise" role="tabpanel">
        <Prose content={content} />
      </div>
    </div>
  );
}
