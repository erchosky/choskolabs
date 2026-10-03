import "server-only";
import { getFlag } from "@/server/flags";

/**
 * Level 5 — Colmena Coworking, app ficticia de reservas de salas.
 *
 * FALLO INTENCIONADO: el rol se lee de una cookie (`colmena_role`) que crea
 * y guarda el propio navegador. El servidor se cree lo que diga.
 * Todo ocurre dentro del laboratorio: la cookie solo existe bajo /labs/colmena.
 */

export const COOKIE_PATH = "/labs/colmena";
export const ROLE_COOKIE = "colmena_role";
export const LANG_COOKIE = "colmena_lang";
export const MEMBER_COOKIE = "colmena_member";

export const MEMBER = { id: "m-3309", name: "Irene Soto", plan: "Bono 10 días" };

export type ColmenaRole = "member" | "staff" | "admin" | "unknown";

export function parseRole(value: string | undefined): ColmenaRole | null {
  if (value === undefined) return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "member" || normalized === "staff" || normalized === "admin") return normalized;
  return "unknown";
}

/** ⚠️ VULNERABLE A PROPÓSITO: los privilegios dependen de un valor del cliente. */
export function hasManagementAccess(role: ColmenaRole | null): boolean {
  return role === "staff" || role === "admin";
}

export function getManagementData() {
  return {
    occupancy: "78 %",
    keysOut: 4,
    doorCode: getFlag("level-5"),
    bookingsToday: [
      { room: "Sala Abeja", who: "Estudio Marea", time: "09:00–11:00" },
      { room: "Sala Panal", who: "Irene Soto", time: "12:00–13:00" },
      { room: "Cabina 2", who: "Equipo Nodo", time: "16:00–18:00" },
    ],
  };
}

export const ROOMS = [
  { name: "Sala Panal", seats: 6, free: "12:00–13:00" },
  { name: "Sala Abeja", seats: 10, free: "15:00–17:00" },
  { name: "Cabina 2", seats: 2, free: "Todo el día" },
];
