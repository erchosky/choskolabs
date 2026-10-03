import { LabFrame } from "@/components/lab/LabFrame";
import { CURRENT_TICKET_ID, CURRENT_USER } from "@/scenarios/nimbo/tickets";
import { TicketView } from "./TicketView";

export const metadata = { title: "Nimbo — Soporte", robots: { index: false } };
const ACCENT = "#0ea5e9";

export default function NimboSupport() {
  return (
    <LabFrame
      brand="Nimbo"
      accent={ACCENT}
      backHref="/web/level-4"
      nav={<span className="text-sm text-slate-500">{CURRENT_USER.name}</span>}
    >
      <p className="text-sm text-slate-500">Centro de soporte</p>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Tu conversación</h2>
      <TicketView ticketId={CURRENT_TICKET_ID} />
      <p className="mt-4 text-xs text-slate-400">¿No se resuelve? Nuestro equipo suele responder en menos de 24 h.</p>
    </LabFrame>
  );
}
