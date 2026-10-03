# DECISIONS

Registro de **decisiones importantes** que un agente futuro podría cuestionar o revertir. No se
registran cambios triviales (padding, nombres, colores). Antes de revertir cualquiera de estas,
entiende primero su motivo. La historia permanente vive aquí + en Git.

Formato: Decisión · Motivo · Alternativas · Consecuencias · Revisar si…

---

## 2026-09-27 — v0.1 sin cuentas ni backend persistente
- **Decisión:** El progreso se guarda solo en localStorage; no hay login ni base de datos.
- **Motivo:** Validar primero la experiencia educativa y reducir superficie de backend.
- **Alternativas:** Supabase/DB desde el inicio.
- **Consecuencias:** No hay progreso entre dispositivos; el desbloqueo es client-side.
- **Revisar si:** Necesitamos progreso sincronizado, usuarios reales o analítica de aprendizaje.
  (El `ProgressRepository` ya está preparado para una implementación remota.)

## 2026-09-27 — Browser-first (click and hack)
- **Decisión:** La ruta principal se juega solo con el navegador; nada de instalar herramientas.
- **Motivo:** Eliminar fricción para principiantes; es parte de la identidad del producto.
- **Alternativas:** Pedir Kali/VMs/Docker/CLI desde el principio.
- **Consecuencias:** Los fallos deben ser reproducibles con navegador + DevTools; los labs que
  requieren aislamiento real quedan para el futuro.
- **Revisar si:** Una categoría avanzada (SQLi real, SSRF, Linux) necesita herramientas o sandbox.

## 2026-09-27 — Sin IA integrada en v0.1
- **Decisión:** Todo el contenido educativo es estático; sin GPT/Claude en la plataforma.
- **Motivo:** No es necesaria para demostrar el producto y añadiría coste/dependencia por petición.
- **Alternativas:** "Explícamelo de otra forma" con IA.
- **Consecuencias:** El contenido debe estar bien escrito de antemano.
- **Revisar si:** Queremos explicaciones adaptativas y el coste está justificado.

## 2026-09-27 — El concepto técnico se revela DESPUÉS de resolver
- **Decisión:** El nombre de la técnica (IDOR, etc.) y la teoría van en el post-lab, no antes.
- **Motivo:** No spoilear el proceso de descubrimiento, que es donde se aprende.
- **Alternativas:** Anunciar el tema del nivel al principio.
- **Consecuencias:** Escenarios y misiones deben describir sin nombrar la vulnerabilidad.
- **Revisar si:** Nunca sin una razón pedagógica fuerte; es núcleo del producto.

## 2026-09-27 — Escenario distinto por nivel
- **Decisión:** Cada nivel usa una "empresa" ficticia diferente, sin universo narrativo común.
- **Motivo:** Fomenta la transferencia y evita memorizar un contexto concreto.
- **Alternativas:** Una sola app ficticia para todo el curso.
- **Consecuencias:** Más trabajo de diseño de escenarios; más variedad y realismo.
- **Revisar si:** La dispersión perjudicara el hilo del curso (no observado).

## 2026-09-27 — Calidad de labs > cantidad
- **Decisión:** Pocos niveles excelentes en lugar de muchos mediocres. v0.1 = 1 tutorial + 5 + 1 checkpoint.
- **Motivo:** Cinco niveles excelentes enseñan más que cincuenta vacíos.
- **Alternativas:** Rellenar con muchos niveles rápidos.
- **Consecuencias:** Expansión lenta y deliberada; cada lab pasa `LAB_STANDARD.md`.
- **Revisar si:** Nunca a costa de bajar el listón de calidad.

## 2026-09-27 — Las flags viven solo en el servidor (`server-only`)
- **Decisión:** Flags en `src/server/flags.ts` con `server-only`; validación en `/api/flags/verify`.
  `src/content` (que viaja al cliente) nunca contiene flags reales; un test lo verifica.
- **Motivo:** Evitar que las flags aparezcan en el bundle/props del navegador.
- **Alternativas:** Validación client-side / flags en el contenido.
- **Consecuencias:** Hace falta un mínimo de backend (Route Handlers). Correcto y deseado.
- **Revisar si:** Un nivel cuyo objetivo sea, precisamente, descubrir algo enviado al cliente
  (entonces la "fuga" es intencional y acotada al lab).

## 2026-09-27 — Un solo proyecto Next.js, sin Docker todavía
- **Decisión:** Portal y labs viven en la misma app Next.js; los fallos son ficticios y controlados.
- **Motivo:** Simplicidad y mantenibilidad; los primeros conceptos no requieren aislamiento real.
- **Alternativas:** Contenedores por lab desde el inicio.
- **Consecuencias:** No se pueden incluir aún vulnerabilidades peligrosas (RCE, SSRF real, SQLi
  sobre datos importantes). La separación de capas facilita el salto futuro.
- **Revisar si:** Se incorporan retos que exijan un entorno aislado por reto.

## 2026-09-27 — Stack: Next.js 16 + React 19 + TS strict + Tailwind 4 + Vitest
- **Decisión:** Tecnología conocida y mantenible; única dependencia de runtime añadida: `server-only`.
- **Motivo:** Sencillez, App Router para mezclar UI y backend mínimo, TS strict por calidad.
- **Alternativas:** Vite SPA, Remix, añadir librerías de estado/validación.
- **Consecuencias:** Sin Supabase/Prisma/Redis/GraphQL. El contenido rico usa un renderer propio (`Prose`).
- **Revisar si:** Aparece una necesidad real que la plataforma no cubra (no añadir por añadir).
