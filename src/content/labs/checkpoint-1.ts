import type { PlayableLabDefinition } from "../types";

export const checkpoint1: PlayableLabDefinition = {
  id: "checkpoint-1",
  slug: "checkpoint-1",
  kind: "checkpoint",
  number: 1,
  chapterId: "checkpoint-1",
  title: "Revisa esta aplicación",
  subtitle: "Sin pistas de qué buscar. Solo tú, una app nueva y todo lo que ya sabes.",
  difficulty: "principiante",
  estimatedMinutes: 20,
  labBrand: "Hotel Faro Azul",
  labUrl: "/labs/faro",
  bestOnDesktop: true,
  unlockRequires: ["level-5"],
  prerequisites: ["level-1", "level-2", "level-3", "level-4", "level-5"],
  hintsRequireAttempt: true,

  scenario: [
    "El **Hotel Faro Azul** nos ha pedido revisar la app donde sus huéspedes consultan reservas y facturas.",
    "No te decimos qué buscar ni qué técnica usar. Eso es justo lo que se entrena aquí: mirar una aplicación nueva y aplicar tu criterio.",
    "Entras como el huésped **Samuel Ortega**. Tienes una reserva a tu nombre.",
    { note: "Esto no es un examen. Es un «ahora prueba tú». Tómate tu tiempo, curiosea, y solo si te atascas, pide pistas.", tone: "info" },
  ],
  mission: [
    "Revisa la app del Hotel Faro Azul como harías en una auditoría real.",
    "En algún punto de la aplicación hay algo que no debería ser accesible para un huésped normal. Encuéntralo y localiza la **flag**.",
    "Consejo: fíjate en cómo la app identifica cada reserva y cada factura, y en lo que pide por detrás.",
  ],

  mentalModel: "Cuando veo recursos identificados, pienso si el servidor comprueba permisos, en vez de recordar un truco concreto.",

  hints: [
    {
      label: "Pista 1 — Hazme pensar",
      body: [
        "Repasa lo que ya sabes: identificadores que se pueden cambiar, funciones escondidas pero no protegidas, datos que envía el cliente, APIs por detrás, roles en el navegador...",
        "¿Cuál de esas ideas encaja con lo que ves en esta app de reservas y facturas?",
      ],
    },
    {
      label: "Pista 2 — Dime dónde mirar",
      body: [
        "Tienes una reserva y puedes ver su factura. Fíjate en **cómo se identifica** esa factura o esa reserva cuando la abres.",
        "Compáralo con lo que viste en la tienda del Level 1 y en el soporte del Level 4.",
      ],
    },
    {
      label: "Pista 3 — Ayúdame técnicamente",
      body: [
        "Al abrir tu factura, observa la petición (Network) o la dirección: aparece el **código de reserva** (algo como `FA-2607`).",
        "Prueba códigos cercanos (`FA-2604`, `FA-2605`, `FA-2606`...). Alguno pertenece a otra reserva que no deberías poder ver. Uno de ellos esconde la flag.",
      ],
    },
  ],
  lost: [
    "Volvamos a lo esencial. En esta app, cada reserva tiene un **código** (por ejemplo `FA-2607`), y desde ahí puedes ver su factura. Ese código es un identificador, como el número de pedido del Level 1.",
    "La pregunta de auditor es la de siempre: *¿el servidor comprueba que esa reserva es mía antes de darme la factura, o basta con conocer el código?*",
    {
      list: [
        "Abre tu factura y localiza el código de la reserva (en la URL o en la petición de Network).",
        "Cambia el código por otros cercanos (FA-2604, FA-2605, FA-2606...).",
        "Si obtienes la factura de otra reserva, el servidor no está comprobando permisos. La flag está en una de esas facturas ajenas.",
      ],
      ordered: true,
    },
    "Fíjate en que la app hace algunas cosas bien (la recepción sí está protegida) y otras mal (las facturas no). En una auditoría real es así: no todo falla, hay que encontrar *qué* falla.",
  ],
  solution: [
    "Auditamos el Hotel Faro Azul sin que nadie nos diga la técnica. Exploramos: como huéspedes vemos nuestra reserva y su factura. La recepción/gestión, en cambio, nos rechaza correctamente (esa parte está bien hecha).",
    "El punto interesante son las **facturas**. Al abrir la nuestra, el sistema la identifica por el código de reserva `FA-2607` (visible en la URL o en la petición de Network hacia `/api/labs/faro/reservas/FA-2607/factura`).",
    "Aplicamos lo aprendido: cambiamos el código. Con `FA-2604`, `FA-2605`, `FA-2606`... el servidor nos devuelve facturas de otros huéspedes, porque **no comprueba** que la reserva sea nuestra. Es el mismo patrón del Level 1 y el Level 4, en un escenario nuevo.",
    "Una de esas facturas ajenas corresponde a un bloqueo interno de la dirección del hotel, y en su nota de facturación está la flag.",
    {
      note: "Lo que se evalúa aquí no es memorizar «cambia FA-2607». Es reconocer, ante una app desconocida, que un recurso identificado sin control de permisos es un fallo de Broken Access Control.",
      tone: "ok",
    },
  ],

  postLab: {
    whatYouDid: [
      "Sin que nadie te dijera qué buscar, exploraste una app nueva, viste que las facturas se identifican por un código y comprobaste que el servidor las entregaba sin verificar de quién eran.",
      "Transferiste una idea aprendida en otro escenario a uno completamente distinto. Eso es exactamente lo que hace un auditor.",
    ],
    whyItWorked: [
      "La app identificaba cada factura por el código de reserva, pero el servidor no comprobaba que la reserva perteneciera al huésped que la pedía. Conocer el código bastaba para ver la factura.",
      "Es el mismo Broken Access Control de antes, con otra ropa. Por eso el checkpoint no daba pistas: quería ver si reconoces el patrón, no si recuerdas un número.",
    ],
    howItWorked: {
      flow: [
        { actor: "Tú (auditor)", action: "Abro mi factura FA-2607" },
        { actor: "App Faro", action: "Pido /api/.../reservas/FA-2607/factura" },
        { actor: "Tú (auditor)", action: "Cambio el código a FA-2605" },
        { actor: "Servidor Faro", action: "¿Es tuya esa reserva?", detail: "No se comprueba", highlight: true },
        { actor: "Servidor Faro", action: "Te doy la factura ajena", detail: "Con la flag dentro" },
      ],
      simple:
        "Es el guardarropa del Level 1 otra vez, pero en un hotel: das un número de resguardo y te dan la factura, sin comprobar que el resguardo es tuyo.",
      technical: [
        "El endpoint de factura recibe el código de reserva y devuelve el documento sin validar la propiedad del recurso frente a la sesión. Clásico IDOR/BOLA.",
        "Que la recepción sí estuviera protegida demuestra un patrón real: la seguridad se aplica de forma desigual. Encontrar el punto débil es el trabajo.",
      ],
      deep: [
        "El valor pedagógico del checkpoint es la **transferencia**: aplicar un modelo mental (recurso identificado ⇒ ¿hay control de acceso?) a un contexto nuevo, en lugar de repetir pasos memorizados.",
        "Un auditor no prueba «el truco de la tienda»: prueba hipótesis. Aquí la hipótesis «las facturas quizá no comprueban permisos» se confirmó cambiando un identificador.",
      ],
    },
    technicalName: {
      name: "Broken Access Control (IDOR sobre facturas)",
      aka: ["BOLA", "Insecure Direct Object Reference"],
      summary: "El mismo fallo de autorización de niveles anteriores, reconocido por ti en una aplicación nueva sin pistas previas.",
    },
    practicalUse: [
      "Confirma que ya no dependes de instrucciones paso a paso: puedes mirar una app y formular tus propias hipótesis de fallo.",
      "Esa capacidad de transferir ideas es la base de todo el pentesting web.",
    ],
    realWorldExamples: [
      { title: "Facturas de hotel o vuelos", description: "Códigos de reserva secuenciales que exponen facturas ajenas." },
      { title: "Justificantes y recibos", description: "PDFs accesibles por un identificador predecible." },
      { title: "Portales de cliente", description: "Áreas donde parte está protegida y parte no, de forma inconsistente." },
    ],
    howToRecognizeAgain: [
      "Ante cualquier app nueva, cataloga mentalmente sus recursos identificados (pedidos, facturas, tickets, reservas...) y prueba, uno a uno, si el servidor comprueba permisos.",
      "No asumas que porque una parte esté bien protegida, lo estén todas.",
    ],
    remediation: {
      explanation: [
        "Aplicar autorización por objeto de forma **consistente** en toda la aplicación: cada recurso, en cada endpoint, comprueba que pertenece (o es accesible) a quien lo pide.",
        "Las revisiones de seguridad y las pruebas automatizadas ayudan a que no queden endpoints olvidados.",
      ],
      code: [
        {
          title: "Vulnerable",
          lang: "ts",
          tone: "vulnerable",
          code: `const invoice = await invoices.byBookingCode(code);
return Response.json(invoice);`,
        },
        {
          title: "Corregido",
          lang: "ts",
          tone: "fixed",
          code: `const booking = await bookings.byCode(code);
if (!booking || booking.guestId !== session.guestId) {
  return new Response("No encontrado", { status: 404 });
}
return Response.json(toInvoice(booking));`,
        },
      ],
    },
    takeaway: "No memorices trucos: reconoce patrones. Un recurso identificado sin control de permisos es un fallo, esté donde esté.",
    reflection: {
      question: "¿Qué demuestra haber resuelto este checkpoint sin pistas?",
      options: [
        { id: "a", text: "Que memoricé bien los pasos del Level 1." },
        { id: "b", text: "Que sé reconocer el patrón de falta de control de acceso en una aplicación nueva." },
        { id: "c", text: "Que el hotel usa la misma web que la tienda." },
        { id: "d", text: "Que las flags siempre están en las facturas." },
      ],
      correctId: "b",
      explanation:
        "El objetivo del checkpoint es la transferencia: aplicar la idea (¿el servidor comprueba permisos sobre este recurso?) a un contexto distinto, sin seguir una receta.",
    },
  },
};
