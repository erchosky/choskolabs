"use client";

import { useState } from "react";

const PAGES: Record<string, string> = {
  "1": "🍎 Manzanas — 1,20 €/kg",
  "2": "🍌 Plátanos — 1,80 €/kg",
  "3": "🍇 Uvas — 2,50 €/kg",
};

/** Minijuego 2: cambia el número de la URL y observa cómo cambia el recurso. */
export function UrlStep({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  const [id, setId] = useState("1");
  const [visited, setVisited] = useState<Set<string>>(new Set(["1"]));

  function go(next: string) {
    setId(next);
    const updated = new Set(visited).add(next);
    setVisited(updated);
    if (updated.size >= 2) onComplete();
  }

  return (
    <div>
      <div className="flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 font-mono text-sm">
        <span className="text-ink-500">tienda.test/producto/</span>
        <input
          aria-label="Número de producto en la URL"
          value={id}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
            if (v && PAGES[v]) go(v);
            else setId(v);
          }}
          className="w-10 rounded border border-ink-600 bg-ink-800 px-1 py-0.5 text-center text-accent-strong focus:border-accent focus:outline-none"
        />
      </div>
      <div className="mt-3 rounded-lg border border-ink-700 bg-ink-800/60 p-4 text-center">
        <p className="text-lg text-ink-50">{PAGES[id] ?? "🤔 No existe ningún producto con ese número."}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {Object.keys(PAGES).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => go(key)}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              id === key ? "border-accent bg-accent-soft text-accent" : "border-ink-600 text-ink-200 hover:bg-ink-800"
            }`}
          >
            producto/{key}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-400">
        {done
          ? "Lo has visto: cambiar el número te lleva a otro producto. Ese número lo controlas tú."
          : "Prueba a cambiar el número (escríbelo o usa los botones) para ver otros productos."}
      </p>
    </div>
  );
}
