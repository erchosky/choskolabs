import "server-only";
import { getFlag } from "@/server/flags";

/**
 * Level 4 — Nimbo, almacenamiento en la nube ficticio. Portal de soporte.
 *
 * La página /labs/nimbo/soporte NO lleva el número de ticket en su URL:
 * lo pide JavaScript en segundo plano a /api/labs/nimbo/tickets/<id>.
 *
 * FALLO INTENCIONADO: la API devuelve cualquier ticket por id y, además,
 * incluye campos internos que la interfaz no muestra.
 */

export const CURRENT_USER = { id: "usr_8812", name: "Andrea Gil", email: "andrea.gil@correo.test" };
export const CURRENT_TICKET_ID = 431;

interface TicketMessage {
  from: string;
  role: "cliente" | "agente" | "sistema";
  at: string;
  body: string;
}

export interface Ticket {
  id: number;
  subject: string;
  status: "abierto" | "esperando cliente" | "escalado" | "cerrado";
  created_at: string;
  customer: { id: string; name: string; email: string };
  assigned_agent: string;
  messages: TicketMessage[];
  /** Campo interno: la interfaz nunca lo pinta, pero la API lo envía igualmente. */
  internal_notes: string[];
}

function buildTickets(): Ticket[] {
  return [
    {
      id: 427,
      subject: "[INTERNO] Escalado: accesos cruzados a tickets",
      status: "escalado",
      created_at: "2026-09-22T09:14:00Z",
      customer: { id: "usr_0001", name: "Equipo de soporte Nimbo", email: "soporte-interno@nimbo.test" },
      assigned_agent: "Seguridad Nimbo",
      messages: [
        {
          from: "Rubén (soporte N2)",
          role: "agente",
          at: "2026-09-22T09:14:00Z",
          body: "Un cliente dice que al recargar la página vio un ticket que no era suyo. Lo escalo a seguridad para que revisen la API de tickets.",
        },
        {
          from: "Seguridad Nimbo",
          role: "agente",
          at: "2026-09-22T11:02:00Z",
          body: "Recibido. Mientras lo revisamos, NO compartáis capturas de este ticket.",
        },
      ],
      internal_notes: [`Si puedes leer esto sin ser del equipo, el problema es real. Código de auditoría: ${getFlag("level-4")}`],
    },
    {
      id: 428,
      subject: "Factura duplicada en agosto",
      status: "cerrado",
      created_at: "2026-09-22T16:40:00Z",
      customer: { id: "usr_7310", name: "Nerea Castillo", email: "nerea.castillo@correo.test" },
      assigned_agent: "Lorena (soporte N1)",
      messages: [
        { from: "Nerea Castillo", role: "cliente", at: "2026-09-22T16:40:00Z", body: "Me habéis cobrado dos veces el plan de agosto." },
        { from: "Lorena (soporte N1)", role: "agente", at: "2026-09-23T08:05:00Z", body: "Tienes razón, ya está devuelto. Perdona las molestias." },
      ],
      internal_notes: ["Reembolso #R-5512 emitido."],
    },
    {
      id: 429,
      subject: "Cambiar el correo de mi cuenta",
      status: "esperando cliente",
      created_at: "2026-09-23T10:20:00Z",
      customer: { id: "usr_6604", name: "Iván Ferrer", email: "ivan.ferrer@correo.test" },
      assigned_agent: "Lorena (soporte N1)",
      messages: [
        { from: "Iván Ferrer", role: "cliente", at: "2026-09-23T10:20:00Z", body: "Quiero cambiar el correo asociado a mi cuenta." },
        { from: "Lorena (soporte N1)", role: "agente", at: "2026-09-23T10:41:00Z", body: "Claro. ¿Puedes confirmarlo desde el correo antiguo?" },
      ],
      internal_notes: [],
    },
    {
      id: 430,
      subject: "No puedo entrar después de cambiar la contraseña",
      status: "abierto",
      created_at: "2026-09-24T18:02:00Z",
      customer: { id: "usr_5120", name: "Pablo Serrano", email: "pablo.serrano@correo.test" },
      assigned_agent: "Rubén (soporte N2)",
      messages: [
        { from: "Pablo Serrano", role: "cliente", at: "2026-09-24T18:02:00Z", body: "Cambié la contraseña y ahora la app me echa todo el rato." },
        {
          from: "Rubén (soporte N2)",
          role: "agente",
          at: "2026-09-25T09:30:00Z",
          body: "Estamos investigando algo parecido con otro cliente. Lo tengo relacionado con el ticket interno #427.",
        },
      ],
      internal_notes: ["Relacionado con #427 (escalado a seguridad)."],
    },
    {
      id: 431,
      subject: "Las fotos del móvil no se sincronizan",
      status: "esperando cliente",
      created_at: "2026-09-26T19:47:00Z",
      customer: { id: CURRENT_USER.id, name: CURRENT_USER.name, email: CURRENT_USER.email },
      assigned_agent: "Lorena (soporte N1)",
      messages: [
        {
          from: CURRENT_USER.name,
          role: "cliente",
          at: "2026-09-26T19:47:00Z",
          body: "Desde ayer las fotos del móvil no aparecen en Nimbo. La app dice «sincronizado», pero no están.",
        },
        {
          from: "Lorena (soporte N1)",
          role: "agente",
          at: "2026-09-27T08:12:00Z",
          body: "Hola, Andrea. ¿Puedes decirnos qué versión de la app tienes? La encontrarás en Ajustes → Acerca de.",
        },
        { from: "Nimbo", role: "sistema", at: "2026-09-27T08:12:05Z", body: "Estado cambiado a «esperando cliente»." },
      ],
      internal_notes: ["Cliente con plan Familiar. Si no responde en 72 h, cerrar ticket."],
    },
  ];
}

const TICKETS: readonly Ticket[] = buildTickets();

/** ⚠️ VULNERABLE A PROPÓSITO: devuelve cualquier ticket, sea de quien sea. */
export function getTicketById(rawId: string): Ticket | null {
  if (!/^\d{1,9}$/.test(rawId)) return null;
  const id = Number(rawId);
  return TICKETS.find((t) => t.id === id) ?? null;
}

/** Versión correcta: solo tickets propios y sin campos internos. */
export function getTicketForCustomer(rawId: string, customerId: string) {
  const ticket = getTicketById(rawId);
  if (!ticket || ticket.customer.id !== customerId) return null;
  const { internal_notes: _internal, ...publicTicket } = ticket;
  return publicTicket;
}
