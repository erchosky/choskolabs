"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { LabDefinition, PlayableLabDefinition } from "@/content/types";
import { DIFFICULTY_LABEL } from "@/content/types";
import { Prose } from "@/components/ui/Prose";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/button";
import type { HelpStep } from "@/progress/types";
import { useProgress } from "@/progress/store";
import {
  confirmAttempt,
  getLevel,
  markCompleted,
  markHelpOpened,
  markLabOpened,
  markPostLabCompleted,
  markSolutionViewed,
  setLastPosition,
  setReflectionAnswer,
} from "@/progress/logic";
import { FlagInput } from "./FlagInput";
import { HintSystem } from "./HintSystem";
import { SolutionReveal } from "./SolutionReveal";
import { PostLab } from "./PostLab";

export function LabExperience({ lab, nextLab }: { lab: PlayableLabDefinition; nextLab: LabDefinition | null }) {
  const { progress, hydrated, update } = useProgress();
  const level = getLevel(progress, lab.id);
  const completed = Boolean(level.completedAt);
  const postLabRef = useRef<HTMLDivElement>(null);
  const [justSolved, setJustSolved] = useState(false);

  useEffect(() => {
    update((s) => setLastPosition(s, lab.slug));
  }, [lab.slug, update]);

  useEffect(() => {
    if (justSolved && postLabRef.current) {
      postLabRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [justSolved]);

  const openedSteps: HelpStep[] = level.helpOpened ?? [];
  const gateHints = Boolean(lab.hintsRequireAttempt) && !level.attemptConfirmed && !completed;

  function handleOpenLab() {
    update((s) => markLabOpened(s, lab.id));
  }
  function handleSolved() {
    update((s) => markCompleted(s, lab.id));
    setJustSolved(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/web" className="text-sm text-ink-400 hover:text-ink-200">
        ← Web Wargame
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-accent">
            {lab.kind === "checkpoint" ? "CHECKPOINT" : `LEVEL ${`0${lab.number}`.slice(-2)}`}
          </span>
          <Badge>{DIFFICULTY_LABEL[lab.difficulty]}</Badge>
          <Badge>{lab.estimatedMinutes} min</Badge>
          {completed && <Badge tone="ok">Completado</Badge>}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-50">{lab.title}</h1>
        <p className="mt-1 text-ink-300">{lab.subtitle}</p>
      </header>

      {lab.bestOnDesktop && (
        <p className="mt-5 rounded-lg border border-info/30 bg-info-soft px-4 py-2.5 text-sm text-ink-200">
          Este nivel se disfruta mejor en <strong className="text-ink-50">escritorio</strong>: usarás las
          herramientas de desarrollo del navegador (DevTools).
        </p>
      )}

      <section className="mt-6 rounded-xl border border-ink-700 bg-ink-850/60 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-400">Escenario · {lab.labBrand}</h2>
        <div className="mt-3">
          <Prose content={lab.scenario} />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-accent/30 bg-accent-soft/40 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Tu misión</h2>
        <div className="mt-3">
          <Prose content={lab.mission} />
        </div>
        <a
          href={lab.labUrl}
          target="_blank"
          rel="noreferrer"
          onClick={handleOpenLab}
          className={`${buttonClass("primary", "lg")} mt-4`}
        >
          Abrir laboratorio ↗
        </a>
        <p className="mt-2 text-xs text-ink-400">
          Se abre en una pestaña nueva (el entorno ficticio de {lab.labBrand}). Vuelve aquí para introducir la flag.
        </p>
      </section>

      <div className="mt-6">
        <FlagInput labId={lab.id} completed={completed} onSolved={handleSolved} />
      </div>

      {!completed && (
        <div className="mt-6 space-y-4">
          <HintSystem
            hints={lab.hints}
            lost={lab.lost}
            openedSteps={openedSteps}
            gated={gateHints}
            onConfirmAttempt={() => update((s) => confirmAttempt(s, lab.id))}
            onOpen={(step) => update((s) => markHelpOpened(s, lab.id, step))}
          />
          {!gateHints && (
            <SolutionReveal
              solution={lab.solution}
              viewed={Boolean(level.solutionViewed)}
              onReveal={() => update((s) => markSolutionViewed(s, lab.id))}
            />
          )}
        </div>
      )}

      {completed && (
        <div ref={postLabRef} className="mt-10 scroll-mt-20">
          <PostLab
            lab={lab}
            nextLab={nextLab}
            reflectionAnswer={level.reflectionAnswer}
            onReflectionAnswer={(id) => update((s) => setReflectionAnswer(s, lab.id, id))}
            onReachEnd={() => update((s) => markPostLabCompleted(s, lab.id))}
          />
        </div>
      )}

      {hydrated && !completed && openedSteps.length > 0 && (
        <p className="mt-6 text-center text-xs text-ink-500">
          Ayudas abiertas: {openedSteps.length}. Recuerda: usar pistas forma parte del aprendizaje, no es hacer
          trampas.
        </p>
      )}
    </div>
  );
}
