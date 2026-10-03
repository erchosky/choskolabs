import Link from "next/link";
import { LabFrame } from "@/components/lab/LabFrame";
import { CURRENT_MEMBER, UPCOMING_CLASSES } from "@/scenarios/pulsofit/data";

export const metadata = { title: "PulsoFit — Mi gimnasio", robots: { index: false } };
const ACCENT = "#16a34a";

export default function PulsoFitHome() {
  return (
    <LabFrame
      brand="PulsoFit"
      accent={ACCENT}
      backHref="/web/level-2"
      nav={<span className="text-sm text-slate-500">{CURRENT_MEMBER.name} · Socio</span>}
    >
      <h1 className="text-2xl font-bold text-slate-900">Hola, {CURRENT_MEMBER.name.split(" ")[0]} 👋</h1>
      <p className="mt-1 text-sm text-slate-500">
        {CURRENT_MEMBER.plan} · socio desde {CURRENT_MEMBER.memberSince}
      </p>

      <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
        Algunas funciones (caja, incidencias, exportar socios…) están disponibles solo para el personal del centro.
      </div>

      <h2 className="mt-6 text-lg font-semibold text-slate-900">Próximas clases</h2>
      <ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {UPCOMING_CLASSES.map((c, i) => (
          <li key={i} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="font-medium text-slate-900">{c.name}</p>
              <p className="text-sm text-slate-500">
                {c.day} {c.time} · {c.room}
              </p>
            </div>
            <span className={`text-sm ${c.spots === 0 ? "text-red-600" : "text-slate-600"}`}>
              {c.spots === 0 ? "Completa" : `${c.spots} plazas`}
            </span>
          </li>
        ))}
      </ul>

      <nav className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link href="/labs/pulsofit" className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
          Mis clases
        </Link>
        <Link href="/labs/pulsofit" className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50">
          Mi plan
        </Link>
        {/* Enlace al panel del personal: se oculta a los socios en la interfaz. */}
        <Link
          href="/labs/pulsofit/staff"
          hidden
          data-role="staff-only"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-50"
        >
          Panel del personal
        </Link>
      </nav>
    </LabFrame>
  );
}
