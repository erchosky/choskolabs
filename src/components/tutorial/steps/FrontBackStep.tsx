"use client";

import { useState } from "react";

interface Task {
  id: string;
  text: string;
  answer: "front" | "back";
}

const TASKS: Task[] = [
  { id: "t1", text: "Pintar los botones y los colores", answer: "front" },
  { id: "t2", text: "Comprobar si tienes permiso para ver un pedido", answer: "back" },
  { id: "t3", text: "Mostrar un mensaje de «cargando…»", answer: "front" },
  { id: "t4", text: "Decidir el precio final que se cobra", answer: "back" },
];

/** Minijuego 3: clasifica tareas en frontend / backend. */
export function FrontBackStep({ onComplete, done }: { onComplete: () => void; done: boolean }) {
  const [placed, setPlaced] = useState<Record<string, "front" | "back">>({});

  function place(task: Task, where: "front" | "back") {
    const next = { ...placed, [task.id]: where };
    setPlaced(next);
    const allRight = TASKS.every((t) => next[t.id] === t.answer);
    if (allRight) onComplete();
  }

  return (
    <div>
      <ul className="space-y-2">
        {TASKS.map((task) => {
          const choice = placed[task.id];
          const correct = choice === task.answer;
          return (
            <li
              key={task.id}
              className={`rounded-lg border p-3 ${
                choice ? (correct ? "border-ok/40 bg-ok-soft" : "border-bad/40 bg-bad-soft") : "border-ink-700 bg-ink-800/50"
              }`}
            >
              <p className="text-sm text-ink-100">{task.text}</p>
              <div className="mt-2 flex gap-2">
                {(["front", "back"] as const).map((where) => (
                  <button
                    key={where}
                    type="button"
                    onClick={() => place(task, where)}
                    className={`rounded-md border px-3 py-1 text-xs ${
                      choice === where
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-ink-600 text-ink-300 hover:bg-ink-800"
                    }`}
                  >
                    {where === "front" ? "Frontend (mostrar)" : "Backend (decidir/permitir)"}
                  </button>
                ))}
                {choice && !correct && <span className="self-center text-xs text-bad">Prueba otra vez</span>}
              </div>
            </li>
          );
        })}
      </ul>
      {done && <p className="mt-3 text-xs text-ok">¡Todo en su sitio! Mostrar es cosa del frontend; permitir, del backend.</p>}
    </div>
  );
}
