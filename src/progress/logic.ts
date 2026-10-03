import type { HelpStep, LevelProgress, ProgressState } from "./types";

/**
 * Transiciones puras sobre el progreso. Nunca mutan el estado recibido:
 * devuelven uno nuevo (útil para React y para los tests).
 */

export function getLevel(state: ProgressState, labId: string): LevelProgress {
  return state.levels[labId] ?? {};
}

function updateLevel(
  state: ProgressState,
  labId: string,
  update: (level: LevelProgress) => LevelProgress,
): ProgressState {
  return { ...state, levels: { ...state.levels, [labId]: update(getLevel(state, labId)) } };
}

export function markLabOpened(state: ProgressState, labId: string): ProgressState {
  if (getLevel(state, labId).labOpened) return state;
  return updateLevel(state, labId, (l) => ({ ...l, labOpened: true }));
}

export function markHelpOpened(state: ProgressState, labId: string, step: HelpStep): ProgressState {
  const current = getLevel(state, labId).helpOpened ?? [];
  if (current.includes(step)) return state;
  return updateLevel(state, labId, (l) => ({ ...l, helpOpened: [...current, step] }));
}

export function markSolutionViewed(state: ProgressState, labId: string): ProgressState {
  if (getLevel(state, labId).solutionViewed) return state;
  return updateLevel(state, labId, (l) => ({ ...l, solutionViewed: true }));
}

export function markCompleted(state: ProgressState, labId: string, now: Date = new Date()): ProgressState {
  if (getLevel(state, labId).completedAt) return state;
  return updateLevel(state, labId, (l) => ({ ...l, completedAt: now.toISOString(), skipped: undefined }));
}

export function markSkipped(state: ProgressState, labId: string): ProgressState {
  const level = getLevel(state, labId);
  if (level.completedAt || level.skipped) return state;
  return updateLevel(state, labId, (l) => ({ ...l, skipped: true }));
}

export function markPostLabCompleted(state: ProgressState, labId: string): ProgressState {
  if (getLevel(state, labId).postLabCompleted) return state;
  return updateLevel(state, labId, (l) => ({ ...l, postLabCompleted: true }));
}

export function setReflectionAnswer(state: ProgressState, labId: string, optionId: string): ProgressState {
  return updateLevel(state, labId, (l) => ({ ...l, reflectionAnswer: optionId }));
}

export function confirmAttempt(state: ProgressState, labId: string): ProgressState {
  if (getLevel(state, labId).attemptConfirmed) return state;
  return updateLevel(state, labId, (l) => ({ ...l, attemptConfirmed: true }));
}

export function setTutorialStep(state: ProgressState, labId: string, step: number): ProgressState {
  const current = getLevel(state, labId).tutorialStep ?? 0;
  if (step <= current) return state;
  return updateLevel(state, labId, (l) => ({ ...l, tutorialStep: step }));
}

export function setLastPosition(state: ProgressState, slug: string): ProgressState {
  if (state.lastPosition === slug) return state;
  return { ...state, lastPosition: slug };
}

export function isCompleted(state: ProgressState, labId: string): boolean {
  return Boolean(getLevel(state, labId).completedAt);
}

/** Cuántas ayudas abrió (pistas + "estoy perdido"). Solo informativo. */
export function helpCount(level: LevelProgress): number {
  return level.helpOpened?.length ?? 0;
}
