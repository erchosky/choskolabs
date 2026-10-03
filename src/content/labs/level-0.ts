import type { TutorialDefinition } from "../types";

/**
 * Level 0 — tutorial jugable. El contenido interactivo vive en
 * src/components/tutorial/*. Aquí solo están los metadatos.
 */
export const level0: TutorialDefinition = {
  id: "level-0",
  slug: "level-0",
  kind: "tutorial",
  number: 0,
  chapterId: "chapter-0",
  title: "Aprender jugando",
  subtitle: "Cinco minijuegos para entender qué pasa cuando usas una web.",
  difficulty: "introductorio",
  estimatedMinutes: 8,
  unlockRequires: [],
  skippable: true,
};
