"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import type { LabDefinition } from "@/content/types";
import { useProgress } from "@/progress/store";
import { getLevel, markCompleted, markSkipped, setLastPosition, setTutorialStep } from "@/progress/logic";
import { useEffect } from "react";
import { RequestReplayStep } from "./steps/RequestReplayStep";
import { UrlStep } from "./steps/UrlStep";
import { FrontBackStep } from "./steps/FrontBackStep";
import { DevToolsStep } from "./steps/DevToolsStep";
import { FlagStep } from "./steps/FlagStep";

interface StepDef {
  title: string;
  intro: string;
  render: (onDone: () => void, done: boolean) => React.ReactNode;
  takeaway: string;
}

export function Tutorial({ lab, nextLab }: { lab: LabDefinition; nextLab: LabDefinition | null }) {
  const { progress, hydrated, update } = useProgress();
  const level = getLevel(progress, lab.id);
  const completed = Boolean(level.completedAt);

  const [index, setIndex] = useState(0);
  const [stepDone, setStepDone] = useState(false);

  useEffect(() => {
    update((s) => setLastPosition(s, lab.slug));
  }, [lab.slug, update]);

  const steps: StepDef[] = [
    {
      title: "Una petición y una respuesta",
      intro:
        "Cuando usas una web, tu navegador le pide cosas a un servidor y este responde. Pulsa el botón y observa ese diálogo.",
      render: (onDone, done) => <RequestReplayStep onComplete={onDone} done={done} />,
      takeaway: "Acabas de ver una petición HTTP: tu navegador pregunta, el servidor responde.",
    },
    {
      title: "La URL: la dirección de lo que pides",
      intro:
        "La barra de direcciones no es decoración: le dice al servidor QUÉ recurso quieres. Y a menudo puedes cambiarla tú.",
      render: (onDone, done) => <UrlStep onComplete={onDone} done={done} />,
      takeaway: "La URL identifica el recurso que pides. Cambiarla cambia lo que recibes.",
    },
    {
      title: "Frontend y backend",
      intro:
        "Lo que ves (frontend) lo dibuja tu navegador. Las decisiones importantes deberían tomarse en el servidor (backend). Coloca cada tarea donde corresponde.",
      render: (onDone, done) => <FrontBackStep onComplete={onDone} done={done} />,
      takeaway: "El frontend decide qué mostrar; el backend debe decidir qué está permitido.",
    },
    {
      title: "DevTools: mirar por dentro",
      intro:
        "Tu navegador trae herramientas para inspeccionar cualquier web: el HTML (Elements) y las peticiones que hace por detrás (Network). Explóralas aquí.",
      render: (onDone, done) => <DevToolsStep onComplete={onDone} done={done} />,
      takeaway: "Con DevTools ves el HTML real (Elements) y las peticiones ocultas (Network).",
    },
    {
      title: "Qué es una flag",
      intro:
        "En ChoskoLabs, una flag es una cadena con el formato flag{...} escondida donde solo llegas si reproduces el fallo. Es tu prueba de que lo lograste.",
      render: (onDone, done) => <FlagStep onComplete={onDone} done={done} />,
      takeaway: "Una flag confirma que reprodujiste el fallo. Encontrarla no termina el nivel: entenderlo, sí.",
    },
  ];

  const step = steps[index];
  const isLast = index === steps.length - 1;

  function goNext() {
    if (isLast) {
      update((s) => markCompleted(s, lab.id));
      return;
    }
    const next = index + 1;
    setIndex(next);
    setStepDone(false);
    update((s) => setTutorialStep(s, lab.id, next));
  }

  if (completed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ok-soft text-2xl text-ok">✓</span>
        <h1 className="mt-4 text-2xl font-bold text-ink-50">Tutorial completado</h1>
        <p className="mt-2 text-ink-300">
          Ya conoces lo esencial: peticiones, URLs, frontend/backend, DevTools y qué es una flag. Puedes volver a
          repasarlo cuando quieras.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/web" className={buttonClass("ghost")}>
            Ver el mapa
          </Link>
          {nextLab && (
            <Link href={`/web/${nextLab.slug}`} className={buttonClass("primary", "lg")}>
              Empezar Level {nextLab.number} →
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setStepDone(false);
            update((s) => ({ ...s, levels: { ...s.levels, [lab.id]: { ...getLevel(s, lab.id), completedAt: undefined } } }));
          }}
          className="mt-6 text-xs text-ink-500 underline hover:text-ink-300"
        >
          Repasar el tutorial de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-accent">LEVEL 00 · Aprender jugando</span>
        <button
          type="button"
          onClick={() => update((s) => markSkipped(s, lab.id))}
          className="text-xs text-ink-500 underline hover:text-ink-300"
        >
          Saltar tutorial
        </button>
      </div>

      <div className="mt-4 flex gap-1.5" aria-hidden="true">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < index ? "bg-ok" : i === index ? "bg-accent" : "bg-ink-700"}`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-500">
        Paso {index + 1} de {steps.length}
      </p>

      <div className="mt-6 animate-rise rounded-xl border border-ink-700 bg-ink-850/60 p-6">
        <Badge tone="accent">Minijuego</Badge>
        <h1 className="mt-3 text-2xl font-bold text-ink-50">{step.title}</h1>
        <p className="mt-2 leading-relaxed text-ink-300">{step.intro}</p>
        <div className="mt-6">{step.render(() => setStepDone(true), stepDone)}</div>

        {stepDone && (
          <div className="mt-6 animate-rise rounded-lg border-l-2 border-ok bg-ok-soft px-4 py-3 text-sm text-ink-100">
            {step.takeaway}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" disabled={!stepDone} onClick={goNext} className={buttonClass("primary", "lg")}>
          {isLast ? "Terminar tutorial" : "Siguiente"}
        </button>
      </div>
      {!hydrated && <p className="sr-only">Cargando progreso…</p>}
    </div>
  );
}
