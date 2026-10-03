import type { LabStatus } from "@/progress/unlock";

const MAP: Record<LabStatus, { label: string; className: string }> = {
  completed: { label: "Completado", className: "border-ok/40 bg-ok-soft text-ok" },
  current: { label: "Empieza aquí", className: "border-accent/50 bg-accent-soft text-accent" },
  available: { label: "Disponible", className: "border-info/40 bg-info-soft text-info" },
  locked: { label: "Bloqueado", className: "border-ink-600 bg-ink-800 text-ink-400" },
};

export function StatusPill({ status }: { status: LabStatus }) {
  const { label, className } = MAP[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium ${className}`}>
      {status === "completed" && <span aria-hidden="true">✓</span>}
      {status === "locked" && <span aria-hidden="true">🔒</span>}
      {label}
    </span>
  );
}
