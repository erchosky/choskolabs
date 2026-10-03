"use client";

import { useEffect, useState } from "react";

interface Message {
  from: string;
  role: string;
  at: string;
  body: string;
}
interface TicketData {
  id: number;
  subject: string;
  status: string;
  customer: { name: string };
  assigned_agent: string;
  messages: Message[];
}

/**
 * La página pide el ticket a la API por detrás (fetch). El id del ticket del
 * usuario está fijado aquí; el jugador descubrirá la petición en Network.
 */
export function TicketView({ ticketId }: { ticketId: number }) {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/labs/nimbo/tickets/${ticketId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: TicketData) => setTicket(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [ticketId]);

  if (loading) return <p className="text-sm text-slate-500">Cargando tu ticket…</p>;
  if (error || !ticket) return <p className="text-sm text-red-600">No se pudo cargar el ticket.</p>;

  return (
    <article className="rounded-lg border border-slate-200 bg-white">
      <header className="border-b border-slate-100 p-4">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-slate-900">{ticket.subject}</h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{ticket.status}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Ticket #{ticket.id} · atendido por {ticket.assigned_agent}
        </p>
      </header>
      <ul className="divide-y divide-slate-100">
        {ticket.messages.map((m, i) => (
          <li key={i} className="p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">{m.from}</span>
              <span>· {new Date(m.at).toLocaleString("es-ES")}</span>
            </div>
            <p className="mt-1 text-sm text-slate-800">{m.body}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
