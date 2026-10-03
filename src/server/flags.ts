import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

/**
 * FLAGS de ChoskoLabs v0.1.
 *
 * - Solo existen en el servidor (`server-only` impide importarlas desde un
 *   componente cliente: el build fallaría).
 * - Son estáticas en v0.1. No son secretos reales: sirven para confirmar que
 *   el jugador llegó al recurso correcto dentro del laboratorio.
 * - Los escenarios (src/scenarios) las leen con `getFlag()` para mostrarlas
 *   únicamente cuando el jugador reproduce el fallo.
 */
const FLAGS = {
  "level-0": "flag{la_respuesta_estaba_en_network_0b1e}",
  "level-1": "flag{conocer_el_id_no_es_tener_permiso_7f3a}",
  "level-2": "flag{ocultar_no_es_proteger_2c9d}",
  "level-3": "flag{el_precio_lo_calcula_el_servidor_91e4}",
  "level-4": "flag{la_pantalla_es_solo_una_parte_5ab0}",
  "level-5": "flag{el_cliente_no_se_da_permisos_d71c}",
  "checkpoint-1": "flag{pienso_como_auditor_3e8f}",
} as const satisfies Record<string, string>;

export type FlagLabId = keyof typeof FLAGS;

export function isFlagLabId(id: string): id is FlagLabId {
  return Object.hasOwn(FLAGS, id);
}

export function getFlag(labId: FlagLabId): string {
  return FLAGS[labId];
}

export function flagLabIds(): FlagLabId[] {
  return Object.keys(FLAGS) as FlagLabId[];
}

export type FlagCheckResult =
  | { status: "correct" }
  | { status: "empty" }
  | { status: "format" }
  | { status: "other-level"; otherLabId: FlagLabId }
  | { status: "incorrect" }
  | { status: "unknown-lab" };

const FLAG_FORMAT = /^flag\{[^{}\s]+\}$/;

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

/** Comparación en tiempo constante (buena práctica, aunque aquí no haya secretos reales). */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b));
}

export function checkFlag(labId: string, submitted: unknown): FlagCheckResult {
  if (!isFlagLabId(labId)) return { status: "unknown-lab" };
  if (typeof submitted !== "string" || submitted.trim() === "") return { status: "empty" };

  const candidate = submitted.trim();
  if (candidate.length > 200 || !FLAG_FORMAT.test(candidate)) return { status: "format" };
  if (safeEqual(candidate, FLAGS[labId])) return { status: "correct" };

  for (const other of flagLabIds()) {
    if (other !== labId && safeEqual(candidate, FLAGS[other])) {
      return { status: "other-level", otherLabId: other };
    }
  }
  return { status: "incorrect" };
}
