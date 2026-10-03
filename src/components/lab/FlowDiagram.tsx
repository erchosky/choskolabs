import type { FlowStep } from "@/content/types";

/** Diagrama vertical navegador↔servidor. Resalta el paso donde está el fallo. */
export function FlowDiagram({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="space-y-2">
      {steps.map((step, i) => (
        <li
          key={i}
          className={`flex items-start gap-3 rounded-lg border p-3 ${
            step.highlight ? "border-bad/50 bg-bad-soft" : "border-ink-700 bg-ink-800/50"
          }`}
        >
          <span
            className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-xs ${
              step.highlight ? "bg-bad/20 text-bad" : "bg-ink-700 text-ink-300"
            }`}
          >
            {i + 1}
          </span>
          <div className="min-w-0">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-400">{step.actor}</span>
            <p className={`text-sm ${step.highlight ? "font-medium text-ink-50" : "text-ink-100"}`}>{step.action}</p>
            {step.detail && (
              <p className={`mt-0.5 text-xs ${step.highlight ? "text-bad" : "text-ink-400"}`}>{step.detail}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
