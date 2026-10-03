import type { PlayableLabDefinition } from "../types";

export const level5: PlayableLabDefinition = {
  id: "level-5",
  slug: "level-5",
  kind: "level",
  number: 5,
  chapterId: "chapter-2",
  title: "¿Eres empleado porque lo dice tu navegador?",
  subtitle: "Un coworking decide quién manda mirando un dato que guarda... tu propio navegador.",
  difficulty: "principiante",
  estimatedMinutes: 15,
  labBrand: "Colmena Coworking",
  labUrl: "/labs/colmena",
  bestOnDesktop: true,
  unlockRequires: ["level-4"],
  prerequisites: ["level-4"],

  scenario: [
    "**Colmena** es un coworking con una app para reservar salas. Entras como **miembro** con un bono de 10 días.",
    "El personal tiene un panel de gestión (ocupación, llaves, códigos de puerta) que tú no ves. Hasta aquí, normal.",
    { note: "En este nivel vas a asomarte a dónde guarda el navegador ciertos datos. Todo está controlado por el laboratorio: no vas a robar nada de nadie.", tone: "info" },
  ],
  mission: [
    "Explora la app de Colmena como miembro.",
    "La app distingue entre «miembro» y «personal». Tu misión es averiguar **dónde** guarda la app ese dato y si puedes cambiarlo para que te trate como personal.",
    "Si accedes a la gestión del coworking, encontrarás una **flag**.",
  ],

  mentalModel: "El cliente no puede otorgarse permisos a sí mismo: el rol debe verificarse en el servidor.",

  hints: [
    {
      label: "Pista 1 — Hazme pensar",
      body: [
        "La app sabe que eres «miembro». ¿Dónde está guardada esa información? ¿En el servidor, lejos de tu alcance... o en tu propio navegador?",
        "Si el dato que decide tus permisos vive en tu navegador, ¿quién manda sobre él?",
      ],
    },
    {
      label: "Pista 2 — Dime dónde mirar",
      body: [
        "El navegador guarda datos por sitio web en varios sitios: **Cookies** y **Local Storage**, entre otros. Están en DevTools (F12), en la pestaña **Application** (o «Almacenamiento»).",
        "Busca algún valor que se parezca a tu rol o tipo de cuenta.",
      ],
    },
    {
      label: "Pista 3 — Ayúdame técnicamente",
      body: [
        "Abre DevTools → **Application** → **Cookies** (elige el sitio actual). Verás una cookie con tu rol, algo como `colmena_role = member`.",
        "Cambia su valor a `staff` (doble clic sobre el valor), vuelve al panel de gestión y recárgalo.",
        "Pregunta clave: ¿el servidor comprueba tu rol de verdad, o se cree lo que diga esa cookie?",
      ],
    },
  ],
  lost: [
    "Tu navegador guarda pequeños datos por cada web que visitas. Dos sitios habituales son las **cookies** y el **local storage**. Sirven para recordar cosas: tu sesión, tu idioma, el carrito... y a veces, por error, hasta tu rol.",
    "Lo importante: esos datos están **en tu navegador**, así que puedes verlos y modificarlos. Si una app decide tus permisos leyendo una cookie que tú controlas, esa app tiene un problema.",
    {
      list: [
        "Abre DevTools (F12) → pestaña Application → Cookies, y selecciona este sitio.",
        "Busca una cookie que represente tu rol (por ejemplo `colmena_role` con valor `member`).",
        "Cámbiala a `staff` y recarga el panel de gestión.",
        "Si entras, el servidor se estaba fiando de un dato que tú controlas.",
      ],
      ordered: true,
    },
    "Ojo con la diferencia: recordar tu **idioma** en una cookie está bien (es una preferencia). Guardar tu **rol de seguridad** en una cookie que el cliente controla, no: eso es autorización, y va en el servidor.",
  ],
  solution: [
    "Auditamos Colmena. La app nos trata como miembro y nos oculta la gestión. La pregunta es de dónde saca la app nuestro rol.",
    "En DevTools → **Application** → **Cookies** encontramos una cookie `colmena_role` con valor `member`. Es decir: el rol que decide nuestros permisos está guardado **en nuestro propio navegador**.",
    "Cambiamos el valor de la cookie a `staff` y recargamos el panel de gestión. El servidor lee la cookie, se cree que somos personal y nos deja entrar: ocupación, llaves y el código de puerta, donde está la flag.",
    {
      note: "El servidor delegó la decisión de «¿eres personal?» en un dato que el cliente controla. Un rol nunca debe vivir en una cookie manipulable: debe derivarse de una sesión firmada/verificada en el servidor.",
      tone: "warn",
    },
    "Diferencia clave con el idioma: `colmena_lang=es` es una preferencia inofensiva; `colmena_role=staff` es un permiso. Los permisos no se guardan donde el usuario puede editarlos.",
  ],

  postLab: {
    whatYouDid: [
      "Encontraste una cookie en tu navegador que guardaba tu rol y la cambiaste de `member` a `staff`. El servidor te creyó y te dejó entrar en la gestión del coworking.",
    ],
    whyItWorked: [
      "El navegador guarda cookies y local storage por sitio, y tú puedes editarlos libremente desde DevTools.",
      "La app usaba una de esas cookies (`colmena_role`) para decidir tus privilegios. Como ese dato lo controlas tú, en la práctica podías darte a ti mismo el rol que quisieras. El servidor nunca verificó de forma segura quién eras.",
    ],
    howItWorked: {
      flow: [
        { actor: "Tú (navegador)", action: "Edito la cookie colmena_role: member → staff" },
        { actor: "Tú (navegador)", action: "Recargo el panel de gestión" },
        { actor: "Servidor Colmena", action: "Leo la cookie de rol", detail: "Me fío de lo que diga", highlight: true },
        { actor: "Servidor Colmena", action: "Rol = staff → acceso concedido", detail: "Te muestro la gestión" },
      ],
      simple:
        "Es como una fiesta donde la pulsera VIP te la pones tú mismo en casa y el portero solo mira que la lleves. Cualquiera se pone la pulsera y entra.",
      technical: [
        "El estado de sesión/rol se almacenó en una cookie legible y editable por el cliente. El backend confió en su valor sin ninguna verificación de integridad.",
        "Lo correcto es que el rol se derive de una sesión del servidor: o bien la cookie es solo un identificador de sesión opaco (y el rol se busca en el servidor), o bien es un token firmado (JWT) cuya firma se valida. Un valor `role=staff` en claro no vale.",
        "Distinción importante: cookies como preferencias (idioma, tema) son legítimas; cookies que gobiernan la autorización deben ser inviolables para el cliente.",
      ],
      deep: [
        "De nuevo es **Broken Access Control**, aquí por confiar en estado controlado por el cliente para decidir privilegios (*trusting client-side state* / *privilege escalation*).",
        "Relacionado: si en vez de `role=staff` fuera un JWT, el ataque equivalente sería manipular sus claims cuando la firma no se valida (o se acepta `alg: none`). El principio es el mismo: la autoridad la tiene el servidor, no el token que guarda el cliente.",
        "Buenas prácticas: sesiones del lado servidor o tokens firmados y verificados, cookies `HttpOnly`/`Secure`/`SameSite`, y jamás almacenar el rol como un valor editable.",
      ],
    },
    technicalName: {
      name: "Confiar en estado del cliente para la autorización",
      aka: ["Client-Side Trust", "Privilege Escalation", "Broken Access Control"],
      summary: "El servidor decide los privilegios a partir de un dato (cookie/localStorage) que el usuario controla y puede modificar.",
    },
    practicalUse: [
      "Aprendes dónde guarda el navegador los datos de un sitio y a distinguir una preferencia inocua de un permiso mal guardado.",
      "Es una base directa para entender más adelante sesiones, cookies seguras y JWT.",
    ],
    realWorldExamples: [
      { title: "Cookie isAdmin=false", description: "Cambiarla a true y ganar acceso de administrador." },
      { title: "localStorage con el plan", description: "Un `plan=free` editable a `premium` que desbloquea funciones." },
      { title: "JWT sin verificar", description: "Un token cuyos permisos se aceptan sin validar la firma." },
      { title: "Rol en un campo oculto", description: "Un `role` enviado en cada petición y aceptado por el servidor." },
    ],
    howToRecognizeAgain: [
      "Cuando una app te asigne un rol o plan, mira en DevTools → Application si ese dato está en una cookie o en local storage con un valor legible.",
      "Si puedes cambiarlo y la app te trata distinto, el servidor confía en el cliente para la autorización: eso es escalada de privilegios.",
    ],
    remediation: {
      explanation: [
        "El rol y los permisos deben vivir y verificarse en el servidor. La cookie del cliente, como mucho, es un identificador de sesión opaco o un token firmado que el servidor valida en cada petición.",
        "Nunca deduzcas privilegios de un valor que el usuario puede editar.",
      ],
      code: [
        {
          title: "Vulnerable",
          lang: "ts",
          tone: "vulnerable",
          code: `// Se fía del rol que trae la cookie del cliente.
const role = cookies.get("colmena_role");
if (role === "staff") return renderManagement();`,
        },
        {
          title: "Corregido",
          lang: "ts",
          tone: "fixed",
          code: `// La cookie solo identifica la sesión; el rol se busca en el servidor.
const sessionId = cookies.get("session");
const session = await sessions.verify(sessionId);
if (session?.role === "staff") return renderManagement();
return new Response("No autorizado", { status: 403 });`,
        },
      ],
    },
    takeaway: "El cliente no puede otorgarse permisos a sí mismo. Los roles se verifican en el servidor, no en una cookie editable.",
    reflection: {
      question: "¿Por qué está mal guardar `role=staff` en una cookie del navegador?",
      options: [
        { id: "a", text: "Porque las cookies ocupan mucho espacio." },
        { id: "b", text: "Porque el usuario controla esa cookie y puede cambiar su rol; la autorización debe verificarse en el servidor." },
        { id: "c", text: "Porque las cookies no funcionan sin internet." },
        { id: "d", text: "Porque el idioma también se guarda en cookies." },
      ],
      correctId: "b",
      explanation:
        "Todo lo que el cliente guarda, el cliente lo puede editar. Un permiso guardado ahí puede autoconcederse. La autoridad sobre los roles tiene que estar en el servidor.",
    },
  },
};
