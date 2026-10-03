import { Fragment, type ReactNode } from "react";
import type { Block, Rich } from "@/content/types";

/**
 * Renderiza el texto enriquecido mínimo del contenido educativo.
 * Soporta: párrafos, `código en línea`, **negrita**, listas, bloques de código y notas.
 * Sin dependencias ni HTML arbitrario (no hay dangerouslySetInnerHTML).
 */

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*)/g;

export function renderInline(text: string): ReactNode {
  const parts = text.split(INLINE);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return (
        <code key={i} className="rounded bg-ink-700/80 px-1.5 py-0.5 font-mono text-[0.88em] text-accent-strong">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 3) {
      return (
        <strong key={i} className="font-semibold text-ink-50">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const NOTE_TONE = {
  info: "border-info/40 bg-info-soft text-ink-100",
  warn: "border-accent/40 bg-accent-soft text-ink-100",
  ok: "border-ok/40 bg-ok-soft text-ink-100",
} as const;

function BlockView({ block }: { block: Block }) {
  if (typeof block === "string") {
    return <p>{renderInline(block)}</p>;
  }
  if ("list" in block) {
    const items = block.list.map((item, i) => (
      <li key={i} className="pl-1">
        {renderInline(item)}
      </li>
    ));
    return block.ordered ? (
      <ol className="list-decimal space-y-1.5 pl-5 marker:text-ink-400">{items}</ol>
    ) : (
      <ul className="list-disc space-y-1.5 pl-5 marker:text-ink-500">{items}</ul>
    );
  }
  if ("code" in block) {
    return (
      <figure>
        {block.caption && <figcaption className="mb-1.5 text-xs text-ink-300">{block.caption}</figcaption>}
        <pre className="overflow-x-auto rounded-lg border border-ink-600 bg-ink-950 p-3.5 font-mono text-[13px] leading-relaxed text-ink-100">
          <code>{block.code}</code>
        </pre>
      </figure>
    );
  }
  return <div className={`rounded-lg border px-3.5 py-2.5 ${NOTE_TONE[block.tone ?? "info"]}`}>{renderInline(block.note)}</div>;
}

export function Prose({ content, className = "" }: { content: Rich; className?: string }) {
  const blocks = typeof content === "string" ? [content] : content;
  return (
    <div className={`space-y-3 leading-relaxed text-ink-200 ${className}`}>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}
