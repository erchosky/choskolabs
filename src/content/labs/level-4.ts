import type { PlayableLabDefinition } from "../types";

export const level4: PlayableLabDefinition = {
  id: "level-4",
  slug: "level-4",
  kind: "level",
  number: 4,
  chapterId: "chapter-2",
  title: "Mi ticket de soporte",
  subtitle: "Abres tu ticket y todo parece normal. Pero, ¿qué está pidiendo la web por detrás?",
  difficulty: "principiante",
  estimatedMinutes: 15,
  labBrand: "Nimbo",
  labUrl: "/labs/nimbo",
  bestOnDesktop: true,
  unlockRequires: ["level-3"],
  prerequisites: ["level-3"],

  scenario: [
    "**Nimbo** es un servicio ficticio de almacenamiento en la nube. Has abierto un ticket de soporte porque tus fotos no se sincronizan, y estás leyendo la conversación con el agente.",
    "La página parece sencilla: tu ticket y poco más. Pero una aplicación moderna hace muchas cosas **por detrás** que no ves directamente en pantalla.",
    { note: "Este nivel es tu primera toma de contacto con las peticiones «invisibles» que hace una web. Se disfruta mejor en escritorio, con DevTools.", tone: "info" },
  ],
  mission: [
    "Abre tu ticket de soporte en Nimbo.",
    "Tu objetivo aquí es doble: **descubrir cómo la página consigue los datos del ticket** (no viajan en la URL) y, a partir de ahí, comprobar si puedes ver algo que no debería ser tuyo.",
    "Hay una **flag** escondida en información que la interfaz nunca llega a mostrarte.",
  ],

  mentalModel: "Lo que ves en pantalla es solo una parte de lo que hace la aplicación: por detrás pide datos a una API.",

  hints: [
    {
      label: "Pista 1 — Hazme pensar",
      body: [
        "La página muestra tu ticket, pero el número del ticket no aparece en la barra de direcciones. Entonces, ¿de dónde saca la página el contenido?",
        "Algo, en algún momento, tuvo que ir a buscar esos mensajes. ¿Quién y a dónde?",
      ],
    },
    {
      label: "Pista 2 — Dime dónde mirar",
      body: [
        "Abre DevTools (F12) y ve a la pestaña **Network** (Red). Luego **recarga la página** con Network abierto.",
        "Verás una lista de peticiones que hace la web. Busca una que parezca traer los datos del ticket (suele devolver **JSON**).",
      ],
    },
    {
      label: "Pista 3 — Ayúdame técnicamente",
      body: [
        "En Network, filtra por «Fetch/XHR». Verás una petición a algo como `/api/labs/nimbo/tickets/431`. Ese `431` es el id de tu ticket, y la respuesta es un JSON con los mensajes.",
        "Prueba a abrir esa misma dirección de la API cambiando el número (`.../tickets/430`, `429`, `427`...) y lee el JSON que devuelve.",
        "Mira **todo** el JSON con calma: puede contener campos que la página bonita nunca te enseña.",
      ],
    },
  ],
  lost: [
    "Una web moderna no es solo la página que ves. Por debajo, su JavaScript hace **peticiones a una API**: le pide datos al servidor y luego los dibuja en pantalla. Esas peticiones no las ves a simple vista, pero DevTools sí.",
    "El circuito es este: la **página** ejecuta **JavaScript**, que llama a una **API**, que responde con **JSON** (datos en texto), y la página convierte ese JSON en lo que ves.",
    {
      list: [
        "Abre DevTools (F12) → pestaña Network y recarga la página.",
        "Busca una petición tipo «Fetch/XHR» que traiga el ticket: será una URL como `/api/labs/nimbo/tickets/431`.",
        "Abre esa URL cambiando el número por otros y lee el JSON completo.",
        "Fíjate en campos internos que la interfaz no muestra (por ejemplo notas internas). Ahí puede estar la flag.",
      ],
      ordered: true,
    },
    "Dos ideas de golpe: (1) las apps hablan con APIs que no ves, y (2) una API también necesita comprobar permisos, igual que una página.",
  ],
  solution: [
    "Auditamos el soporte de Nimbo. La página muestra tu ticket, pero el identificador no está en la URL: eso ya es una pista de que los datos llegan por otra vía.",
    "Abrimos DevTools → **Network**, recargamos, y filtramos por Fetch/XHR. Aparece una petición a `/api/labs/nimbo/tickets/431` cuya respuesta es un **JSON** con los mensajes del ticket. Así descubrimos la API que alimenta la página.",
    "Ahora combinamos esto con lo aprendido en niveles anteriores: cambiamos el número. Al pedir `/api/labs/nimbo/tickets/427` (y otros), la API devuelve tickets de otras personas, incluido uno interno del equipo de soporte.",
    "Además, el JSON incluye un campo `internal_notes` que la interfaz nunca pinta. En las notas internas del ticket interno está la flag. La API entregaba más datos de los que la pantalla mostraba, y sin comprobar de quién era el ticket.",
    {
      note: "Dos fallos encadenados: la API no comprueba autorización (como en el Level 1) y además expone campos internos. La pantalla ocultaba esos campos, pero la API los enviaba igual.",
      tone: "warn",
    },
  ],

  postLab: {
    whatYouDid: [
      "Descubriste que la página pedía tus datos a una API por detrás, encontraste esa API en la pestaña Network y, cambiando el número del ticket, leíste conversaciones ajenas y campos internos que la pantalla nunca mostraba.",
    ],
    whyItWorked: [
      "La interfaz que ves es solo la capa visible. Los datos venían de una API (`/api/.../tickets/431`) que responde en JSON. Con DevTools → Network puedes ver y repetir esas peticiones.",
      "La API tenía dos problemas: no comprobaba si el ticket era tuyo (Broken Access Control) y devolvía campos internos (`internal_notes`) que el frontend simplemente no dibujaba. Ocultar un dato en la pantalla no lo elimina de la respuesta.",
    ],
    howItWorked: {
      flow: [
        { actor: "Página Nimbo", action: "Al cargar, ejecuto JavaScript" },
        { actor: "JavaScript", action: "Llamo a /api/labs/nimbo/tickets/431", detail: "Fetch/XHR" },
        { actor: "API Nimbo", action: "Respondo JSON del ticket", detail: "Incluye internal_notes que la UI no pinta", highlight: true },
        { actor: "Tú (navegador)", action: "Repito la llamada con 427", detail: "Y leo un ticket que no es mío" },
      ],
      simple:
        "La página es como el escaparate de una tienda; la API es el almacén de atrás. Aprendiste a mirar en el almacén, y descubriste que estaba abierto para cualquiera y que guardaba cosas que en el escaparate no se veían.",
      technical: [
        "El navegador hace una petición asíncrona (`fetch`) a un endpoint REST que devuelve JSON. La pestaña Network de DevTools muestra la URL, la cabecera, la respuesta y permite reproducirla.",
        "El endpoint `GET /api/.../tickets/:id` no valida que el `:id` pertenezca al usuario autenticado (IDOR sobre API, también llamado **BOLA**), y serializa el objeto completo, incluyendo campos internos.",
        "Regla: una API es una interfaz más. Necesita los mismos controles de acceso que una página, y debe devolver solo los campos que el cliente debe ver.",
      ],
      deep: [
        "El acceso a tickets ajenos es **BOLA** (Broken Object Level Authorization), el riesgo nº 1 del OWASP API Security Top 10. La fuga de `internal_notes` es **Excessive Data Exposure** (nº 3 clásico), donde el backend confía en que el cliente filtre los campos.",
        "Las APIs son especialmente propensas a esto porque a menudo se diseñan pensando solo en «su» frontend, olvidando que cualquiera puede llamarlas directamente con `curl`, Postman o repitiendo la petición desde Network.",
        "Buenas prácticas: autorización por objeto en cada endpoint, DTOs/serializadores que expongan solo lo necesario, y no confiar en que la UI oculte datos sensibles.",
      ],
    },
    technicalName: {
      name: "APIs inseguras: BOLA + exposición de datos",
      aka: ["Broken Object Level Authorization", "IDOR en API", "Excessive Data Exposure"],
      summary: "Una API que devuelve objetos de otras personas (sin comprobar permisos) y/o incluye campos internos que el frontend simplemente no muestra.",
    },
    practicalUse: [
      "Aprender a leer la pestaña Network es una de las habilidades más útiles al probar webs y apps: revela lo que de verdad ocurre por debajo.",
      "Muchísimas apps móviles y web hablan con APIs. Saber inspeccionarlas te abre la mitad del trabajo de auditoría.",
    ],
    realWorldExamples: [
      { title: "App móvil de banca", description: "La app pide /accounts/123; cambiar el id muestra otra cuenta." },
      { title: "Chats de soporte", description: "Endpoints de conversación accesibles cambiando el id del hilo." },
      { title: "Perfiles de usuario", description: "Una API que devuelve el email o el teléfono aunque la pantalla no los muestre." },
      { title: "Paneles con exportación", description: "JSON con campos internos (roles, notas, flags de negocio) filtrados al cliente." },
    ],
    howToRecognizeAgain: [
      "Cuando una página muestre datos sin que su origen aparezca en la URL, abre Network y busca la API que los sirve.",
      "Sobre cada endpoint hazte dos preguntas: *¿comprueba que el objeto es mío si cambio el id?* y *¿me está enviando más campos de los que la pantalla enseña?*",
    ],
    remediation: {
      explanation: [
        "Cada endpoint de la API debe comprobar la autorización a nivel de objeto (¿este usuario puede ver *este* recurso?) y devolver únicamente los campos que el cliente necesita.",
        "No confíes en que el frontend oculte datos: si están en la respuesta, están expuestos.",
      ],
      code: [
        {
          title: "Vulnerable",
          lang: "ts",
          tone: "vulnerable",
          code: `// Devuelve cualquier ticket, con todos sus campos.
const ticket = await db.tickets.findById(params.id);
return Response.json(ticket); // incluye internal_notes`,
        },
        {
          title: "Corregido",
          lang: "ts",
          tone: "fixed",
          code: `const ticket = await db.tickets.findById(params.id);
if (!ticket || ticket.customerId !== session.userId) {
  return new Response("No encontrado", { status: 404 });
}
// Enviar solo campos públicos:
const { internalNotes, ...safe } = ticket;
return Response.json(safe);`,
        },
      ],
    },
    takeaway: "Lo que ves en pantalla es solo una parte. Detrás hay una API, y también necesita permisos y prudencia con los datos que envía.",
    reflection: {
      question: "¿Qué dos problemas tenía la API de Nimbo?",
      options: [
        { id: "a", text: "Era lenta y usaba demasiada memoria." },
        { id: "b", text: "No comprobaba de quién era el ticket y enviaba campos internos que la pantalla ocultaba." },
        { id: "c", text: "No usaba HTTPS." },
        { id: "d", text: "Mostraba la flag en la barra de direcciones." },
      ],
      correctId: "b",
      explanation:
        "Por un lado dejaba leer tickets ajenos (falta de autorización por objeto); por otro, incluía notas internas en el JSON, confiando en que la interfaz no las mostrara.",
    },
  },
};
