import type { Metadata } from "next";
import { CurriculumMap } from "@/components/portal/CurriculumMap";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Web Wargame",
  description: "Capítulos y niveles del Web Wargame de ChoskoLabs.",
};

export default function WebWargamePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Badge tone="accent">Categoría</Badge>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink-50 sm:text-4xl">Web Wargame</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-300">
        Aprende a mirar aplicaciones web como lo haría un auditor. Empieza por el tutorial, juega los niveles en
        orden y, al final, ponte a prueba en el checkpoint. Cada nivel se juega en su propio escenario ficticio.
      </p>
      <div className="mt-10">
        <CurriculumMap />
      </div>
    </div>
  );
}
