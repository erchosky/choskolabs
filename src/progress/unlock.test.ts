import { describe, expect, it } from "vitest";
import { LABS } from "@/content/curriculum";
import { computeStatuses, isUnlocked, nextRecommendedLab } from "./unlock";
import { markCompleted, markSkipped } from "./logic";
import { EMPTY_PROGRESS, type ProgressState } from "./types";

const order = LABS;

describe("computeStatuses", () => {
  it("con progreso vacío, solo el primer lab es 'current' y el resto está bloqueado", () => {
    const statuses = computeStatuses(order, EMPTY_PROGRESS);
    expect(statuses["level-0"]).toBe("current");
    expect(statuses["level-1"]).toBe("locked");
    expect(statuses["checkpoint-1"]).toBe("locked");
  });

  it("completar el tutorial desbloquea el level-1", () => {
    const s = markCompleted(EMPTY_PROGRESS, "level-0");
    const statuses = computeStatuses(order, s);
    expect(statuses["level-0"]).toBe("completed");
    expect(statuses["level-1"]).toBe("current");
    expect(statuses["level-2"]).toBe("locked");
  });

  it("saltar el tutorial (skippable) también desbloquea el level-1", () => {
    const s = markSkipped(EMPTY_PROGRESS, "level-0");
    expect(isUnlocked(order, s, order.find((l) => l.id === "level-1")!)).toBe(true);
  });

  it("progresa en cadena hasta el checkpoint", () => {
    let s: ProgressState = EMPTY_PROGRESS;
    for (const id of ["level-0", "level-1", "level-2", "level-3", "level-4"]) {
      s = markCompleted(s, id);
    }
    const statuses = computeStatuses(order, s);
    expect(statuses["level-5"]).toBe("current");
    expect(statuses["checkpoint-1"]).toBe("locked");
  });

  it("el checkpoint requiere el level-5 completado", () => {
    let s: ProgressState = EMPTY_PROGRESS;
    for (const id of ["level-0", "level-1", "level-2", "level-3", "level-4", "level-5"]) {
      s = markCompleted(s, id);
    }
    const statuses = computeStatuses(order, s);
    expect(statuses["checkpoint-1"]).toBe("current");
  });

  it("completar todo deja nextRecommendedLab en null", () => {
    let s: ProgressState = EMPTY_PROGRESS;
    for (const lab of order) s = markCompleted(s, lab.id);
    expect(nextRecommendedLab(order, s)).toBeNull();
  });
});
