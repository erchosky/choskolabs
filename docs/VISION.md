# VISION

## Qué es ChoskoLabs

ChoskoLabs es una **academia práctica de ciberseguridad donde el curso se recorre jugando
wargames**. Cada nivel está diseñado para que descubras algo por ti mismo y después entiendas qué
hiciste, por qué funcionó, para qué sirve y cómo se evita.

> **NO ENSEÑAMOS A CONSEGUIR FLAGS. ENSEÑAMOS A ENTENDER POR QUÉ SE PUEDEN CONSEGUIR.**

Otras dos frases que guían el producto:

- *Jugar primero. Entender después. Recordar para siempre.*
- El propio wargame **es** el curso.

## Qué problema resuelve

Mucha gente aprende ciberseguridad viendo vídeos, copiando comandos y siguiendo tutoriales.
Consiguen resultados, pero a menudo no saben:

- por qué hicieron lo que hicieron;
- qué acaba de pasar técnicamente;
- para qué sirve;
- cómo habrían sabido por sí mismos que debían probar eso;
- cómo reconocerían algo similar en otra aplicación;
- cómo se soluciona.

ChoskoLabs existe para evitar exactamente eso. El fundador quería aprender y se topaba con este
muro; la plataforma está pensada para esa persona.

## Quién es el usuario

Debe poder usarlo alguien **completamente nuevo**, sin asumir que conoce HTTP, DevTools, APIs,
cookies, sesiones, autenticación, autorización, SQL o Linux. Pero tampoco puede resultar infantil
para quien ya conoce lo básico, ni obligar a leer un tutorial de 20 minutos antes de jugar.

Público: alguien completamente nuevo, un estudiante de informática, alguien aprendiendo redes,
alguien que ya conoce lo básico, alguien que quiere iniciarse en pentesting web.

## Por qué wargames

Porque aprender haciendo funciona. En lugar de teoría → vídeo → test → ejercicio, la experiencia es:

**situación → jugar → investigar → probar → equivocarse → descubrir → flag → entender → aplicar**.

El descubrimiento propio fija el conocimiento mucho mejor que la explicación pasiva.

## Por qué el post-lab es fundamental

Encontrar la flag **no** termina el nivel. La parte más importante de ChoskoLabs es el **post-lab**:
tras validar la flag, se explica qué hiciste, por qué funcionó, qué ocurría realmente (cliente,
servidor, petición, respuesta, permisos), cómo se llama, para qué sirve, dónde aparece en el mundo
real, cómo lo vería un pentester, cómo lo arreglaría un desarrollador y una idea para recordar.

Con tres profundidades: **Entiéndelo** (cotidiano), **Entiéndelo técnicamente** y **Profundiza**.

## Browser-first

Se juega en el navegador. El jugador usa navegador, URL, código fuente y DevTools (Network,
Elements, Application/Storage, Console cuando toca). **No** instala Kali, VMs, Docker ni herramientas.

Importante: **infraestructura del jugador ≠ infraestructura del servidor**. En el futuro podremos usar
contenedores y sandboxes internamente, pero siempre transparentes para el jugador.

## Realismo y situaciones cotidianas

Los retos parecen situaciones reconocibles: una tienda online, un gimnasio, una venta de entradas,
un soporte técnico, un coworking, un hotel. Se evita lo abstracto ("modifica el parámetro foo") a
favor de lo concreto ("la tienda dice que solo ves tus pedidos, ¿es verdad?"). La variedad de
escenarios es positiva; no hace falta un universo narrativo común.

## No spoilear el concepto

Antes del reto: situación, objetivo y contexto. **Nunca** el nombre de la técnica. La terminología
(IDOR, Broken Access Control, etc.) llega **después**, en el post-lab. Primero experiencia, después
terminología.

## Filosofía de pistas

Cuatro niveles de ayuda: *hazme pensar* (provoca razonamiento), *dime dónde mirar* (orienta),
*ayúdame técnicamente* (instrucciones concretas) y *estoy totalmente perdido* (enseña el concepto
necesario, sin limitarse a dar la respuesta). Además, **ver solución completa** como último recurso,
que **enseña el razonamiento** en lugar de soltar el dato.

**Usar pistas no es hacer trampas.** Se registran de forma personal (nunca como puntuación
competitiva). No queremos cultura tóxica.

## Prueba pedagógica final

Después de un nivel, si preguntamos al jugador *"explícame con tus palabras qué acaba de pasar"* y
solo sabe decir "hice lo que decía la pista y salió la flag", **el nivel ha fallado**. Si puede
decir "el servidor me dejaba pedir un recurso de otra persona porque no comprobaba permisos", **ha
funcionado**.

Y la prueba de diversión: después de un nivel, ¿el jugador quiere abrir el siguiente?
