import { EMPTY_PROGRESS, type HelpStep, type LevelProgress, type ProgressState } from "./types";

/**
 * Abstracción de persistencia del progreso.
 * v0.1 usa LocalProgressRepository (localStorage). En el futuro, una
 * implementación remota (cuentas) podrá cumplir esta misma interfaz.
 */
export interface ProgressRepository {
  load(): ProgressState;
  save(state: ProgressState): void;
  reset(): void;
}

/** Subconjunto de la API Storage que necesitamos (facilita los tests). */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const PROGRESS_STORAGE_KEY = "choskolabs:progress:v1";

const HELP_STEPS: ReadonlySet<string> = new Set<HelpStep>(["hint-1", "hint-2", "hint-3", "lost"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Limpia datos guardados: descarta campos corruptos en vez de romper la app. */
function sanitizeLevel(raw: unknown): LevelProgress | null {
  if (!isRecord(raw)) return null;
  const level: LevelProgress = {};
  if (raw.labOpened === true) level.labOpened = true;
  if (Array.isArray(raw.helpOpened)) {
    const steps = raw.helpOpened.filter((s): s is HelpStep => typeof s === "string" && HELP_STEPS.has(s));
    if (steps.length > 0) level.helpOpened = Array.from(new Set(steps));
  }
  if (raw.solutionViewed === true) level.solutionViewed = true;
  if (typeof raw.completedAt === "string") level.completedAt = raw.completedAt;
  if (raw.skipped === true) level.skipped = true;
  if (raw.postLabCompleted === true) level.postLabCompleted = true;
  if (typeof raw.reflectionAnswer === "string") level.reflectionAnswer = raw.reflectionAnswer;
  if (raw.attemptConfirmed === true) level.attemptConfirmed = true;
  if (typeof raw.tutorialStep === "number" && Number.isInteger(raw.tutorialStep) && raw.tutorialStep >= 0) {
    level.tutorialStep = raw.tutorialStep;
  }
  return level;
}

export function parseProgress(serialized: string | null): ProgressState {
  if (!serialized) return EMPTY_PROGRESS;
  let raw: unknown;
  try {
    raw = JSON.parse(serialized);
  } catch {
    return EMPTY_PROGRESS;
  }
  if (!isRecord(raw) || raw.version !== 1 || !isRecord(raw.levels)) return EMPTY_PROGRESS;

  const levels: Record<string, LevelProgress> = {};
  for (const [id, value] of Object.entries(raw.levels)) {
    const level = sanitizeLevel(value);
    if (level) levels[id] = level;
  }
  const state: ProgressState = { version: 1, levels };
  if (typeof raw.lastPosition === "string") state.lastPosition = raw.lastPosition;
  return state;
}

export class LocalProgressRepository implements ProgressRepository {
  constructor(
    private readonly storage: KeyValueStorage,
    private readonly key: string = PROGRESS_STORAGE_KEY,
  ) {}

  load(): ProgressState {
    try {
      return parseProgress(this.storage.getItem(this.key));
    } catch {
      // Storage bloqueado (modo privado estricto, cookies desactivadas...)
      return EMPTY_PROGRESS;
    }
  }

  save(state: ProgressState): void {
    try {
      this.storage.setItem(this.key, JSON.stringify(state));
    } catch {
      // Sin almacenamiento disponible: el progreso vive solo en memoria.
    }
  }

  reset(): void {
    try {
      this.storage.removeItem(this.key);
    } catch {
      // ignorado a propósito
    }
  }
}

/** Implementación en memoria: tests y navegadores sin storage. */
export class MemoryProgressRepository implements ProgressRepository {
  private state: ProgressState;
  constructor(initial: ProgressState = EMPTY_PROGRESS) {
    this.state = initial;
  }
  load(): ProgressState {
    return this.state;
  }
  save(state: ProgressState): void {
    this.state = state;
  }
  reset(): void {
    this.state = EMPTY_PROGRESS;
  }
}
