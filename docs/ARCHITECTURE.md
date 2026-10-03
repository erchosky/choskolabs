# ARCHITECTURE

## Stack
- **Next.js 16 (App Router)** + **React 19**, **TypeScript strict**.
- **Tailwind CSS 4**.
- **pnpm**, **ESLint**, **Vitest**.
- Dependencia de runtime añadida: `server-only` (marca módulos que nunca deben ir al cliente).
  Sin Supabase, Prisma, Redis, Docker, GraphQL ni infraestructura enterprise.

## Arquitectura actual (real)

```
Navegador ──► Portal ChoskoLabs (Next.js) ──► Lab ficticio (misma app, entorno controlado)
```

Todo corre dentro de una única app Next.js. No hay Docker ni servicios externos.

### Capas y responsabilidades

| Capa | Ubicación | Responsabilidad |
| --- | --- | --- |
| **Portal (UI)** | `src/app/(home, web, progreso)`, `src/components/portal` | Home, mapa de capítulos, progreso. |
| **Experiencia de nivel** | `src/components/lab`, `src/components/tutorial` | Misión, pistas, flag, post-lab, tutorial jugable. |
| **Contenido** | `src/content` | Escenarios, misiones, pistas, post-labs. **Viaja al cliente: sin flags.** |
| **Escenarios (labs)** | `src/scenarios/<marca>` | Datos y lógica `server-only` de cada fallo educativo. |
| **Labs (UI ficticia)** | `src/app/labs/<marca>` | Las webs ficticias vulnerables. |
| **Flags** | `src/server/flags.ts` | Flags + validación, `server-only`. |
| **APIs** | `src/app/api` | Route Handlers: validación de flags y lógica de labs. |
| **Progreso** | `src/progress` | Modelo, repositorio (localStorage), lógica de desbloqueo. |

### Flujo de una flag
1. El jugador reproduce el fallo en `/labs/<marca>` y obtiene la flag.
2. La introduce en la página del nivel (`/web/<slug>`).
3. `FlagInput` hace `POST /api/flags/verify` con `{ labId, flag }`.
4. `checkFlag` (server-only) valida y responde `correct | incorrect | format | other-level | ...`
   sin revelar la flag.
5. El progreso se marca completado (localStorage) y se muestra el post-lab.

### Progreso
- Abstracción `ProgressRepository` con implementaciones `LocalProgressRepository` (localStorage) y
  `MemoryProgressRepository` (tests / sin storage).
- Un único punto de acceso desde React: `useProgress()` (hook sobre `useSyncExternalStore`), que
  sincroniza entre pestañas. Ningún componente toca `localStorage` directamente.
- Transiciones **puras** (`src/progress/logic.ts`) y desbloqueo puro (`src/progress/unlock.ts`),
  ambos cubiertos por tests.
- El desbloqueo se aplica en cliente (`LockGate`): es **guía pedagógica**, no una barrera de
  seguridad (el progreso vive en el navegador).

### Rutas
- Portal: `/`, `/web`, `/web/[slug]` (SSG por `generateStaticParams`), `/progreso`.
- Labs: `/labs/voltio`, `/labs/pulsofit`, `/labs/taquilla`, `/labs/nimbo`, `/labs/colmena`,
  `/labs/faro` (varias dinámicas para reproducir los fallos).
- APIs: `/api/flags/verify`, `/api/labs/taquilla/checkout`, `/api/labs/nimbo/tickets/[id]`.

## Arquitectura futura (no implementada)
Cuando existan retos que lo requieran (SQLi real, file upload, path traversal, SSRF, command
injection, servicios internos, redes, Linux), los labs avanzados se ejecutarán en **entornos
aislados por contenedores**:

```
Navegador ──► ChoskoLabs ──► Lab aislado (contenedor/sandbox efímero)
```

El jugador **nunca** instala Docker; el aislamiento es transparente. La separación de capas actual
(portal / contenido / escenarios / flags) está pensada para hacer ese salto sin reescribir el portal.

No se finge que Docker exista hoy: hoy **no** existe.
