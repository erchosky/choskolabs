import { getTicketById } from "@/scenarios/nimbo/tickets";

// ⚠️ Fallo educativo: devuelve cualquier ticket por id, con todos sus campos
// (incluidas internal_notes), sin comprobar de quién es.
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: RouteContext<"/api/labs/nimbo/tickets/[id]">) {
  const { id } = await params;
  const ticket = getTicketById(id);
  if (!ticket) {
    return Response.json({ error: "Ticket no encontrado" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  return Response.json(ticket, { headers: { "Cache-Control": "no-store" } });
}
