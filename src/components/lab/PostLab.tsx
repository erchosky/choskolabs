"use client";

import Link from "next/link";
import type { PlayableLabDefinition, LabDefinition } from "@/content/types";
import { Prose } from "@/components/ui/Prose";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/button";
import { FlowDiagram } from "./FlowDiagram";
import { CodeCompare } from "./CodeCompare";
import { ExplanationDepth } from "./ExplanationDepth";
import { ReflectionQuestion } from "./ReflectionQuestion";

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ink-700/70 pt-6">
      <h3 className="flex items-baseline gap-2 text-lg font-semibold text-ink-50">
        <span className="font-mono text-sm text-accent">{n}</span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function PostLab({
  lab,
  nextLab,
  reflectionAnswer,
  onReflectionAnswer,
  onReachEnd,
}: {
  lab: PlayableLabDefinition;
  nextLab: LabDefinition | null;
  reflectionAnswer?: string;
  onReflectionAnswer: (id: string) => void;
  onReachEnd: () => void;
}) {
  const pl = lab.postLab;

  return (
    <div className="space-y-6">
      <div className="animate-pop rounded-xl border border-ok/40 bg-ok-soft p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ok/20 text-ok" aria-hidden="true">
            ✓
          </span>
          <p className="text-lg font-semibold text-ink-50">Flag correcta</p>
        </div>
        <p className="mt-2 text-ink-100">Ahora entiende qué acabas de hacer. Esto es lo importante de verdad.</p>
      </div>

      <div className="rounded-xl border border-ink-700 bg-ink-850/60 p-6">
        <Section n="01" title="Qué hiciste">
          <Prose content={pl.whatYouDid} />
        </Section>
        <Section n="02" title="Por qué funcionó">
          <Prose content={pl.whyItWorked} />
        </Section>
        <Section n="03" title="Qué estaba ocurriendo realmente">
          <FlowDiagram steps={pl.howItWorked.flow} />
          <div className="mt-5">
            <ExplanationDepth
              simple={pl.howItWorked.simple}
              technical={pl.howItWorked.technical}
              deep={pl.howItWorked.deep}
            />
          </div>
        </Section>
        <Section n="04" title="Cómo se llama">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{pl.technicalName.name}</Badge>
            {pl.technicalName.aka?.map((aka) => (
              <Badge key={aka}>{aka}</Badge>
            ))}
          </div>
          <div className="mt-3">
            <Prose content={pl.technicalName.summary} />
          </div>
        </Section>
        <Section n="05" title="¿Para qué me sirve esto?">
          <Prose content={pl.practicalUse} />
        </Section>
        <Section n="06" title="Dónde podría aparecer">
          <ul className="grid gap-2 sm:grid-cols-2">
            {pl.realWorldExamples.map((ex) => (
              <li key={ex.title} className="rounded-lg border border-ink-700 bg-ink-800/50 p-3">
                <p className="text-sm font-medium text-ink-100">{ex.title}</p>
                <p className="mt-0.5 text-sm text-ink-400">{ex.description}</p>
              </li>
            ))}
          </ul>
        </Section>
        <Section n="07" title="Cómo lo detectarías otra vez">
          <Prose content={pl.howToRecognizeAgain} />
        </Section>
        <Section n="08" title="Cómo se soluciona">
          <Prose content={pl.remediation.explanation} />
          {pl.remediation.code && (
            <div className="mt-4">
              <CodeCompare samples={pl.remediation.code} />
            </div>
          )}
        </Section>
        <Section n="09" title="Idea para recordar">
          <blockquote className="rounded-lg border-l-2 border-accent bg-accent-soft px-4 py-3 text-ink-50">
            {pl.takeaway}
          </blockquote>
        </Section>
      </div>

      {pl.reflection && (
        <ReflectionQuestion question={pl.reflection} savedAnswer={reflectionAnswer} onAnswer={onReflectionAnswer} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-700/70 pt-6">
        <Link href="/web" className={buttonClass("ghost")}>
          ← Volver al mapa
        </Link>
        {nextLab ? (
          <Link href={`/web/${nextLab.slug}`} className={buttonClass("primary", "lg")} onClick={onReachEnd}>
            Siguiente: {nextLab.kind === "checkpoint" ? "Checkpoint" : `Level ${nextLab.number}`} →
          </Link>
        ) : (
          <span className="text-sm text-ink-300">Has completado todo el Web Wargame disponible. ¡Enorme!</span>
        )}
      </div>
    </div>
  );
}
