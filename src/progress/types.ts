/** Hitos de ayuda que se registran. "lost" = "Estoy totalmente perdido". */
export type HelpStep = "hint-1" | "hint-2" | "hint-3" | "lost";

export interface LevelProgress {
  /** El jugador pulsó "Abrir laboratorio" al menos una vez. */
  labOpened?: boolean;
  /** Ayudas abiertas (información personal, nunca puntuación). */
  helpOpened?: HelpStep[];
  solutionViewed?: boolean;
  /** Fecha ISO en que se validó la flag. */
  completedAt?: string;
  /** Solo para el tutorial: el jugador decidió saltarlo. */
  skipped?: boolean;
  /** Terminó de recorrer el post-lab. */
  postLabCompleted?: boolean;
  /** Respuesta a la micro-pregunta (id de la opción elegida). */
  reflectionAnswer?: string;
  /** Checkpoints: el jugador confirmó que lo ha intentado antes de ver pistas. */
  attemptConfirmed?: boolean;
  /** Tutorial: último paso alcanzado. */
  tutorialStep?: number;
}

export interface ProgressState {
  version: 1;
  levels: Record<string, LevelProgress>;
  /** Slug del último nivel visitado, para "Continuar donde lo dejaste". */
  lastPosition?: string;
}

export const EMPTY_PROGRESS: ProgressState = Object.freeze({ version: 1, levels: {} }) as ProgressState;
