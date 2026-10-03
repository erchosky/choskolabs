# LAB SCENARIOS

Lógica y datos **server-only** de cada laboratorio. Todo es ficticio.

- Cada carpeta = un escenario (una "empresa" ficticia).
- Los fallos son **intencionados, acotados y educativos**: no tocan filesystem,
  procesos, red externa ni datos reales.
- Las flags se leen con `getFlag()` desde `src/server/flags.ts`.
- La UI del escenario vive en `src/app/labs/<escenario>/` y las APIs en
  `src/app/api/labs/<escenario>/`.

| Carpeta    | Lab           | Marca ficticia       |
| ---------- | ------------- | -------------------- |
| voltio     | level-1       | Voltio (tienda)      |
| pulsofit   | level-2       | PulsoFit (gimnasio)  |
| taquilla   | level-3       | Taquilla Norte       |
| nimbo      | level-4       | Nimbo (soporte)      |
| colmena    | level-5       | Colmena Coworking    |
| faro       | checkpoint-1  | Hotel Faro Azul      |
