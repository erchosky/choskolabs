# CLAUDE.md

Guía para Claude en futuras sesiones sobre ChoskoLabs.

## Antes de trabajar
No asumas que recuerdas el proyecto: el repositorio es su propia memoria. Lee, en orden,
`docs/PROJECT_CONTEXT.md`, `docs/CURRENT_STATE.md`, `docs/SESSION_HANDOFF.md` y `docs/VISION.md`;
luego `CURRICULUM.md`, `LAB_STANDARD.md`, `CONTENT_GUIDE.md`, `ARCHITECTURE.md`, `SECURITY.md` según
el área. Consulta `docs/DECISIONS.md` antes de revertir una decisión importante. El protocolo
completo y los comandos están en `AGENTS.md`. Orden de autoridad: **código > docs > tests >
decisiones > handoff > conversaciones**.

## Al terminar una sesión importante
Actualiza `docs/CURRENT_STATE.md` y `docs/SESSION_HANDOFF.md`; registra decisiones importantes en
`docs/DECISIONS.md` y corrige cualquier doc que haya dejado de ser cierto (no dejes documentación
contradictoria).

## Reglas
- Nunca conviertas ChoskoLabs en un curso pasivo: **reto primero, explicación después**.
- No spoilees la técnica antes de que el jugador la descubra.
- Nada de sobreingeniería. Sin cuentas, Supabase, IA integrada ni Docker en esta fase.
- El portal es seguro; los fallos viven en labs ficticios y controlados, sin terceros ni acceso al host.
- Browser-first: el jugador no instala herramientas para la ruta principal.
- Escenarios realistas y cotidianos; evita ejercicios abstractos.
- No añadas dependencias innecesarias.
- Mantén la documentación **real** (no describas lo que no existe).
- Las flags viven solo en `src/server/flags.ts` (`server-only`). No las metas en `src/content`.
- Ejecuta `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`. Nunca finjas que algo funciona:
  verifícalo (incluso en el navegador cuando aporte).

## Añadir un nivel
Definición en `src/content/labs/<id>.ts` → escenario server-only en `src/scenarios/<marca>/` →
flag en `src/server/flags.ts` → registro en `src/content/curriculum.ts`. Cumple `docs/LAB_STANDARD.md`.
