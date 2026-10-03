import Link from "next/link";
import { LabFrame } from "@/components/lab/LabFrame";
import { GUEST, bookingsOfGuest } from "@/scenarios/faro/bookings";

export const metadata = { title: "Hotel Faro Azul", robots: { index: false } };
const ACCENT = "#0d9488";

export default function FaroHome() {
  const bookings = bookingsOfGuest(GUEST.id);
  return (
    <LabFrame
      brand="Faro Azul"
      accent={ACCENT}
      backHref="/web/checkpoint-1"
      nav={<span className="text-sm text-slate-500">{GUEST.name}</span>}
    >
      <h1 className="text-2xl font-bold text-slate-900">Mis reservas</h1>
      <p className="mt-1 text-sm text-slate-500">Área de huéspedes · {GUEST.email}</p>

      <ul className="mt-5 space-y-3">
        {bookings.map((b) => (
          <li key={b.code} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">{b.room}</p>
                <p className="text-sm text-slate-500">
                  {b.checkIn} → {b.checkOut} · reserva {b.code}
                </p>
              </div>
              <Link href={`/labs/faro/factura/${b.code}`} className="text-sm font-medium" style={{ color: "var(--brand)" }}>
                Ver factura →
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-3">
        <Link href="/labs/faro/recepcion" className="text-sm text-slate-600 hover:underline">
          Acceso recepción
        </Link>
      </div>
    </LabFrame>
  );
}
