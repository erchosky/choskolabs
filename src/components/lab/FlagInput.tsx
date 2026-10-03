"use client";

import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";

type Feedback = { tone: "ok" | "bad" | "info"; message: string } | null;

const MESSAGES: Record<string, Feedback> = {
  format: { tone: "info", message: "Eso no tiene forma de flag. Recuerda: flag{...}." },
  empty: { tone: "info", message: "Escribe la flag que hayas encontrado." },
  incorrect: { tone: "bad", message: "No es la flag de este nivel. Sigue investigando (o abre una pista)." },
  "unknown-lab": { tone: "bad", message: "Nivel no reconocido." },
  "bad-request": { tone: "bad", message: "No se pudo comprobar. Inténtalo de nuevo." },
  network: { tone: "bad", message: "Error de conexión al comprobar la flag." },
};

export function FlagInput({
  labId,
  completed,
  onSolved,
}: {
  labId: string;
  completed: boolean;
  onSolved: () => void;
}) {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (checking) return;
    setChecking(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/flags/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labId, flag: value }),
      });
      const data = (await res.json()) as { status: string; otherLabId?: string };
      if (data.status === "correct") {
        setFeedback({ tone: "ok", message: "¡Correcto!" });
        onSolved();
      } else if (data.status === "other-level") {
        setFeedback({ tone: "info", message: "Esa flag es correcta... pero de otro nivel. ¡Casi!" });
      } else {
        setFeedback(MESSAGES[data.status] ?? MESSAGES.incorrect);
      }
    } catch {
      setFeedback(MESSAGES.network);
    } finally {
      setChecking(false);
    }
  }

  if (completed) {
    return (
      <div className="rounded-xl border border-ok/40 bg-ok-soft p-4">
        <p className="flex items-center gap-2 font-medium text-ink-50">
          <span aria-hidden="true">✓</span> Nivel completado. La explicación está más abajo.
        </p>
      </div>
    );
  }

  const toneClass =
    feedback?.tone === "ok"
      ? "text-ok"
      : feedback?.tone === "bad"
        ? "text-bad"
        : "text-info";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-ink-700 bg-ink-800/60 p-4">
      <label htmlFor="flag" className="text-sm font-medium text-ink-100">
        ¿Has encontrado la flag?
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          id="flag"
          name="flag"
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="flag{...}"
          className="flex-1 rounded-lg border border-ink-600 bg-ink-950 px-3.5 py-2.5 font-mono text-sm text-ink-50 placeholder:text-ink-500 focus:border-accent focus:outline-none"
          aria-describedby={feedback ? "flag-feedback" : undefined}
        />
        <button type="submit" disabled={checking} className={buttonClass("primary")}>
          {checking ? "Comprobando…" : "Comprobar"}
        </button>
      </div>
      {feedback && (
        <p id="flag-feedback" role="status" className={`mt-2 animate-rise text-sm ${toneClass}`}>
          {feedback.message}
        </p>
      )}
    </form>
  );
}
