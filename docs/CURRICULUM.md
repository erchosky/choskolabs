# CURRICULUM

Estructura educativa de la categoría **Web Wargame** en la v0.1. La fuente de verdad en código es
[`src/content/curriculum.ts`](../src/content/curriculum.ts).

## Estructura actual

### Capítulo 0 — Empieza aquí
- **Level 0 — Aprender jugando** (tutorial jugable, saltable).
  Cinco minijuegos interactivos: petición/respuesta HTTP, la URL como identificador de recurso,
  frontend vs backend, DevTools (Elements + Network) y qué es una flag. Objetivo: 5–10 min, sin
  muros de texto ni examen.

### Capítulo 1 — Aprende a mirar
- **Level 1 — Ese no es mi pedido** · Tienda *Voltio* · Introductorio.
  Idea: *conocer el identificador de un recurso no significa tener permiso*. Resoluble sin DevTools
  (cambiando el número en la URL). Concepto revelado después: IDOR / Broken Access Control.
- **Level 2 — La opción que no existe** · Gimnasio *PulsoFit* · Principiante.
  Idea: *ocultar un botón no protege una función*. Introduce DevTools → Elements. Concepto:
  Broken Access Control a nivel de función.

### Capítulo 2 — No confíes en el cliente
- **Level 3 — El precio no lo decides tú** · *Taquilla Norte* · Principiante.
  Idea: *el servidor debe validar y calcular lo importante*. Campo `price` oculto manipulable.
  Concepto: confianza indebida en datos del cliente / parameter tampering.
- **Level 4 — Mi ticket de soporte** · *Nimbo* · Principiante.
  Idea: *lo que ves es solo una parte; hay una API por detrás*. Introduce DevTools → Network, JSON,
  endpoints. Concepto: BOLA + exposición de datos en APIs.
- **Level 5 — ¿Eres empleado porque lo dice tu navegador?** · *Colmena Coworking* · Principiante.
  Idea: *el cliente no puede otorgarse permisos*. Introduce Application → Cookies. Concepto:
  confiar en estado del cliente para la autorización.

### Checkpoint 1 — Revisa esta aplicación
- **Hotel Faro Azul** · Principiante. Sin pistas de qué buscar; se resuelve aplicando lo aprendido
  (transferencia). Parte de la app está bien protegida y parte no, como en una auditoría real.
  Las pistas solo se ofrecen tras confirmar que se ha intentado. No es un examen: es "ahora prueba tú".

## Qué conocimientos adquiere el alumno (progresivo)

1. Cliente/servidor, petición/respuesta, URL como identificador.
2. Frontend (mostrar) vs backend (permitir).
3. DevTools: Elements (HTML real), Network (peticiones/JSON), Application (cookies/storage).
4. Control de acceso: por objeto y por función; identificadores manipulables.
5. Desconfianza de los datos del cliente (precio, rol, campos).
6. Mentalidad de auditor: catalogar recursos y preguntarse si el servidor comprueba permisos.

## Propuesta de evolución (Web) — no implementado aún

No como lista OWASP, sino como capítulos alrededor de ideas y habilidades:

- **Aprende a mirar** → source/HTML, JS cliente, parámetros GET/POST, headers.
- **No confíes en el cliente** → cookies, sesiones, autenticación vs autorización.
- **Identidad y acceso** → IDOR/BOLA encadenados, password reset, JWT.
- **Lógica de negocio** → precios, cupones, race conditions, flujos rotos.
- **Inyección y salida** → information disclosure, SQLi, XSS, CSRF/CORS.
- **Superficie ampliada** → file upload, path traversal, SSRF, command injection.
- **Diseño e integración** → insecure design, errores criptográficos, seguridad de APIs,
  encadenamiento de vulnerabilidades.

Cada nuevo nivel debe cumplir [`LAB_STANDARD.md`](LAB_STANDARD.md).
