"use client";

import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { LABS } from "@/content/curriculum";
import { useProgress } from "@/progress/store";
import { nextRecommendedLab } from "@/progress/unlock";

/** "Continuar donde lo dejaste": aparece solo si hay progreso. */
export function ContinueButton() {
  const { progress, hydrated } = useProgress();
  if (!hydrated) return null;

  const startedSomething = Object.keys(progress.levels).length > 0;
  if (!startedSomething) return null;

  const next = nextRecommendedLab(LABS, progress);
  const target = next ?? LABS[LABS.length - 1];
  const label = next ? "Continuar" : "Repasar";

  return (
    <Link href={`/web/${target.slug}`} className={buttonClass("secondary", "lg")}>
      {label}: {target.kind === "checkpoint" ? "Checkpoint" : `Level ${target.number}`}
    </Link>
  );
}
