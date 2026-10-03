import Link from "next/link";
import { LabFrame } from "@/components/lab/LabFrame";
import { GUEST, receptionAccessFor } from "@/scenarios/faro/bookings";

export const metadata = { title: "Faro Azul — Recepción", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function FaroReception() {
  // Esta zona SÍ está bien protegida: el rol lo decide el servidor, no el cliente.
  const access = receptionAccessFor(GUEST.id);
  return (
    <LabFrame brand="Faro Azul" accent="#0d9488" backHref="/web/checkpoint-1" nav={<Link href="/labs/faro" className="text-sm text-slate-500 hover:underline">← Mis reservas</Link>}>
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
        <p className="text-slate-700">
          {access === "denied"
            ? "Acceso restringido al personal de recepción."
            : "Bienvenido, recepción."}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Tu cuenta de huésped no tiene permisos de recepción. (Esta comprobación se hace en el servidor.)
        </p>
      </div>
    </LabFrame>
  );
}
