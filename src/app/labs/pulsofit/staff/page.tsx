import Link from "next/link";
import { LabFrame } from "@/components/lab/LabFrame";
import { getStaffPanelData } from "@/scenarios/pulsofit/data";

export const metadata = { title: "PulsoFit — Personal", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function PulsoFitStaff() {
  // ⚠️ Fallo educativo: la ruta no comprueba el rol de la sesión.
  const data = getStaffPanelData();
  return (
    <LabFrame brand="PulsoFit" accent="#16a34a" backHref="/web/level-2" nav={<Link href="/labs/pulsofit" className="text-sm text-slate-500 hover:underline">← Inicio</Link>}>
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">Panel del personal</span>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Gestión del centro</h1>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Caja de hoy</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{data.todayCash}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Incidencias pendientes</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{data.pendingIncidents}</p>
        </div>
      </div>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">Exportaciones</h2>
      <ul className="mt-2 space-y-2">
        {data.exports.map((exp) => (
          <li key={exp} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-2 text-sm">
            <span className="text-slate-700">{exp}</span>
            <span className="text-slate-400">Descargar</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-md bg-slate-900 p-4 font-mono text-sm text-slate-100">
        <p className="text-slate-400"># Código de apertura del torno (uso interno)</p>
        <p className="mt-1 select-all break-all text-green-300">{data.openingCode}</p>
      </div>
    </LabFrame>
  );
}
