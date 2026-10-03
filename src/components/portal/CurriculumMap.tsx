"use client";

import Link from "next/link";
import { CHAPTERS, LABS, getLabById } from "@/content/curriculum";
import { DIFFICULTY_LABEL, type LabDefinition } from "@/content/types";
import { useProgress } from "@/progress/store";
import { computeStatuses, type LabStatus } from "@/progress/unlock";
import { StatusPill } from "./StatusPill";

function LabRow({ lab, status }: { lab: LabDefinition; status: LabStatus }) {
  const locked = status === "locked";
  const number = lab.kind === "checkpoint" ? "CP" : `0${lab.number}`.slice(-2);

  const inner = (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition-colors ${
        locked
          ? "cursor-not-allowed border-ink-700/70 bg-ink-850/40"
          : "border-ink-700 bg-ink-800/60 hover:border-accent/40 hover:bg-ink-800"
      }`}
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg font-mono text-sm font-semibold ${
          status === "completed"
            ? "bg-ok-soft text-ok"
            : status === "current"
              ? "bg-accent text-ink-950"
              : locked
                ? "bg-ink-800 text-ink-500"
                : "bg-ink-700 text-ink-100"
        }`}
      >
        {lab.kind === "tutorial" ? "00" : number}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className={`truncate font-medium ${locked ? "text-ink-400" : "text-ink-50"}`}>{lab.title}</h4>
        </div>
        <p className={`mt-0.5 truncate text-sm ${locked ? "text-ink-500" : "text-ink-300"}`}>{lab.subtitle}</p>
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
        <StatusPill status={status} />
        <span className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
          {DIFFICULTY_LABEL[lab.difficulty]} · {lab.estimatedMinutes} min
        </span>
      </div>
      {!locked && <span className="hidden text-ink-500 sm:block" aria-hidden="true">→</span>}
    </div>
  );

  if (locked) {
    return (
      <li title="Completa el nivel anterior para desbloquearlo">
        <div aria-disabled="true">{inner}</div>
      </li>
    );
  }
  return (
    <li>
      <Link href={`/web/${lab.slug}`} className="block focus-visible:outline-none">
        {inner}
      </Link>
    </li>
  );
}

export function CurriculumMap() {
  const { progress, hydrated } = useProgress();
  const statuses = computeStatuses(LABS, hydrated ? progress : { version: 1, levels: {} });

  return (
    <div className="space-y-10">
      {CHAPTERS.map((chapter) => (
        <section key={chapter.id} aria-labelledby={`chapter-${chapter.id}`}>
          <div className="mb-4 flex items-baseline gap-3">
            <span className="font-mono text-sm text-accent">
              {chapter.kind === "checkpoint" ? "CHECKPOINT" : `CAPÍTULO ${chapter.number}`}
            </span>
          </div>
          <h3 id={`chapter-${chapter.id}`} className="text-xl font-semibold text-ink-50">
            {chapter.title}
          </h3>
          <p className="mt-1 text-sm text-ink-300">{chapter.tagline}</p>
          <ul className="mt-4 space-y-3">
            {chapter.labIds.map((id) => {
              const lab = getLabById(id);
              if (!lab) return null;
              return <LabRow key={id} lab={lab} status={statuses[id] ?? "locked"} />;
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
