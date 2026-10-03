import type { CodeSample } from "@/content/types";

const TONE = {
  vulnerable: { ring: "border-bad/40", label: "text-bad", tag: "Vulnerable" },
  fixed: { ring: "border-ok/40", label: "text-ok", tag: "Corregido" },
  neutral: { ring: "border-ink-600", label: "text-ink-300", tag: "" },
} as const;

export function CodeCompare({ samples }: { samples: CodeSample[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {samples.map((sample, i) => {
        const tone = TONE[sample.tone];
        return (
          <figure key={i} className={`overflow-hidden rounded-lg border ${tone.ring} bg-ink-950`}>
            <figcaption className="flex items-center justify-between border-b border-ink-700 px-3 py-2">
              <span className="text-sm font-medium text-ink-100">{sample.title}</span>
              {tone.tag && <span className={`font-mono text-[11px] uppercase ${tone.label}`}>{tone.tag}</span>}
            </figcaption>
            <pre className="overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed text-ink-100">
              <code>{sample.code}</code>
            </pre>
          </figure>
        );
      })}
    </div>
  );
}
