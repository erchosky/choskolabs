# Estado actual

**Última actualización:** 2026-09-27
**Versión:** v0.1-dev

Responde a: *"¿qué tenemos ahora mismo?"*. Distingue siempre **CURRENT** (existe) de **PLANNED** /
**FUTURE** (no existe todavía). No escribas aspiraciones como si fueran funcionalidades reales.

## Funcional (CURRENT — verificado)
- Home con propuesta de valor, "cómo funciona" y categorías.
- Portal Web Wargame (`/web`): mapa de capítulos con estados bloqueado/disponible/actual/completado.
- Level 0: tutorial jugable con 5 minijuegos interactivos.
- Levels 1–5: escenario, misión, abrir laboratorio, input de flag, 3 pistas + "estoy perdido",
  ver solución y post-lab completo (9 secciones, 3 profundidades, micro-pregunta).
- Checkpoint 1: pistas bloqueadas hasta confirmar intento.
- 6 laboratorios ficticios vulnerables funcionando (ver tabla).
- Validación de flags server-side (`POST /api/flags/verify`).
- Progreso local (localStorage) con desbloqueo en cadena, "continuar", dashboard y reinicio.
- Página de progreso (`/progreso`).
- `pnpm lint`, `pnpm typecheck`, `pnpm test` (52 tests) y `pnpm build` en verde.

## Parcialmente funcional / con matices
- **Desbloqueo de niveles:** se aplica en cliente (`LockGate`). Es guía pedagógica, **no** una
  barrera de seguridad: se puede saltar navegando directo a la URL. Aceptado en v0.1.
- **Tutorial "repasar de nuevo":** reinicia el estado local del tutorial; funcional pero simple.

## No implementado (a propósito en v0.1)
- Cuentas, backend persistente, progreso entre dispositivos.
- IA integrada, pagos, rankings, monedas, badges, social/chat, tienda.
- Docker / labs aislados por contenedor.
- Otras categorías (Linux, redes, cripto, forense, OSINT, cloud, APIs, mobile, reversing…).
- i18n: solo español.

## Labs existentes

| Lab | Estado | Concepto (revelado en post-lab) | Cómo funciona el fallo | Limitaciones |
| --- | --- | --- | --- | --- |
| **Voltio** (L1) | Funcional | IDOR / Broken Access Control | `getOrderForViewer` sirve un pedido por id sin comprobar propietario | Datos en memoria; flag visible en el recurso al reproducir el fallo |
| **PulsoFit** (L2) | Funcional | Control de acceso a nivel de función | Enlace `hidden` a `/staff`; la ruta no comprueba rol | Datos en memoria |
| **Taquilla** (L3) | Funcional | Parameter tampering / client-side trust | `POST /checkout` confía en el `price` del cliente | Sin cobro/pasarela reales (simulado) |
| **Nimbo** (L4) | Funcional | BOLA + exposición de datos en API | `GET /tickets/[id]` devuelve tickets ajenos con `internal_notes` | Datos en memoria |
| **Colmena** (L5) | Funcional | Confiar en estado del cliente para autorización | Rol en cookie `colmena_role` (Path=/labs/colmena) editable | Cookie sembrada por el cliente |
| **Faro** (CP1) | Funcional | IDOR en facturas (transferencia) | Factura por código sin comprobar propietario; recepción SÍ protegida | Datos en memoria |

## Infraestructura (CURRENT)
Una sola app Next.js 16 (App Router) + React 19 + TS strict + Tailwind 4. Sin servicios externos,
sin base de datos, sin Docker. Cabeceras de seguridad básicas en `next.config.ts`.

## Persistencia (CURRENT)
Solo **localStorage** vía `LocalProgressRepository` (abstracción `ProgressRepository`). Parsing
defensivo que descarta datos corruptos. Los datos de cada lab se reconstruyen en memoria por request;
no hay persistencia entre labs ni entre dispositivos.

## Tests
`pnpm test` → 52 tests en 5 archivos:
- `src/server/flags.test.ts` — validación de flags (correcta, incorrecta, formato, otro nivel…).
- `src/progress/progress.test.ts` — repositorio y transiciones puras del progreso.
- `src/progress/unlock.test.ts` — desbloqueo en cadena.
- `src/content/curriculum.test.ts` — integridad del curriculum + **ninguna flag real en el contenido cliente**.
- `src/scenarios/scenarios.test.ts` — cada fallo educativo se reproduce y su versión segura lo evita.

Los tests cubren **lógica pura**, no el render de React (Vitest en Node). La UI se validó a mano en navegador.

## Problemas conocidos
- Bypass de niveles por URL (desbloqueo client-side).
- Flags estáticas y presentes en el HTML del lab una vez reproducido el fallo (es el objetivo).
- Sin tests de render/e2e.
- Solo español.
- `AGENTS.md` incluye un bloque de reglas de Next.js que `next dev` regenera (esperado).

## Deuda técnica relevante
- No hay capa de e2e ni de accesibilidad automatizada.
- El progreso remoto (cuentas) requerirá una implementación de `ProgressRepository` y migración de datos (`version: 1` ya previsto).

## Próximo objetivo (PLANNED)
Probar el flujo completo con usuarios reales, afinar la claridad de los post-labs y, con feedback,
añadir 2–3 niveles más (respetando `LAB_STANDARD.md` y `CURRICULUM.md`). Ver [`ROADMAP.md`](ROADMAP.md).
