# Session Handoff

**Fecha:** 2026-09-27 · **Sesión:** Construcción inicial de ChoskoLabs v0.1 (Claude Code).

> Este archivo refleja **dónde terminó la última sesión importante**. No es un diario histórico: la
> próxima sesión importante puede reemplazar su contenido. La historia permanente vive en Git +
> [`DECISIONS.md`](DECISIONS.md).

## Qué se hizo
- Se creó ChoskoLabs v0.1 desde cero: proyecto Next.js 16 + React 19 + TS strict + Tailwind 4 + Vitest.
- Sistema base: modelo de contenido, progreso (localStorage + lógica pura), flags server-only y su API.
- Portal: home, mapa Web Wargame, página de nivel, página de progreso.
- Level 0 (tutorial jugable, 5 minijuegos), Levels 1–5 y Checkpoint 1, con post-labs completos.
- 6 laboratorios ficticios vulnerables (Voltio, PulsoFit, Taquilla, Nimbo, Colmena, Faro).
- Documentación: README, VISION, CURRICULUM, LAB_STANDARD, CONTENT_GUIDE, ARCHITECTURE, SECURITY,
  ROADMAP, AUDIT_HANDOFF, AGENTS.md, CLAUDE.md y los 4 docs de continuidad (PROJECT_CONTEXT,
  CURRENT_STATE, DECISIONS, SESSION_HANDOFF).

## Archivos/áreas importantes
- Contenido educativo: `src/content/` (`curriculum.ts`, `labs/*.ts`, `types.ts`).
- Escenarios (fallos, server-only): `src/scenarios/<marca>/`.
- Flags: `src/server/flags.ts`; validación: `src/app/api/flags/verify/route.ts`.
- Progreso: `src/progress/` (`repository.ts`, `logic.ts`, `unlock.ts`, `store.ts`).
- Experiencia de nivel: `src/components/lab/`; tutorial: `src/components/tutorial/`.
- Labs (UI ficticia): `src/app/labs/<marca>/`.

## Decisiones tomadas
Registradas en [`DECISIONS.md`](DECISIONS.md): sin cuentas, browser-first, sin IA, revelar el
concepto después, escenario por nivel, calidad > cantidad, flags server-only, un solo proyecto sin
Docker, stack elegido.

## Qué funciona
Todo el flujo v0.1: jugar Level 0 → desbloquear y jugar Levels 1–5 → Checkpoint → post-labs →
progreso persistente/reinicio. Verificado en navegador y por `curl` sobre las APIs. Confirmado que
**ninguna flag real aparece en `.next/static`** (bundle cliente).

## Qué no funciona / limitaciones
- Desbloqueo de niveles es client-side (se puede saltar por URL). Aceptado en v0.1.
- Sin persistencia entre dispositivos ni tests e2e/render. Solo español.

## Qué falta (siguiente fase)
Feedback real de usuarios, afinar post-labs, más niveles/checkpoints, accesibilidad revisada a mano,
y eventualmente cuentas/persistencia (ver `ROADMAP.md`).

## Errores conocidos
Ninguno bloqueante. Ver "Problemas conocidos" en [`CURRENT_STATE.md`](CURRENT_STATE.md).

## Tests ejecutados (resultado)
- `pnpm lint` → OK · `pnpm typecheck` → OK · `pnpm test` → **52 passed** · `pnpm build` → OK (21 rutas).

## Siguiente paso recomendado
Ejecutar `pnpm dev`, jugar el recorrido completo Level 0 → Checkpoint y anotar dónde el post-lab
pueda ser más claro. Luego decidir los siguientes 2–3 niveles con `CURRICULUM.md` + `LAB_STANDARD.md`.

## Contexto necesario para continuar
- El repositorio git existe (lo inició create-next-app) pero **no se ha hecho commit** en esta sesión.
- Para añadir un nivel: definición en `content/labs` → escenario en `scenarios` → flag en
  `server/flags` → registro en `content/curriculum.ts`; cumplir `LAB_STANDARD.md`.
- Antes de tocar nada, sigue el protocolo de `AGENTS.md` (leer PROJECT_CONTEXT, CURRENT_STATE,
  SESSION_HANDOFF, VISION y los docs según el área). La documentación orienta; **el código confirma**.
