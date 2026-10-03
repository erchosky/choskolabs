/**
 * Modelo de contenido de ChoskoLabs.
 *
 * REGLA: nada de lo que hay en `src/content` puede contener flags.
 * Este contenido se envía al navegador (props de React). Las flags viven
 * únicamente en `src/server/flags.ts` (server-only). Un test lo comprueba.
 */

export type Difficulty = "introductorio" | "principiante" | "intermedio" | "avanzado" | "challenge";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  introductorio: "Introductorio",
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  challenge: "Challenge",
};

/**
 * Texto enriquecido mínimo. Un bloque puede ser:
 * - un párrafo (string) con `código en línea` y **negrita**;
 * - una lista;
 * - un bloque de código;
 * - una nota destacada.
 */
export type Block =
  | string
  | { list: string[]; ordered?: boolean }
  | { code: string; lang?: string; caption?: string }
  | { note: string; tone?: "info" | "warn" | "ok" };

export type Rich = string | Block[];

export interface Hint {
  /** Título visible del botón: "Pista 1 — Hazme pensar", etc. */
  label: string;
  body: Rich;
}

export interface FlowStep {
  actor: string;
  action: string;
  detail?: string;
  /** Resalta el paso donde está el fallo */
  highlight?: boolean;
}

export interface CodeSample {
  title: string;
  lang: string;
  code: string;
  tone: "vulnerable" | "fixed" | "neutral";
}

export interface RealWorldExample {
  title: string;
  description: string;
}

export interface ReflectionQuestion {
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
}

export interface PostLab {
  /** 1. Qué hiciste — lenguaje sencillo */
  whatYouDid: Rich;
  /** 2. Por qué funcionó — explicación causal */
  whyItWorked: Rich;
  /** 3. Qué estaba ocurriendo realmente — diagrama + tres profundidades */
  howItWorked: {
    flow: FlowStep[];
    simple: Rich;
    technical: Rich;
    deep: Rich;
  };
  /** 4. Cómo se llama */
  technicalName: { name: string; aka?: string[]; summary: Rich };
  /** 5. ¿Para qué me sirve esto? */
  practicalUse: Rich;
  /** 6. Dónde podría aparecer */
  realWorldExamples: RealWorldExample[];
  /** 7. Cómo lo vería un pentester / cómo lo detectaría otra vez */
  howToRecognizeAgain: Rich;
  /** 8. Cómo lo arreglaría un desarrollador */
  remediation: { explanation: Rich; code?: CodeSample[] };
  /** 9. Idea para recordar */
  takeaway: string;
  /** 10. Micro-pregunta opcional */
  reflection?: ReflectionQuestion;
}

export type LabKind = "tutorial" | "level" | "checkpoint";

interface BaseLab {
  id: string;
  /** Segmento de URL en el portal: /web/<slug> */
  slug: string;
  /** Número mostrado: LEVEL 01. Los checkpoints tienen su propia numeración. */
  number: number;
  chapterId: string;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  /** Ids de labs que deben estar completados para desbloquear este. */
  unlockRequires: string[];
}

/** Level 0: tutorial jugable. Su contenido vive en el propio componente interactivo. */
export interface TutorialDefinition extends BaseLab {
  kind: "tutorial";
  /** Si es true, el jugador puede saltárselo y se desbloquea lo siguiente. */
  skippable: boolean;
}

export interface PlayableLabDefinition extends BaseLab {
  kind: "level" | "checkpoint";

  /** Situación que ve el jugador ANTES de jugar. Sin spoilers. */
  scenario: Rich;
  /** Misión: qué comprobar. Sin nombrar la técnica. */
  mission: Rich;
  /** URL de entrada al laboratorio (misma web, entorno ficticio). */
  labUrl: string;
  /** Nombre de la marca ficticia del laboratorio. */
  labBrand: string;
  /** El nivel se disfruta mejor con DevTools (escritorio). */
  bestOnDesktop?: boolean;

  /** Idea mental que debe quedar. Solo se muestra DESPUÉS de resolver. */
  mentalModel: string;
  /** Qué necesitas haber aprendido antes (ids de labs). Uso interno/documental. */
  prerequisites: string[];

  /** Exactamente 3 pistas: hazme pensar, dime dónde mirar, ayúdame técnicamente. */
  hints: [Hint, Hint, Hint];
  /** "Estoy totalmente perdido": enseña el concepto necesario para seguir. */
  lost: Rich;
  /** Solución completa: explica el razonamiento. Último recurso. */
  solution: Rich;
  postLab: PostLab;

  /** En checkpoints: las pistas se ofrecen solo tras confirmar que lo has intentado. */
  hintsRequireAttempt?: boolean;
}

export type LabDefinition = TutorialDefinition | PlayableLabDefinition;

export interface Chapter {
  id: string;
  number: number;
  title: string;
  tagline: string;
  labIds: string[];
  kind?: "chapter" | "checkpoint";
}
