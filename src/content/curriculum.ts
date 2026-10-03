import type { Chapter, LabDefinition, PlayableLabDefinition } from "./types";
import { level0 } from "./labs/level-0";
import { level1 } from "./labs/level-1";
import { level2 } from "./labs/level-2";
import { level3 } from "./labs/level-3";
import { level4 } from "./labs/level-4";
import { level5 } from "./labs/level-5";
import { checkpoint1 } from "./labs/checkpoint-1";

/**
 * Fuente única del curriculum de la categoría WEB WARGAME.
 * El orden de LABS define el orden del curso y el "current" del progreso.
 */
export const LABS: readonly LabDefinition[] = [level0, level1, level2, level3, level4, level5, checkpoint1];

export const CHAPTERS: readonly Chapter[] = [
  {
    id: "chapter-0",
    number: 0,
    title: "Empieza aquí",
    tagline: "Lo mínimo para jugar, sin muros de texto.",
    labIds: ["level-0"],
  },
  {
    id: "chapter-1",
    number: 1,
    title: "Aprende a mirar",
    tagline: "Observa lo que la web te enseña... y lo que no.",
    labIds: ["level-1", "level-2"],
  },
  {
    id: "chapter-2",
    number: 2,
    title: "No confíes en el cliente",
    tagline: "El navegador está bajo control del usuario. El servidor debe asumirlo.",
    labIds: ["level-3", "level-4", "level-5"],
  },
  {
    id: "checkpoint-1",
    number: 3,
    title: "Checkpoint",
    tagline: "Ahora prueba tú, sin que te digamos qué buscar.",
    labIds: ["checkpoint-1"],
    kind: "checkpoint",
  },
];

const LAB_BY_SLUG = new Map(LABS.map((lab) => [lab.slug, lab]));
const LAB_BY_ID = new Map(LABS.map((lab) => [lab.id, lab]));

export function getLabBySlug(slug: string): LabDefinition | undefined {
  return LAB_BY_SLUG.get(slug);
}

export function getLabById(id: string): LabDefinition | undefined {
  return LAB_BY_ID.get(id);
}

export function isPlayable(lab: LabDefinition): lab is PlayableLabDefinition {
  return lab.kind === "level" || lab.kind === "checkpoint";
}

export function getChapterOf(lab: LabDefinition): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === lab.chapterId);
}

/** Lab siguiente en el orden del curriculum (o null si es el último). */
export function getNextLab(lab: LabDefinition): LabDefinition | null {
  const index = LABS.findIndex((l) => l.id === lab.id);
  if (index === -1 || index === LABS.length - 1) return null;
  return LABS[index + 1];
}

export function totalLabs(): number {
  return LABS.length;
}
