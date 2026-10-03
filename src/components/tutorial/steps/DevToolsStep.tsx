"use client";

import { useState } from "react";

type Tab = "elements" | "network";

/** Minijuego 4: explora un DevTools simulado (Elements y Network). */
export function DevToolsStep({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  const [tab, setTab] = useState<Tab>("elements");
  const [seen, setSeen] = useState<Set<Tab>>(new Set(["elements"]));

  function open(next: Tab) {
    setTab(next);
    const updated = new Set(seen).add(next);
    setSeen(updated);
    if (updated.size >= 2) onComplete();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink-600 bg-ink-950">
      <div className="flex border-b border-ink-700 bg-ink-850 text-xs">
        {(["elements", "network"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => open(t)}
            className={`px-4 py-2 font-medium ${tab === t ? "bg-ink-800 text-accent" : "text-ink-400 hover:text-ink-100"}`}
          >
            {t === "elements" ? "Elements" : "Network"}
          </button>
        ))}
      </div>
      <div className="p-3 font-mono text-xs leading-relaxed">
        {tab === "elements" ? (
          <pre className="text-ink-300">{`<div class="pedido">
  <span>Pedido #1842</span>
  `}<span className="text-ink-500">{`<!-- oculto para el cliente -->`}</span>{`
  `}<span className="rounded bg-accent-soft px-1 text-accent-strong">{`<a hidden href="/staff">Panel</a>`}</span>{`
</div>`}</pre>
        ) : (
          <div className="space-y-1 text-ink-300">
            <p className="text-ink-500">Petición · Estado · Tipo</p>
            <p>GET /pedido/1842 · <span className="text-ok">200</span> · document</p>
            <p className="rounded bg-info-soft px-1 text-info">GET /api/tickets/431 · 200 · fetch/xhr ← ¡una API!</p>
            <p>GET /estilos.css · <span className="text-ok">200</span> · stylesheet</p>
          </div>
        )}
      </div>
      <p className="border-t border-ink-700 px-3 py-2 text-[11px] text-ink-400">
        {done
          ? "Has visto las dos pestañas clave: Elements (el HTML) y Network (las peticiones)."
          : "Abre las dos pestañas: en Elements verás HTML oculto; en Network, una petición a una API."}
      </p>
    </div>
  );
}
