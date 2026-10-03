import Link from "next/link";
import { cookies } from "next/headers";
import { LabFrame } from "@/components/lab/LabFrame";
import { getManagementData, hasManagementAccess, parseRole, ROLE_COOKIE } from "@/scenarios/colmena/session";

export const metadata = { title: "Colmena — Gestión", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ColmenaManagement() {
  // ⚠️ Fallo educativo: el privilegio se decide con una cookie que controla el cliente.
  const store = await cookies();
  const role = parseRole(store.get(ROLE_COOKIE)?.value);

  if (!hasManagementAccess(role)) {
    return (
      <LabFrame brand="Colmena" accent="#d97706" backHref="/web/level-5">
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
          <p className="text-slate-700">Esta zona es solo para el personal del coworking.</p>
          <p className="mt-1 text-sm text-slate-500">Tu rol actual es «{role ?? "sin definir"}».</p>
          <Link href="/labs/colmena" className="mt-3 inline-block text-sm" style={{ color: "var(--brand)" }}>
            Volver
          </Link>
        </div>
      </LabFrame>
    );
  }

  const data = getManagementData();
  return (
    <LabFrame brand="Colmena" accent="#d97706" backHref="/web/level-5" nav={<Link href="/labs/colmena" className="text-sm text-slate-500 hover:underline">← Inicio</Link>}>
      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Gestión · personal</span>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Panel del coworking</h1>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Ocupación ahora</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{data.occupancy}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Llaves entregadas</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{data.keysOut}</p>
        </div>
      </div>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">Reservas de hoy</h2>
      <ul className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
        {data.bookingsToday.map((b, i) => (
          <li key={i} className="flex justify-between px-4 py-2 text-sm">
            <span className="text-slate-800">{b.room} · {b.who}</span>
            <span className="text-slate-500">{b.time}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-md bg-slate-900 p-4 font-mono text-sm text-slate-100">
        <p className="text-slate-400"># Código de la puerta principal (uso del personal)</p>
        <p className="mt-1 select-all break-all text-amber-300">{data.doorCode}</p>
      </div>
    </LabFrame>
  );
}
