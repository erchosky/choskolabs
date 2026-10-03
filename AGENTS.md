<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# ChoskoLabs — para agentes (incluido Codex)

> **No asumas que recuerdas nada de este proyecto.** El repositorio es su propia memoria: todo el
> contexto necesario está en `docs/`. Reconstrúyelo leyendo, no de conversaciones anteriores.

## Protocolo antes de modificar ChoskoLabs
1. Lee `docs/PROJECT_CONTEXT.md` (qué es y por qué; ~5 min).
2. Lee `docs/CURRENT_STATE.md` (qué existe ahora mismo).
3. Lee `docs/SESSION_HANDOFF.md` (dónde terminó la última sesión).
4. Lee `docs/VISION.md`.
5. Lee `docs/CURRICULUM.md` cuando el cambio afecte al contenido educativo.
6. Lee `docs/LAB_STANDARD.md` cuando el cambio afecte a labs.
7. Lee `docs/ARCHITECTURE.md` cuando el cambio afecte a código/infraestructura.
8. Lee `docs/SECURITY.md` cuando afecte a labs/backend/seguridad.
9. Consulta `docs/DECISIONS.md` antes de revertir una decisión importante.

Después: **inspecciona el código real.** La documentación orienta; el código confirma. Orden de
autoridad si algo se contradice: código > docs > tests > `DECISIONS.md` > `SESSION_HANDOFF.md` >
conversaciones. Si una conversación antigua contradice el proyecto actual, **gana el proyecto**.

Para una auditoría, empieza por `docs/AUDIT_HANDOFF.md`.

## Al terminar una sesión importante
Actualiza `docs/CURRENT_STATE.md` y `docs/SESSION_HANDOFF.md`. Si cambió una decisión importante,
regístrala en `docs/DECISIONS.md` y corrige la documentación afectada (no dejes docs contradictorios;
una doc incorrecta es peor que ninguna). No conviertas una idea conversada en requisito sin más:
distingue CORE / CURRENT / PLANNED / EXPERIMENTAL / FUTURE.

## Proteger la visión
Ante una funcionalidad nueva, pregúntate: ¿ayuda a aprender ciberseguridad?, ¿mejora la experiencia
de jugar?, ¿ayuda a entender?, ¿reduce fricción? Si la respuesta es no, probablemente no la
necesitamos aún (rankings, monedas, tienda, chat, social, skins… no son prioritarios).

## Comandos
```bash
pnpm install
pnpm dev         # desarrollo
pnpm lint        # ESLint
pnpm typecheck   # next typegen + tsc --noEmit (TypeScript strict)
pnpm test        # Vitest
pnpm build       # build de producción
```

## Estructura (resumen)
- `src/app` — rutas: portal (`web`, `progreso`), labs ficticios (`labs/<marca>`), APIs (`api`).
- `src/content` — contenido educativo. **Viaja al cliente: nunca metas flags aquí.**
- `src/scenarios/<marca>` — datos y lógica `server-only` de cada fallo educativo.
- `src/server/flags.ts` — flags + validación (`server-only`).
- `src/progress` — modelo de progreso, repositorio local y lógica pura de desbloqueo.
- `src/components` — `ui`, `portal`, `lab`, `tutorial`.

## Decisiones críticas
- **Reto primero, explicación después.** No spoilees la técnica antes de resolver.
- **Browser-first.** Nada de instalar herramientas para la ruta principal.
- **El portal no es el objetivo vulnerable.** Fallos ficticios, controlados, sin terceros ni host.
- **Flags solo en el servidor.** `server-only` lo garantiza; hay un test que lo verifica.
- **Sin sobreingeniería.** Nada de cuentas, Supabase, IA, Docker en v0.1.
- Añadir un nivel = definición en `content/labs`, escenario en `scenarios`, flag en `server/flags`,
  registro en `content/curriculum.ts`. Cumple `docs/LAB_STANDARD.md`.
- Antes de dar algo por terminado, ejecuta lint + typecheck + test + build. **Nunca digas "debería
  funcionar": verifícalo.**
