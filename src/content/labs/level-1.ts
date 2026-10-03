import type { PlayableLabDefinition } from "../types";

export const level1: PlayableLabDefinition = {
  id: "level-1",
  slug: "level-1",
  kind: "level",
  number: 1,
  chapterId: "chapter-1",
  title: "Ese no es mi pedido",
  subtitle: "Una tienda promete que solo ves tus compras. ¿Será verdad?",
  difficulty: "introductorio",
  estimatedMinutes: 10,
  labBrand: "Voltio",
  labUrl: "/labs/voltio",
  bestOnDesktop: false,
  unlockRequires: ["level-0"],
  prerequisites: ["level-0"],

  scenario: [
    "Compraste unos auriculares en **Voltio**, una tienda de electrónica online. Ahora estás en tu cuenta, revisando el estado del pedido.",
    "En su página de ayuda, Voltio dice esto:",
    {
      note: "«Tu privacidad es lo primero. Cada cliente solo puede consultar sus propios pedidos.»",
      tone: "info",
    },
    "Entras como **Lucía Martín**, una clienta normal. No tienes ningún permiso especial.",
  ],
  mission: [
    "Entra en tu cuenta de Voltio y echa un vistazo a tus pedidos.",
    "La tienda afirma que **solo puedes ver los tuyos**. Tu misión es comprobar si eso es cierto de verdad.",
    "En algún pedido que no debería ser accesible para ti hay una **flag** con el formato `flag{...}`. Encuéntrala.",
  ],

  mentalModel: "Conocer el identificador de un recurso no significa tener permiso para acceder a él.",

  hints: [
    {
      label: "Pista 1 — Hazme pensar",
      body: [
        "Abre uno de tus pedidos y luego otro. Fíjate en qué cambia entre ellos.",
        "¿Qué usa la web para saber *qué pedido concreto* le estás pidiendo que muestre? ¿Ese dato lo decide la tienda... o podrías cambiarlo tú?",
      ],
    },
    {
      label: "Pista 2 — Dime dónde mirar",
      body: [
        "Cuando abres un pedido, mira con atención la **barra de direcciones** del navegador (la URL).",
        "Cada pedido tiene su propia dirección. ¿Qué distingue la dirección de un pedido de la de otro?",
      ],
    },
    {
      label: "Pista 3 — Ayúdame técnicamente",
      body: [
        "La URL de tus pedidos termina en un **número**, por ejemplo `/labs/voltio/pedido/1842`.",
        "Ese número es el identificador del pedido. Prueba a escribir en la barra de direcciones el mismo enlace pero con **otro número cercano** y observa qué aparece.",
        "No hace falta acertar a la primera: prueba varios y lee lo que te devuelve la tienda.",
      ],
    },
  ],
  lost: [
    "Vamos con calma. Cuando ves un pedido, tu navegador le pide a la tienda algo así como: «dame el pedido número 1842». Ese número viaja en la **URL**, la dirección que ves arriba.",
    "El detalle importante es este: **ese número lo puedes cambiar tú**. La barra de direcciones no está bloqueada; puedes escribir lo que quieras.",
    {
      list: [
        "Abre tu pedido y localiza el número al final de la dirección.",
        "Cámbialo por otro (prueba números cercanos, hacia arriba y hacia abajo) y pulsa Enter.",
        "Si la tienda te muestra un pedido que **no es tuyo**, acabas de descubrir el fallo.",
      ],
      ordered: true,
    },
    "La flag está escondida en uno de esos pedidos ajenos. No pasa nada por probar: es un laboratorio, todo es ficticio y nadie sale perjudicado.",
  ],
  solution: [
    "Este laboratorio simula una auditoría de seguridad sobre una tienda ficticia. Vamos a razonar el fallo paso a paso.",
    "Cuando abres **Mis pedidos → Pedido**, la dirección se parece a `/labs/voltio/pedido/1842`. Ese `1842` es el identificador del pedido: es como el número que la tienda usa para encontrarlo en su base de datos.",
    "La pregunta de una persona con mentalidad de seguridad es: *«¿la tienda comprueba que este pedido es mío antes de enseñármelo, o simplemente lo busca por su número y me lo da?»*.",
    "Para averiguarlo, cambiamos el número por otro. Al escribir `/labs/voltio/pedido/1843` (y otros cercanos), la tienda nos devuelve pedidos de **otros clientes**: nombre, dirección, qué compraron... datos que no deberíamos ver.",
    "Uno de esos pedidos ajenos es un pedido interno de la tienda, y en su nota de entrega aparece la flag. Ese es el objetivo.",
    {
      note: "El problema no es que los pedidos tengan número. El problema es que el servidor **no comprueba** si el pedido pertenece a quien lo pide.",
      tone: "warn",
    },
  ],

  postLab: {
    whatYouDid: [
      "Cambiaste el número que identifica tu pedido en la dirección y descubriste que la tienda te mostraba pedidos de otras personas.",
      "Es decir: pediste ver algo que no era tuyo... y la tienda te lo enseñó sin rechistar.",
    ],
    whyItWorked: [
      "La tienda identifica cada pedido con un número correlativo (1842, 1843, 1844...). Adivinar otros números es trivial.",
      "Pero adivinar el número no debería bastar. El fallo real es que, al recibir la petición, el servidor **buscó el pedido por su número y lo devolvió sin comprobar de quién era**.",
      "Conocer *dónde está* un recurso y tener *permiso* para verlo son dos cosas distintas. Aquí la tienda las confundió.",
    ],
    howItWorked: {
      flow: [
        { actor: "Tú (navegador)", action: "Pido /labs/voltio/pedido/1843", detail: "Solo cambié el número" },
        { actor: "Servidor Voltio", action: "Busco el pedido 1843", detail: "Existe" },
        { actor: "Servidor Voltio", action: "¿Es de quien lo pide?", detail: "NUNCA se hizo esta pregunta", highlight: true },
        { actor: "Servidor Voltio", action: "Te devuelvo el pedido", detail: "Aunque sea de otra persona" },
      ],
      simple:
        "Es como un guardarropa donde entregas un número y te dan el abrigo correspondiente. Si el encargado no comprueba que ese número es el de *tu* resguardo, cualquiera que diga un número se lleva un abrigo ajeno.",
      technical: [
        "Al abrir un pedido, el navegador hace una petición del tipo `GET /labs/voltio/pedido/1843`. Ese `1843` es un parámetro de ruta que el servidor usa para localizar el recurso.",
        "El backend hizo el equivalente a `SELECT * FROM pedidos WHERE id = 1843` y devolvió el resultado. Le faltó la parte crucial: `AND cliente_id = <el cliente de la sesión>`.",
        "Como no se comprueba a quién pertenece el recurso, cualquier usuario autenticado puede leer los pedidos de todos los demás con solo cambiar el número.",
      ],
      deep: [
        "Este patrón se llama **IDOR** (Insecure Direct Object Reference) y es un caso de **Broken Access Control**, la categoría número 1 del OWASP Top 10.",
        "Da igual que el identificador sea un número, un email o un código: si el servidor no valida la **autorización** (¿este usuario puede ver *este* objeto?), el fallo existe.",
        "Sustituir los IDs numéricos por valores aleatorios (UUIDs) hace más difícil *adivinarlos*, pero **no arregla** el problema: sigue siendo Broken Access Control. La solución real es comprobar permisos en el servidor.",
      ],
    },
    technicalName: {
      name: "IDOR (Insecure Direct Object Reference)",
      aka: ["Broken Access Control", "BOLA (en APIs)"],
      summary:
        "Acceder a recursos de otras personas manipulando un identificador, porque el servidor no comprueba si tienes permiso sobre ese recurso concreto.",
    },
    practicalUse: [
      "Es una de las primeras cosas que revisa cualquier auditor web, y de las más frecuentes en aplicaciones reales.",
      "Entenderlo te sirve para dos cosas: detectar el fallo cuando pruebas una aplicación, y evitar programarlo si desarrollas una.",
    ],
    realWorldExamples: [
      { title: "Facturas", description: "Cambiar el número de factura en la URL y ver la de otro cliente." },
      { title: "Reservas de hotel", description: "Acceder a la reserva de otra persona con su código." },
      { title: "Tickets de soporte", description: "Leer conversaciones ajenas cambiando el id del ticket." },
      { title: "Documentos compartidos", description: "Un id predecible que deja abrir archivos que no son tuyos." },
      { title: "Historiales médicos o citas", description: "El caso más grave: datos sensibles expuestos por un id." },
    ],
    howToRecognizeAgain: [
      "Cada vez que veas un identificador en una URL, un formulario o una petición (`.../algo/1842`, `?id=55`, `user=1187`), hazte la pregunta: *«¿qué pasa si lo cambio por otro?»*.",
      "Si al cambiarlo obtienes datos de otra persona, es Broken Access Control. La señal de alarma es un **identificador que puedes modificar** apuntando a algo que no debería ser tuyo.",
    ],
    remediation: {
      explanation: [
        "La regla es simple: **el servidor debe comprobar, en cada petición, que el recurso solicitado pertenece a quien lo pide** (o que esa persona tiene permiso para verlo).",
        "Esta comprobación va en el backend. Nunca debe delegarse en que «el usuario no conoce el número»: eso no es seguridad.",
      ],
      code: [
        {
          title: "Vulnerable",
          lang: "ts",
          tone: "vulnerable",
          code: `// Busca el pedido por su id y lo devuelve, sin más.
const order = await db.orders.findById(params.id);
return Response.json(order);`,
        },
        {
          title: "Corregido",
          lang: "ts",
          tone: "fixed",
          code: `// El pedido debe existir Y pertenecer a la sesión actual.
const order = await db.orders.findById(params.id);
if (!order || order.customerId !== session.customerId) {
  return new Response("No encontrado", { status: 404 });
}
return Response.json(order);`,
        },
      ],
    },
    takeaway: "Conocer el identificador de un recurso no significa tener permiso para acceder a él.",
    reflection: {
      question: "¿Cuál era realmente el problema de Voltio?",
      options: [
        { id: "a", text: "Que los pedidos tenían números." },
        { id: "b", text: "Que el servidor no comprobaba si el pedido pertenecía al usuario." },
        { id: "c", text: "Que la web usaba HTML." },
        { id: "d", text: "Que existía una URL para cada pedido." },
      ],
      correctId: "b",
      explanation:
        "Que los pedidos tengan número (o URL) es normal. El fallo es que el servidor los entregaba sin verificar si eran tuyos: una comprobación de autorización que faltaba.",
    },
  },
};
