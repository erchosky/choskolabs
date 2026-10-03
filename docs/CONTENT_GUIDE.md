# CONTENT_GUIDE

Cómo escribir el contenido educativo de ChoskoLabs. El tono manda tanto como la corrección técnica.

## Tono
Humano, directo, claro, cercano, respetuoso y **nada infantil**. Evita:

- "Esto es obvio." · "Como todos sabemos." · "Simplemente haz…"

Si alguien no lo sabe, no es obvio. Explica los conceptos técnicos con ejemplos cotidianos y busca
constantemente el momento *"ah, coño, esto sirve para esto"*.

## Escenarios
- Realistas y reconocibles: tienda, gimnasio, entradas, soporte, coworking, hotel…
- Concretos, no abstractos. Da contexto y objetivo, **nunca** la técnica.
- Puedes reutilizar el modelo mental en escenarios distintos (eso es bueno: demuestra transferencia).

## Pistas
Cuatro escalones, cada uno más concreto que el anterior.

- **Mala pista:** "Cambia 1842 por 1843."
- **Buena pista (1):** "¿Cómo identifica la aplicación el pedido que estás consultando?"
- **Buena pista (2):** "Fíjate en la barra de direcciones cuando abres un pedido."
- **Buena pista (3):** "La URL termina en un número; prueba a cambiarlo por otros cercanos."
- **Estoy perdido:** enseña el concepto (qué observas, qué significa, qué probar y por qué tiene
  sentido probarlo).

## Solución
Último recurso, sin penalizar ni avergonzar. **Enseña el razonamiento**, no el dato:

- **Mal:** "Pon 1843."
- **Bien:** "El pedido usa un identificador numérico. Como parte de una auditoría en este laboratorio
  controlado, podemos comprobar si el servidor valida que otros identificadores son nuestros…"

## Post-lab
Sigue el orden de secciones del modelo (`PostLab`): qué hiciste, por qué funcionó, qué ocurría,
cómo se llama, para qué sirve, dónde aparece, cómo detectarlo, cómo se soluciona, takeaway.
Tres profundidades:

- 🟢 **Entiéndelo:** cotidiano, cero jerga innecesaria.
- 🟡 **Entiéndelo técnicamente:** navegador, HTTP, servidor, endpoints, estado, autorización.
- 🔴 **Profundiza:** variantes, herramientas, terminología, implicaciones, mitigaciones.

No obligues a leer la parte profunda.

## Takeaways
Una sola frase memorable. Ejemplos del propio curso:

- "Conocer el identificador de un recurso no significa tener permiso para acceder a él."
- "Ocultar un botón no protege una función."
- "El servidor debe validar y calcular los datos importantes."
- "El cliente no puede otorgarse permisos a sí mismo."

## No copiar/pegar
Reduce el aprendizaje por copiar/pegar. Cuando aparezca un comando (en el futuro), explica qué hace,
por qué, qué significa cada argumento importante y qué esperamos obtener. Primero razonamiento,
después herramienta.

## Formato del texto enriquecido (`Rich`)
El renderizador (`Prose`) soporta: párrafos con `` `código` `` y `**negrita**`, listas
(`{ list: [...] , ordered? }`), bloques de código (`{ code, lang?, caption? }`) y notas
(`{ note, tone: "info" | "warn" | "ok" }`). No hay HTML arbitrario.

## Contexto educativo por lab (dónde vive)

Cada lab conserva su contexto pedagógico **dentro de su definición** (`src/content/labs/<id>.ts`,
tipo `PlayableLabDefinition`). No hace falta un documento por lab; el modelo de datos ya lo
representa:

| Qué queremos que quede documentado | Campo del lab |
| --- | --- |
| Qué queremos enseñar / modelo mental | `mentalModel` (+ `postLab.technicalName`) |
| Qué debe descubrir el jugador | `scenario` + `mission` (sin nombrar la técnica) |
| Qué NO debemos spoilear | Implícito: `scenario`/`mission` no revelan la vulnerabilidad; la teoría vive en `postLab` |
| Conocimiento previo asumido | `prerequisites` (+ `unlockRequires`) |
| Cómo le ayudan las pistas | `hints[0..2]` (pensar → orientar → técnico) y `lost` |
| Qué explica el post-lab | `postLab.*` (9 secciones + 3 profundidades + `reflection`) |
| Qué errores esperamos que cometa | Se anticipan en `hints`/`lost` (p. ej. "prueba varios números, no aciertas a la primera") |
| Qué transferencia buscamos | El checkpoint la ejercita; el `mentalModel` es lo que debe transferirse |

Si en el futuro un lab necesita contexto que el modelo no capture, amplía el tipo en
`src/content/types.ts` antes de crear un documento suelto.
