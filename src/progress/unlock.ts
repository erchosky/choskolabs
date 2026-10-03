import type { LabDefinition } from "@/content/types";
import type { ProgressState } from "./types";

export type LabStatus = "locked" | "available" | "current" | "completed";

/**
 * Un requisito se considera cumplido si el lab está completado o, en el caso
 * del tutorial saltable, si el jugador decidió saltarlo.
 */
export function isRequirementMet(labs: readonly LabDefinition[], progress: ProgressState, labId: string): boolean {
  const level = progress.levels[labId];
  if (!level) return false;
  if (level.completedAt) return true;
  const lab = labs.find((l) => l.id === labId);
  return Boolean(lab && lab.kind === "tutorial" && lab.skippable && level.skipped);
}

export function isUnlocked(labs: readonly LabDefinition[], progress: ProgressState, lab: LabDefinition): boolean {
  return lab.unlockRequires.every((req) => isRequirementMet(labs, progress, req));
}

/**
 * Calcula el estado de cada lab siguiendo el orden del curriculum.
 * "current" es el primer lab desbloqueado y no completado: lo que recomendamos jugar ahora.
 */
export function computeStatuses(
  orderedLabs: readonly LabDefinition[],
  progress: ProgressState,
): Record<string, LabStatus> {
  const statuses: Record<string, LabStatus> = {};
  let currentAssigned = false;
  for (const lab of orderedLabs) {
    if (isRequirementMet(orderedLabs, progress, lab.id)) {
      statuses[lab.id] = "completed";
    } else if (!isUnlocked(orderedLabs, progress, lab)) {
      statuses[lab.id] = "locked";
    } else if (!currentAssigned) {
      statuses[lab.id] = "current";
      currentAssigned = true;
    } else {
      statuses[lab.id] = "available";
    }
  }
  return statuses;
}

/** Siguiente lab recomendado, o null si todo está completado. */
export function nextRecommendedLab(
  orderedLabs: readonly LabDefinition[],
  progress: ProgressState,
): LabDefinition | null {
  const statuses = computeStatuses(orderedLabs, progress);
  return orderedLabs.find((lab) => statuses[lab.id] === "current") ?? null;
}
