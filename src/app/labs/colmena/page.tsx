import Link from "next/link";
import { LabFrame } from "@/components/lab/LabFrame";
import { MEMBER, ROOMS } from "@/scenarios/colmena/session";
import { RoleCookieInit } from "./RoleCookieInit";

export const metadata = { title: "Colmena Coworking", robots: { index: false } };
const ACCENT = "#d97706";

export default function ColmenaHome() {
  return (
    <LabFrame
      brand="Colmena"
      accent={ACCENT}
      backHref="/web/level-5"
      nav={<span className="text-sm text-slate-500">{MEMBER.name} · Miembro</span>}
    >
      <RoleCookieInit />
      <h1 className="text-2xl font-bold text-slate-900">Reserva de salas</h1>
      <p className="mt-1 text-sm text-slate-500">
        {MEMBER.name} · {MEMBER.plan}
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {ROOMS.map((room) => (
          <li key={room.name} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="font-medium text-slate-900">{room.name}</p>
            <p className="text-sm text-slate-500">{room.seats} plazas</p>
            <p className="mt-2 text-xs text-slate-400">Libre: {room.free}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className="rounded-md px-4 py-2 text-sm font-medium text-white" style={{ background: "var(--brand)" }}>
          Reservar sala
        </button>
        <Link href="/labs/colmena/gestion" className="text-sm text-slate-600 hover:underline">
          Ir a gestión del coworking
        </Link>
      </div>
      <p className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
        La gestión del coworking (ocupación, llaves, códigos de puerta) está reservada al personal.
      </p>
    </LabFrame>
  );
}
