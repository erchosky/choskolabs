# AUDIT_HANDOFF

Documento para el agente auditor (**Codex**). Estado real del proyecto ChoskoLabs **v0.1**.

## Estado general
Producto **funcional y jugable** de principio a fin. Verificado con `pnpm lint`, `pnpm typecheck`,
`pnpm test` (52 tests) y `pnpm build` (21 rutas), además de pruebas manuales en navegador y `curl`
sobre las APIs. No es un mock: los seis fallos educativos se reproducen de verdad y las flags se
validan en el servidor.

## Implementado
- Home con propuesta de valor, "cómo funciona" y categorías.
- Categoría Web Wargame con mapa de capítulos y estados (bloqueado/disponible/actual/completado).
- Level 0: tutorial jugable con 5 minijuegos interactivos (no muro de texto).
- Levels 1–5: escenario, misión, "abrir laboratorio", input de flag, 3 pistas + "estoy perdido",
  ver solución y post-lab de 9 secciones con 3 profundidades y micro-pregunta.
- Checkpoint 1: sin pistas hasta confirmar intento; escenario nuevo; transferencia de conocimiento.
- Seis laboratorios ficticios vulnerables (Voltio, PulsoFit, Taquilla, Nimbo, Colmena, Faro).
- Validación de flags server-side (`/api/flags/verify`) con respuestas ricas (correcta, incorrecta,
  formato, vacía, de otro nivel, lab desconocido).
- Progreso local (localStorage) con desbloqueo en cadena, "continuar", dashboard y reinicio con
  confirmación. Sincroniza entre pestañas.
- Documentación completa en `docs/` + `README`, `AGENTS.md`, `CLAUDE.md`.
- Accesibilidad: skip link, foco visible, navegación por teclado, roles/aria, `prefers-reduced-motion`,
  responsive.

## No implementado (a propósito en v0.1)
- Cuentas, backend persistente, sincronización de progreso.
- IA integrada, pagos, rankings, badges, social.
- Docker / labs aislados por contenedor.
- Otras categorías (Linux, redes, etc.).
- Checkpoint como examen obligatorio bloqueante.

## Arquitectura real
Una sola app Next.js 16 (App Router) + React 19 + TS strict + Tailwind 4. Sin servicios externos.
Ver `docs/ARCHITECTURE.md`. Capas: portal / experiencia de nivel / contenido (cliente, sin flags) /
escenarios (server-only) / flags (server-only) / APIs / progreso.

## Estructura de archivos
- `src/content/` — `types.ts`, `curriculum.ts`, `labs/*.ts` (contenido educativo).
- `src/scenarios/<marca>/` — datos y lógica server-only de cada fallo.
- `src/server/flags.ts` — flags + `checkFlag` (server-only).
- `src/progress/` — `types.ts`, `repository.ts`, `logic.ts`, `unlock.ts`, `store.ts`.
- `src/components/` — `ui/`, `portal/`, `lab/`, `tutorial/`.
- `src/app/` — portal (`web/`, `progreso/`), `labs/<marca>/`, `api/`.

## Detalle por nivel

### Level 0 — Aprender jugando (`/web/level-0`)
Tutorial de 5 pasos en `src/components/tutorial/`. Estado en localStorage; saltable. No usa flags.

### Level 1 — Ese no es mi pedido (Voltio) — IDOR
- Escenario: `src/scenarios/voltio/orders.ts`. UI: `src/app/labs/voltio/**`.
- Fallo: `getOrderForViewer` no comprueba el propietario. Existe `getOrderForViewerSecure` (referencia).
- Flag en el pedido `#1843` (nota de entrega). Resoluble sin DevTools.

### Level 2 — La opción que no existe (PulsoFit) — función oculta no protegida
- Escenario: `src/scenarios/pulsofit/data.ts`. UI: `src/app/labs/pulsofit/**`.
- Fallo: enlace `hidden` a `/labs/pulsofit/staff`; la ruta no comprueba rol. Flag en el panel.

### Level 3 — El precio no lo decides tú (Taquilla) — parameter tampering
- Escenario: `src/scenarios/taquilla/checkout.ts`. UI + form no controlado: `src/app/labs/taquilla/**`.
- API: `POST /api/labs/taquilla/checkout` usa el `price` del cliente. Flag cuando el precio cobrado
  ≠ real (instrumentación del lab). Existe `processCheckoutSecure` (referencia).

### Level 4 — Mi ticket de soporte (Nimbo) — BOLA + exposición de datos
- Escenario: `src/scenarios/nimbo/tickets.ts`. UI: `src/app/labs/nimbo/**`.
- API: `GET /api/labs/nimbo/tickets/[id]` devuelve cualquier ticket con `internal_notes`. La página
  carga el ticket 431 por fetch (visible en Network). Flag en las notas internas del ticket 427.

### Level 5 — ¿Eres empleado porque lo dice tu navegador? (Colmena) — trust en cookie
- Escenario: `src/scenarios/colmena/session.ts`. UI: `src/app/labs/colmena/**`.
- La cookie `colmena_role` (Path=/labs/colmena) la siembra el cliente como `member`. `/gestion` lee
  la cookie server-side (`cookies()`) y concede acceso si `staff`/`admin`. Flag = código de puerta.

### Checkpoint 1 — Revisa esta aplicación (Faro) — IDOR en facturas
- Escenario: `src/scenarios/faro/bookings.ts`. UI: `src/app/labs/faro/**`.
- Facturas por código (`/labs/faro/factura/FA-2605`) sin comprobar propietario → IDOR. La recepción
  (`/labs/faro/recepcion`) SÍ está protegida (contraste realista). Flag en la factura `FA-2605`.

## Flags
`src/server/flags.ts`, `server-only`, estáticas, no secretas. Validación en tiempo constante.
Test `curriculum.test.ts` verifica que **ninguna flag real** aparece en el contenido cliente.

## Progreso
localStorage vía `LocalProgressRepository`; parsing defensivo (descarta datos corruptos). Lógica
pura testeada. Desbloqueo en cliente (`LockGate`) = guía pedagógica, no seguridad.

## Pistas y post-lab
`HintSystem` (3 pistas + "estoy perdido", con gating en checkpoints), `SolutionReveal` (último
recurso), `PostLab` (9 secciones + `ExplanationDepth` de 3 niveles + `ReflectionQuestion`).

## Seguridad
Ver `docs/SECURITY.md`. Fallos acotados; sin RCE/SSRF/SQLi peligrosos, sin terceros, sin host.
Cabeceras básicas en `next.config.ts`.

## Tests
`pnpm test` → 52 tests en 5 archivos:
`src/server/flags.test.ts`, `src/progress/progress.test.ts`, `src/progress/unlock.test.ts`,
`src/content/curriculum.test.ts`, `src/scenarios/scenarios.test.ts`.

## Limitaciones y deuda técnica conocidas
- **Bypass de niveles por URL:** el desbloqueo es client-side; alguien puede navegar directo a
  `/web/level-3`. Aceptado en v0.1 (el progreso vive en el navegador; no es una barrera de seguridad).
- **Flags estáticas** y presentes en el HTML del lab una vez reproducido el fallo (es el objetivo).
- **Sin componente de test de React**: se testea la lógica pura, no el render (Vitest en Node). La UI
  se validó manualmente en navegador.
- **i18n**: solo español, hardcodeado.
- **Datos en memoria** por escenario (se reconstruyen por request); no hay persistencia entre labs.
- **AGENTS.md** contiene además el bloque de reglas de Next.js que `next dev` regenera; es esperado.

## Riesgos conocidos
- Si alguien añade contenido con una flag literal en `src/content`, el test lo detecta, pero conviene
  vigilarlo en revisiones.
- Cambiar la interfaz de `ProgressRepository` sin migrar `parseProgress` podría invalidar progreso
  guardado; hay `version: 1` para gestionarlo.

## Qué debería revisar el auditor
1. Que ningún fallo educativo tenga efectos fuera del lab (host, red, otros usuarios).
2. Que las flags no se filtren por vías no intencionadas (props cliente, JSON, bundle).
3. Robustez de `checkFlag` y de los handlers de API ante entradas mal formadas.
4. Parsing defensivo del progreso (`parseProgress`) ante localStorage manipulado.
5. Coherencia del curriculum (orden, unlockRequires, capítulos) — cubierto por tests, revisar límites.
6. Accesibilidad real (teclado, lector de pantalla, contraste) más allá de lo automatizable.
7. Que cada nivel cumpla `docs/LAB_STANDARD.md` (especialmente "no spoilea" y "el post-lab enseña").
EOF
echo done