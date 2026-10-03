"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/button";

/** Minijuego 1: pulsa un botón y mira viajar la petición y la respuesta. */
export function RequestReplayStep({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  const [phase, setPhase] = useState<"idle" | "request" | "response">("idle");

  function play() {
    setPhase("request");
    window.setTimeout(() => setPhase("response"), 950);
    window.setTimeout(() => {
      setPhase("idle");
      onComplete();
    }, 2000);
  }

  return (
    <div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="rounded-lg border border-ink-600 bg-ink-800 p-3 text-center">
          <div className="text-2xl" aria-hidden="true">💻</div>
          <p className="mt-1 text-xs text-ink-300">Tu navegador</p>
        </div>
        <div className="relative h-16 w-full min-w-16">
          <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-ink-600" />
          {phase === "request" && (
            <span className="animate-travel absolute top-1/2 -translate-y-1/2 rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] text-ink-950">
              GET
            </span>
          )}
          {phase === "response" && (
            <span className="animate-travel-back absolute top-1/2 -translate-y-1/2 rounded bg-ok px-1.5 py-0.5 font-mono text-[10px] text-ink-950">
              200 OK
            </span>
          )}
        </div>
        <div className="rounded-lg border border-ink-600 bg-ink-800 p-3 text-center">
          <div className="text-2xl" aria-hidden="true">🖥️</div>
          <p className="mt-1 text-xs text-ink-300">Servidor</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-ink-700 bg-ink-950 p-3 font-mono text-xs text-ink-300">
        <p>
          <span className="text-accent">GET</span> /api/hola
        </p>
        <p className={phase === "response" || done ? "text-ok" : "text-ink-600"}>
          → 200 OK · {"{"} &quot;mensaje&quot;: &quot;¡Hola! Soy el servidor.&quot; {"}"}
        </p>
      </div>

      <button type="button" onClick={play} disabled={phase !== "idle"} className={`${buttonClass("secondary")} mt-4`}>
        {done ? "Enviar otra petición" : "Enviar petición"}
      </button>
    </div>
  );
}
