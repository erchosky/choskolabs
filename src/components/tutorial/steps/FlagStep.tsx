"use client";

import { useState } from "react";

/** Minijuego 5: reconoce el formato de una flag escribiéndola. */
export function FlagStep({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  const [value, setValue] = useState("");
  const looksLikeFlag = /^flag\{[^{}\s]+\}$/.test(value.trim());

  return (
    <div>
      <p className="rounded-lg border border-ink-700 bg-ink-800/50 p-3 text-sm text-ink-200">
        Una flag de ejemplo: <code className="rounded bg-ink-700 px-1.5 py-0.5 font-mono text-accent-strong">flag{"{"}bienvenido_a_choskolabs{"}"}</code>. Escríbela
        abajo para ver que reconoces el formato.
      </p>
      <input
        aria-label="Escribe una flag de ejemplo"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (/^flag\{[^{}\s]+\}$/.test(e.target.value.trim())) onComplete();
        }}
        placeholder="flag{...}"
        className="mt-3 w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2.5 font-mono text-sm text-ink-50 placeholder:text-ink-500 focus:border-accent focus:outline-none"
      />
      <p className={`mt-2 text-xs ${looksLikeFlag || done ? "text-ok" : "text-ink-500"}`}>
        {looksLikeFlag || done
          ? "Eso es una flag: empieza por flag{ y termina en }. En los niveles reales estará escondida."
          : "Escribe algo con el formato flag{...}."}
      </p>
    </div>
  );
}
