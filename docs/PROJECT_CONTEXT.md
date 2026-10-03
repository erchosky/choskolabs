# CHOSKOLABS

> **Memoria estable del proyecto.** Este documento debe permitir entender ChoskoLabs en ~5 minutos
> sin ninguna conversación previa. Si contradice al código, **gana el código** (ver
> [orden de autoridad](#fuente-de-verdad)).

## Qué es

ChoskoLabs es una **academia práctica de ciberseguridad que se aprende jugando wargames**. Se juega
en el navegador: entras en una aplicación ficticia, investigas, encuentras un fallo, capturas una
`flag{...}` y después completas un **post-lab** que te explica de verdad qué acabas de hacer.

> No enseñamos a conseguir flags. Enseñamos a entender por qué se pueden conseguir.

## Problema que resuelve

Mucha gente que quiere aprender ciberseguridad acaba siguiendo vídeos, copiando comandos y
resolviendo ejercicios… y aun así se pregunta *"¿qué coño acabo de hacer?"*. Consiguen resultados
sin entenderlos: no saben por qué funcionó, para qué sirve, ni cómo reconocerían algo similar en
otra aplicación. ChoskoLabs existe para eliminar exactamente ese vacío.

## Usuario principal

Alguien que puede empezar **prácticamente desde cero**. No se asume que conozca HTTP, DevTools,
APIs, cookies, sesiones, autenticación/autorización, SQL ni Linux. Pero tampoco puede resultar
infantil para quien ya conoce lo básico, ni obligar a leer un tutorial largo antes de jugar.

## Filosofía

Juego + curso: **el propio wargame es el curso**. **Reto primero, explicación después.** Primero
experiencia, después terminología.

## Objetivo educativo

No memorizar soluciones ni payloads, sino **crear modelos mentales** transferibles ("cuando veo un
recurso identificado, me pregunto si el servidor comprueba permisos").

## Regla fundamental

**Encontrar la flag NO significa terminar de aprender.** El nivel se completa cuando entiendes lo
que hiciste.

## Experiencia deseada

Situación realista → curiosidad → investigación → descubrimiento → flag → explicación → comprensión
→ **transferencia** del conocimiento a un contexto nuevo.

## Browser-first

Se juega solo con el navegador (URL, código fuente, DevTools: Network, Elements, Application). El
jugador **no** instala Kali, VMs, Docker ni herramientas. *Click and hack.* Importante:
**infraestructura del jugador ≠ infraestructura del servidor**; en el futuro podremos usar
contenedores internamente, siempre transparentes para el jugador.

## Realismo

Escenarios reconocibles del día a día (tienda, gimnasio, entradas, soporte, coworking, hotel). Se
evita lo abstracto ("modifica el parámetro foo"). La variedad de escenarios es positiva: ayuda a
transferir en lugar de memorizar un contexto.

## Pistas

Cuatro escalones de ayuda: *hazme pensar* → *dime dónde mirar* → *ayúdame técnicamente* → *estoy
totalmente perdido* (que enseña el concepto, no solo la respuesta). Más *ver solución*, que **enseña
el razonamiento**. **Usar pistas no es hacer trampas**; se registran de forma personal, nunca como
puntuación competitiva.

## Post-lab (el corazón del producto)

Tras validar la flag se despliega el post-lab: qué hiciste, por qué funcionó, qué ocurría realmente,
cómo se llama, para qué sirve, dónde aparece, cómo detectarlo, cómo se soluciona y una idea para
recordar; con tres profundidades (🟢 entiéndelo · 🟡 técnicamente · 🔴 profundiza) y una
micro-pregunta opcional. Es la parte más importante: sin ella, ChoskoLabs sería otro CTF más.

## Checkpoints

Existen para comprobar **transferencia de conocimiento**: se resuelven sin pistas de qué buscar,
aplicando lo aprendido a un escenario nuevo. No son exámenes; son "ahora prueba tú".

## Fuente de verdad

Orden de autoridad cuando algo se contradiga:

1. **Código funcionando.**
2. Documentación actual del repositorio.
3. Tests.
4. Decisiones registradas ([`DECISIONS.md`](DECISIONS.md)).
5. Handoff de la última sesión ([`SESSION_HANDOFF.md`](SESSION_HANDOFF.md)).
6. Conversaciones externas.

Si una conversación antigua contradice el estado actual, **gana el proyecto actual**. Nunca
implementar algo solo porque "se habló alguna vez".

## Contexto del fundador (relevante para el producto)

El fundador quiere construir la herramienta que le habría gustado tener al empezar: vivió en primera
persona el problema de seguir tutoriales y resolver ejercicios sin entender qué había hecho. Por eso
ChoskoLabs prioriza el **por qué / para qué / cómo** sobre el "haz esto". Otros datos personales que
no afecten al producto no pertenecen al repositorio.

## Enlaces

- Estado actual → [`CURRENT_STATE.md`](CURRENT_STATE.md)
- Arquitectura → [`ARCHITECTURE.md`](ARCHITECTURE.md)
- Curriculum → [`CURRICULUM.md`](CURRICULUM.md)
- Seguridad → [`SECURITY.md`](SECURITY.md)
- Visión ampliada → [`VISION.md`](VISION.md)
- Estándar de un lab → [`LAB_STANDARD.md`](LAB_STANDARD.md)
- Guía de contenido → [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md)
- Decisiones → [`DECISIONS.md`](DECISIONS.md)
- Handoff → [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md)
- Auditoría → [`AUDIT_HANDOFF.md`](AUDIT_HANDOFF.md)
