import { describe, expect, it } from "vitest";
import { CHAPTERS, LABS, getChapterOf, getNextLab, isPlayable } from "./curriculum";
import { flagLabIds, getFlag } from "@/server/flags";

describe("integridad del curriculum", () => {
  it("todos los labs tienen id y slug únicos", () => {
    expect(new Set(LABS.map((l) => l.id)).size).toBe(LABS.length);
    expect(new Set(LABS.map((l) => l.slug)).size).toBe(LABS.length);
  });

  it("cada lab pertenece a un capítulo existente que lo lista", () => {
    for (const lab of LABS) {
      const chapter = getChapterOf(lab);
      expect(chapter, `capítulo de ${lab.id}`).toBeDefined();
      expect(chapter!.labIds).toContain(lab.id);
    }
  });

  it("los labIds de los capítulos existen y cubren todos los labs sin repetir", () => {
    const fromChapters = CHAPTERS.flatMap((c) => c.labIds);
    expect(new Set(fromChapters).size).toBe(fromChapters.length);
    expect(new Set(fromChapters)).toEqual(new Set(LABS.map((l) => l.id)));
  });

  it("unlockRequires referencia labs que existen y aparecen antes en el orden", () => {
    const indexById = new Map(LABS.map((l, i) => [l.id, i]));
    LABS.forEach((lab, i) => {
      for (const req of lab.unlockRequires) {
        expect(indexById.has(req), `${lab.id} requiere ${req}`).toBe(true);
        expect(indexById.get(req)!).toBeLessThan(i);
      }
    });
  });

  it("cada lab jugable tiene exactamente 3 pistas, escenario, misión, solución y post-lab", () => {
    for (const lab of LABS) {
      if (!isPlayable(lab)) continue;
      expect(lab.hints).toHaveLength(3);
      expect(lab.scenario).toBeTruthy();
      expect(lab.mission).toBeTruthy();
      expect(lab.lost).toBeTruthy();
      expect(lab.solution).toBeTruthy();
      expect(lab.postLab.takeaway.length).toBeGreaterThan(0);
      expect(lab.mentalModel.length).toBeGreaterThan(0);
    }
  });

  it("las micro-preguntas tienen una opción correcta válida", () => {
    for (const lab of LABS) {
      if (!isPlayable(lab) || !lab.postLab.reflection) continue;
      const r = lab.postLab.reflection;
      expect(r.options.map((o) => o.id)).toContain(r.correctId);
    }
  });

  it("getNextLab sigue el orden y el último no tiene siguiente", () => {
    expect(getNextLab(LABS[0])?.id).toBe(LABS[1].id);
    expect(getNextLab(LABS[LABS.length - 1])).toBeNull();
  });

  it("cada lab jugable tiene una flag definida en el servidor", () => {
    const flagIds = new Set(flagLabIds());
    for (const lab of LABS) {
      if (isPlayable(lab)) expect(flagIds.has(lab.id as never), `flag de ${lab.id}`).toBe(true);
    }
  });
});

describe("las flags reales no se filtran al contenido cliente", () => {
  it("ninguna flag real aparece en el contenido del curriculum", () => {
    // El contenido de src/content viaja al navegador: puede mencionar el
    // FORMATO flag{...} como ejemplo, pero jamás una flag real.
    const serialized = JSON.stringify(LABS);
    for (const id of flagLabIds()) {
      expect(serialized.includes(getFlag(id)), `flag de ${id} filtrada`).toBe(false);
    }
  });
});
