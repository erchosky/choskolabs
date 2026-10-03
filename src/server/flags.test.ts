import { describe, expect, it } from "vitest";
import { checkFlag, flagLabIds, getFlag, isFlagLabId } from "./flags";

describe("checkFlag", () => {
  it("acepta la flag correcta de cada nivel", () => {
    for (const id of flagLabIds()) {
      expect(checkFlag(id, getFlag(id))).toEqual({ status: "correct" });
    }
  });

  it("ignora espacios alrededor", () => {
    expect(checkFlag("level-1", `  ${getFlag("level-1")}  `)).toEqual({ status: "correct" });
  });

  it("rechaza vacío", () => {
    expect(checkFlag("level-1", "").status).toBe("empty");
    expect(checkFlag("level-1", "   ").status).toBe("empty");
    expect(checkFlag("level-1", undefined).status).toBe("empty");
  });

  it("detecta formato inválido", () => {
    expect(checkFlag("level-1", "no-es-una-flag").status).toBe("format");
    expect(checkFlag("level-1", "flag{con espacios}").status).toBe("format");
  });

  it("avisa cuando la flag es de otro nivel", () => {
    const result = checkFlag("level-1", getFlag("level-2"));
    expect(result).toEqual({ status: "other-level", otherLabId: "level-2" });
  });

  it("rechaza una flag con formato correcto pero desconocida", () => {
    expect(checkFlag("level-1", "flag{esto_no_existe}").status).toBe("incorrect");
  });

  it("rechaza labs desconocidos", () => {
    expect(checkFlag("level-99", getFlag("level-1")).status).toBe("unknown-lab");
  });

  it("reconoce ids de flag válidos", () => {
    expect(isFlagLabId("level-1")).toBe(true);
    expect(isFlagLabId("nope")).toBe(false);
  });
});
