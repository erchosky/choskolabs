import "server-only";
import { getFlag } from "@/server/flags";

/**
 * Level 2 — PulsoFit, app ficticia de un gimnasio.
 *
 * FALLO INTENCIONADO: la interfaz de socio oculta el enlace al panel del
 * personal (atributo `hidden`), pero la ruta /labs/pulsofit/staff no comprueba
 * el rol de la sesión en el servidor. `canViewStaffPanel` muestra cómo
 * debería decidirse; la página vulnerable no la usa.
 */

export type PulsoRole = "socio" | "staff";

export const CURRENT_MEMBER = {
  id: "mem_5521",
  name: "Diego Ramos",
  role: "socio" as PulsoRole,
  plan: "Plan Flexible",
  memberSince: "marzo de 2025",
};

export const UPCOMING_CLASSES = [
  { day: "Lunes", time: "19:00", name: "Ciclo indoor", room: "Sala 2", spots: 4 },
  { day: "Martes", time: "08:30", name: "Movilidad y core", room: "Sala 1", spots: 11 },
  { day: "Miércoles", time: "20:00", name: "Fuerza funcional", room: "Box", spots: 0 },
  { day: "Jueves", time: "18:00", name: "Yoga suave", room: "Sala 1", spots: 7 },
];

export function canViewStaffPanel(role: PulsoRole): boolean {
  return role === "staff";
}

export function getStaffPanelData() {
  return {
    todayCash: "1.284,50 €",
    pendingIncidents: 3,
    exports: ["Listado de socios (CSV)", "Pagos pendientes del mes", "Accesos del torno — últimos 7 días"],
    openingCode: getFlag("level-2"),
  };
}
