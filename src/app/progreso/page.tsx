import type { Metadata } from "next";
import { ProgressDashboard } from "@/components/portal/ProgressDashboard";

export const metadata: Metadata = {
  title: "Tu progreso",
  description: "Revisa tu avance en el Web Wargame y reinícialo si quieres.",
};

export default function ProgresoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink-50">Tu progreso</h1>
      <p className="mt-2 text-ink-300">Todo lo que llevas en el Web Wargame, guardado en este navegador.</p>
      <div className="mt-8">
        <ProgressDashboard />
      </div>
    </div>
  );
}
