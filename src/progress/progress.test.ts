import { describe, expect, it } from "vitest";
import {
  LocalProgressRepository,
  MemoryProgressRepository,
  PROGRESS_STORAGE_KEY,
  parseProgress,
  type KeyValueStorage,
} from "./repository";
import {
  confirmAttempt,
  getLevel,
  helpCount,
  isCompleted,
  markCompleted,
  markHelpOpened,
  markLabOpened,
  markPostLabCompleted,
  markSkipped,
  markSolutionViewed,
  setLastPosition,
  setReflectionAnswer,
  setTutorialStep,
} from "./logic";
import { EMPTY_PROGRESS, type ProgressState } from "./types";

class FakeStorage implements KeyValueStorage {
  store = new Map<string, string>();
  throwOnWrite = false;
  getItem(k: string) {
    return this.store.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    if (this.throwOnWrite) throw new Error("QuotaExceeded");
    this.store.set(k, v);
  }
  removeItem(k: string) {
    this.store.delete(k);
  }
}

describe("parseProgress", () => {
  it("devuelve vacío ante null o JSON corrupto", () => {
    expect(parseProgress(null)).toEqual(EMPTY_PROGRESS);
    expect(parseProgress("{no json")).toEqual(EMPTY_PROGRESS);
    expect(parseProgress('{"version":2}')).toEqual(EMPTY_PROGRESS);
  });

  it("saneando descarta campos corruptos pero conserva los válidos", () => {
    const raw = JSON.stringify({
      version: 1,
      lastPosition: "level-1",
      levels: {
        "level-1": { completedAt: "2026-01-01T00:00:00.000Z", helpOpened: ["hint-1", "basura", 5], labOpened: true },
        "level-2": "no es un objeto",
        "level-3": { tutorialStep: -3, solutionViewed: "sí" },
      },
    });
    const state = parseProgress(raw);
    expect(state.lastPosition).toBe("level-1");
    expect(state.levels["level-1"].helpOpened).toEqual(["hint-1"]);
    expect(state.levels["level-1"].completedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(state.levels["level-2"]).toBeUndefined();
    expect(state.levels["level-3"]).toEqual({});
  });
});

describe("LocalProgressRepository", () => {
  it("guarda y recupera", () => {
    const storage = new FakeStorage();
    const repo = new LocalProgressRepository(storage);
    const state: ProgressState = { version: 1, levels: { "level-1": { labOpened: true } } };
    repo.save(state);
    expect(storage.store.has(PROGRESS_STORAGE_KEY)).toBe(true);
    expect(repo.load()).toEqual(state);
    repo.reset();
    expect(repo.load()).toEqual(EMPTY_PROGRESS);
  });

  it("no lanza si el almacenamiento falla al escribir", () => {
    const storage = new FakeStorage();
    storage.throwOnWrite = true;
    const repo = new LocalProgressRepository(storage);
    expect(() => repo.save(EMPTY_PROGRESS)).not.toThrow();
  });
});

describe("transiciones de progreso (puras)", () => {
  it("no muta el estado original", () => {
    const before = EMPTY_PROGRESS;
    const after = markLabOpened(before, "level-1");
    expect(before.levels["level-1"]).toBeUndefined();
    expect(after.levels["level-1"].labOpened).toBe(true);
  });

  it("marcar completado fija fecha y elimina 'skipped'", () => {
    let s = markSkipped(EMPTY_PROGRESS, "level-0");
    expect(getLevel(s, "level-0").skipped).toBe(true);
    s = markCompleted(s, "level-0", new Date("2026-02-02T00:00:00Z"));
    expect(isCompleted(s, "level-0")).toBe(true);
    expect(getLevel(s, "level-0").skipped).toBeUndefined();
  });

  it("no re-marca completado (idempotente)", () => {
    const s1 = markCompleted(EMPTY_PROGRESS, "level-1", new Date("2026-01-01Z"));
    const s2 = markCompleted(s1, "level-1", new Date("2026-12-31Z"));
    expect(s2).toBe(s1);
  });

  it("no permite saltar un nivel ya completado", () => {
    const done = markCompleted(EMPTY_PROGRESS, "level-1");
    expect(markSkipped(done, "level-1")).toBe(done);
  });

  it("acumula ayudas sin duplicar y cuenta", () => {
    let s = markHelpOpened(EMPTY_PROGRESS, "level-1", "hint-1");
    s = markHelpOpened(s, "level-1", "hint-1");
    s = markHelpOpened(s, "level-1", "hint-2");
    s = markHelpOpened(s, "level-1", "lost");
    expect(helpCount(getLevel(s, "level-1"))).toBe(3);
  });

  it("tutorialStep solo avanza", () => {
    let s = setTutorialStep(EMPTY_PROGRESS, "level-0", 3);
    s = setTutorialStep(s, "level-0", 1);
    expect(getLevel(s, "level-0").tutorialStep).toBe(3);
  });

  it("registra solución, post-lab, reflexión, intento y última posición", () => {
    let s = markSolutionViewed(EMPTY_PROGRESS, "level-1");
    s = markPostLabCompleted(s, "level-1");
    s = setReflectionAnswer(s, "level-1", "b");
    s = confirmAttempt(s, "checkpoint-1");
    s = setLastPosition(s, "level-1");
    expect(getLevel(s, "level-1").solutionViewed).toBe(true);
    expect(getLevel(s, "level-1").postLabCompleted).toBe(true);
    expect(getLevel(s, "level-1").reflectionAnswer).toBe("b");
    expect(getLevel(s, "checkpoint-1").attemptConfirmed).toBe(true);
    expect(s.lastPosition).toBe("level-1");
  });
});

describe("MemoryProgressRepository", () => {
  it("guarda, carga y resetea", () => {
    const repo = new MemoryProgressRepository();
    const s: ProgressState = { version: 1, levels: { x: { labOpened: true } } };
    repo.save(s);
    expect(repo.load()).toBe(s);
    repo.reset();
    expect(repo.load()).toEqual(EMPTY_PROGRESS);
  });
});
