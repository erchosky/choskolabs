"use client";

import { useState } from "react";
import Link from "next/link";
import { CHAPTERS, LABS, getLabById, isPlayable } from "@/content/curriculum";
import { buttonClass } from "@/components/ui/button";
import { useProgress, resetProgress } from "@/progress/store";
import { computeStatuses } from "@/progress/unlock";
import { getLevel, helpCount } from "@/progress/logic";

export function ProgressDashboard() {
  const { progress, hydrated } = useProgress();
  const [confirming, setConfirming] = useState(false);

  const statuses = computeStatuses(LABS, progress);
  const playable = LABS.filter(isPlayable);
  const completed = playable.filter((l) => statuses[l.id] === "completed").length;
  const pct = playable.length ? Math.round((completed / playable.length) * 100) : 0;

  if (!hydrated) {
    return <p className="text-ink-400" aria-live="polite">Cargando tu progreso…</p>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-ink-700 bg-ink-850/60 p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-ink-400">Niveles completados</p>
            <p className="text-3xl font-bold text-ink-50">
              {completed}
              <span className="text-lg text-ink-400"> / {playable.length}</span>
            </p>
          </div>
          <span className="font-mono text-2xl text-accent">{pct}%</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-700">
          <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {CHAPTERS.flatMap((c) => c.labIds).map((id) => {
          const lab = getLabById(id);
          if (!lab) return null;
          const level = getLevel(progress, id);
          const status = statuses[id];
          const helps = helpCount(level);
          return (
            <div key={id} className="flex items-center gap-4 rounded-lg border border-ink-700 bg-ink-800/50 p-4">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-md text-sm ${
                  status === "completed" ? "bg-ok-soft text-ok" : "bg-ink-700 text-ink-400"
                }`}
              >
                {status === "completed" ? "✓" : lab.kind === "checkpoint" ? "CP" : lab.number}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-100">{lab.title}</p>
                <p className="text-xs text-ink-500">
                  {status === "completed"
                    ? level.completedAt
                      ? `Completado · ${new Date(level.completedAt).toLocaleDateString("es-ES")}`
                      : "Completado"
                    : status === "locked"
                      ? "Bloqueado"
                      : "Sin completar"}
                  {helps > 0 && ` · ${helps} ayuda${helps > 1 ? "s" : ""} abierta${helps > 1 ? "s" : ""}`}
                  {level.solutionViewed && " · solución vista"}
                </p>
              </div>
              {status !== "locked" && (
                <Link href={`/web/${lab.slug}`} className="text-sm text-ink-400 hover:text-ink-100">
                  Ir →
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-bad/30 bg-bad-soft/30 p-5">
        <h2 className="font-medium text-ink-50">Reiniciar progreso</h2>
        <p className="mt-1 text-sm text-ink-300">
          Borra todo tu progreso local (niveles, pistas, post-labs). No se puede deshacer.
        </p>
        {!confirming ? (
          <button type="button" onClick={() => setConfirming(true)} className={`${buttonClass("danger")} mt-3`}>
            Reiniciar progreso
          </button>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                resetProgress();
                setConfirming(false);
              }}
              className={buttonClass("danger")}
            >
              Sí, borrar todo
            </button>
            <button type="button" onClick={() => setConfirming(false)} className={buttonClass("ghost")}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-ink-500">
        Tu progreso se guarda solo en este navegador. Las ayudas que usas son información personal, nunca una
        puntuación.
      </p>
    </div>
  );
}
