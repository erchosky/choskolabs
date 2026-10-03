"use client";

import Link from "next/link";
import type { LabDefinition } from "@/content/types";
import { LABS, getLabById } from "@/content/curriculum";
import { buttonClass } from "@/components/ui/button";
import { useProgress } from "@/progress/store";
import { isUnlocked } from "@/progress/unlock";

/**
 * Guard de desbloqueo del lado cliente. El progreso vive en el navegador,
 * así que el bloqueo se aplica aquí (no en el servidor). No es una barrera de
 * seguridad: es guía pedagógica para seguir el orden del curso.
 */
export function LockGate({ lab, children }: { lab: LabDefinition; children: React.ReactNode }) {
  const { progress, hydrated } = useProgress();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center text-ink-400" aria-live="polite">
        Cargando…
      </div>
    );
  }

  if (isUnlocked(LABS, progress, lab)) {
    return <>{children}</>;
  }

  const missing = lab.unlockRequires
    .map((id) => getLabById(id))
    .filter((l): l is LabDefinition => Boolean(l));

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink-800 text-2xl">🔒</span>
      <h1 className="mt-4 text-2xl font-bold text-ink-50">Nivel bloqueado</h1>
      <p className="mt-2 text-ink-300">
        Para mantener el orden del curso, primero completa
        {missing.length === 1 ? " el nivel anterior" : " los niveles anteriores"}:
      </p>
      <ul className="mt-4 space-y-2">
        {missing.map((l) => (
          <li key={l.id}>
            <Link
              href={`/web/${l.slug}`}
              className="block rounded-lg border border-ink-700 bg-ink-800/60 px-4 py-3 text-ink-100 hover:border-accent/40"
            >
              {l.kind === "checkpoint" ? "Checkpoint" : `Level ${l.number}`} — {l.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/web" className={`${buttonClass("ghost")} mt-6`}>
        ← Volver al mapa
      </Link>
    </div>
  );
}
