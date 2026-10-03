# SECURITY

## Principio rector
**El portal ChoskoLabs no es el objetivo vulnerable.** Los fallos viven en escenarios ficticios,
controlados y acotados. El portal en sí (navegación, progreso, validación de flags) se construye con
cuidado defensivo.

## Portal seguro
- Sin cuentas, sin base de datos externa, sin secretos reales, sin pagos.
- Sin terceros: ningún lab llama a servicios externos ni envía datos fuera.
- Sin acceso al host: los labs no tocan filesystem real, procesos ni red arbitraria.
- Cabeceras de seguridad básicas en `next.config.ts` (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `poweredByHeader: false`).
- Entradas del usuario validadas en el servidor (formato de flag, tipos del body de las APIs).

## Flags
- Definidas **solo** en `src/server/flags.ts`, protegido con `server-only` (importarlas desde código
  cliente rompe el build).
- Estáticas en v0.1 y **no son secretos reales**: solo confirman que el jugador llegó al recurso.
- Validación **server-side** en `POST /api/flags/verify`; la respuesta nunca devuelve la flag correcta.
- Comparación en tiempo constante (buena práctica).
- Un test (`curriculum.test.ts`) verifica que ninguna flag real aparece en el contenido enviado al
  cliente (el contenido puede mencionar el *formato* `flag{...}`, nunca una flag real).

## Fallos educativos (intencionados y controlados)
Cada laboratorio implementa un fallo concreto y seguro:

| Lab | Fallo educativo | Acotación |
| --- | --- | --- |
| Voltio | IDOR: pedido por id sin comprobar propietario | Datos ficticios en memoria |
| PulsoFit | Ruta de staff sin comprobar rol | Sin datos reales |
| Taquilla | Confía en el `price` del cliente | No hay cobro ni pasarela real |
| Nimbo | API devuelve tickets ajenos + campos internos | Datos ficticios en memoria |
| Colmena | Rol en cookie controlada por el cliente | Cookie con `Path=/labs/colmena` |
| Faro | IDOR en facturas por código de reserva | Datos ficticios; recepción SÍ protegida |

Se evitan deliberadamente vulnerabilidades peligrosas (RCE, SSRF real, SQLi sobre datos importantes,
salida del laboratorio, ataque a otros usuarios). No hacen falta para enseñar los primeros conceptos.

## Separación lógica
El código separa portal, contenido de labs, escenarios, validación de flags, progreso y post-lab
(ver [`ARCHITECTURE.md`](ARCHITECTURE.md)). Esto facilita en el futuro mover labs avanzados a
entornos aislados por contenedores sin tocar el portal.

## Divulgación responsable
Todo el material es para practicar en sistemas propios/autorizados. La UI lo recuerda en el pie.
