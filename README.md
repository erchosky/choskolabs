# ChoskoLabs

Mi idea para aprender ciberseguridad jugando y entender qué narices acabas de hacer. En ChoskoLabs entras en una aplicación ficticia, investigas, encuentras el fallo y capturas la flag. Después llega la explicación: qué pasó, por qué funcionó y cómo se arregla.

Porque sacar una flag y quedarse igual de perdido tiene poca gracia, chacho.

> La flag es parte del reto. Entender por qué has podido conseguirla es lo que te llevas.

## Cómo va la cosa

Se juega directamente en el navegador. Abres el laboratorio, investigas y pruebas; no tienes que instalar Kali, máquinas virtuales, Docker ni herramientas externas. Al terminar el reto, el **post-lab** te explica lo que acabas de hacer para que puedas reconocerlo en otro sitio.

Ahora mismo es la **v0.1**: **Web Wargame**, un tutorial jugable, cinco niveles y un reto de comprobación. Esa es la parte que existe; el resto del recorrido se irá ampliando.

## Cómo arrancarlo

```bash
pnpm install
pnpm dev
```

Abre http://localhost:3000.

### Comandos a mano

| Comando | Qué hace |
| --- | --- |
| `pnpm dev` | Servidor de desarrollo (Turbopack). |
| `pnpm build` | Build de producción. |
| `pnpm start` | Sirve el build. |
| `pnpm lint` | ESLint. |
| `pnpm typecheck` | `next typegen` + `tsc --noEmit` (TypeScript strict). |
| `pnpm test` | Tests con Vitest. |

## Estructura rápida

```
src/
  app/               Rutas (portal, labs ficticios y APIs)
    web/             Portal: mapa de capítulos y páginas de nivel
    labs/<marca>/    Aplicaciones ficticias vulnerables (Voltio, PulsoFit, ...)
    api/             Route Handlers (validación de flags y lógica de labs)
  content/           Contenido educativo (escenarios, pistas, post-labs)
  scenarios/         Lógica y datos server-only de cada laboratorio
  server/            Flags (server-only) y validación
  progress/          Modelo de progreso local + lógica de desbloqueo
  components/        UI del portal, de los labs y del tutorial
docs/                Documentación (empieza por VISION.md)
```

## Documentación

Para retomar esto sin tener que adivinar qué se hizo la última vez, el contexto está en `docs/`. Empieza por estos archivos:

1. [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md) — qué es ChoskoLabs en ~5 minutos.
2. [`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md) — qué existe ahora mismo.
3. [`docs/SESSION_HANDOFF.md`](docs/SESSION_HANDOFF.md) — dónde terminó la última sesión.
4. [`docs/DECISIONS.md`](docs/DECISIONS.md) — decisiones importantes y su motivo.

Y según el área en la que trabajes:

- [`docs/VISION.md`](docs/VISION.md) — qué es y por qué (versión ampliada).
- [`docs/CURRICULUM.md`](docs/CURRICULUM.md) — estructura actual y evolución.
- [`docs/LAB_STANDARD.md`](docs/LAB_STANDARD.md) — checklist obligatoria de un lab.
- [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) — cómo escribir el contenido.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — arquitectura real (y la futura).
- [`docs/SECURITY.md`](docs/SECURITY.md) — modelo de seguridad del portal.
- [`docs/ROADMAP.md`](docs/ROADMAP.md) y [`docs/AUDIT_HANDOFF.md`](docs/AUDIT_HANDOFF.md).

El orden de autoridad si algo se contradice: **código > docs > tests > decisiones > handoff >
conversaciones**. `AGENTS.md` define el protocolo para agentes nuevos.

## Aviso

Todos los laboratorios son **ficticios** y sus fallos, **educativos y controlados**. Practica
técnicas de seguridad únicamente en sistemas que tengas permiso explícito para probar.
