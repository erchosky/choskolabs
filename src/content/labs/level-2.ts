import type { PlayableLabDefinition } from "../types";

export const level2: PlayableLabDefinition = {
  id: "level-2",
  slug: "level-2",
  kind: "level",
  number: 2,
  chapterId: "chapter-1",
  title: "La opción que no existe",
  subtitle: "Una app de gimnasio esconde funciones «solo para el personal». ¿Escondidas o protegidas?",
  difficulty: "principiante",
  estimatedMinutes: 12,
  labBrand: "PulsoFit",
  labUrl: "/labs/pulsofit",
  bestOnDesktop: true,
  unlockRequires: ["level-1"],
  prerequisites: ["level-1"],

  scenario: [
    "**PulsoFit** es la app de tu gimnasio. Entras como **socio**: puedes ver tus clases, reservar y consultar tu plan.",
    "En la pantalla de inicio, un aviso dice:",
    { note: "«Algunas funciones (caja, incidencias, exportar socios...) están disponibles solo para el personal del centro.»", tone: "info" },
    "Tú no eres del personal. En tu menú no aparece nada de eso. Pero, ¿de verdad no puedes llegar hasta ahí?",
  ],
  mission: [
    "Explora la app de PulsoFit como socio.",
    "La app dice que el panel del personal está reservado. Comprueba si esa función está **realmente protegida** o solo **escondida** de tu vista.",
    "Si consigues llegar al panel del personal, encontrarás una **flag**.",
  ],

  mentalModel: "Ocultar un botón no protege una función: la seguridad no puede vivir solo en el frontend.",

  hints: [
    {
      label: "Pista 1 — Hazme pensar",
      body: [
        "Que tú no veas un botón, ¿significa que la función no existe? ¿O solo que la app ha decidido no mostrártela?",
        "Piensa en la diferencia entre *«no me lo enseñan»* y *«no puedo entrar»*.",
      ],
    },
    {
      label: "Pista 2 — Dime dónde mirar",
      body: [
        "La página que ves es HTML que tu navegador ha recibido y dibujado. A veces ese HTML incluye enlaces o botones que están **presentes pero ocultos**.",
        "Aquí entran en juego las **DevTools** del navegador (clic derecho → «Inspeccionar», o F12). Te dejan mirar el HTML real de la página, incluso las partes que no se ven.",
      ],
    },
    {
      label: "Pista 3 — Ayúdame técnicamente",
      body: [
        "Abre DevTools (F12) y ve a la pestaña **Elements** (o «Inspector»). Busca en el HTML un enlace hacia una zona de personal; puede estar marcado como `hidden` o con `display:none`.",
        "Fíjate a qué dirección apunta (algo como `/labs/pulsofit/staff`). Escríbela directamente en la barra de direcciones y mira qué ocurre.",
        "Pregunta clave: ¿el servidor te frena por no ser del personal, o te deja pasar igual?",
      ],
    },
  ],
  lost: [
    "La pantalla que ves no es la aplicación entera: es solo el **HTML** que el servidor te ha enviado y que tu navegador ha dibujado. Ese HTML lo puedes inspeccionar por completo.",
    "Con las **DevTools** (F12 → pestaña Elements) ves el código real de la página. Muchas apps «esconden» funciones simplemente marcando un enlace como oculto, pero el enlace sigue ahí.",
    {
      list: [
        "Abre DevTools con F12 y entra en la pestaña Elements.",
        "Busca un enlace o botón oculto que mencione al personal (staff, empleados, caja...).",
        "Copia la dirección a la que apunta y ábrela tú mismo en la barra de direcciones.",
      ],
      ordered: true,
    },
    "Si la app solo *ocultaba* la opción pero el servidor no comprueba tu rol, entrarás sin problema. Ahí estará la flag. Esconder no es lo mismo que proteger.",
  ],
  solution: [
    "Auditamos PulsoFit. Como socios, la interfaz no nos ofrece el panel del personal. Pero «no ofrecer» no es «bloquear».",
    "Abrimos DevTools (F12) → **Elements** e inspeccionamos el HTML. Aparece un enlace al panel del personal que la app ha marcado como oculto (`hidden`) para que los socios no lo vean. El enlace apunta a `/labs/pulsofit/staff`.",
    "Escribimos esa dirección directamente en el navegador. Si la seguridad estuviera bien hecha, el servidor comprobaría que no somos personal y nos rechazaría. En cambio, la página se abre: dentro está el panel completo (caja, incidencias, exportaciones) y la flag.",
    {
      note: "La app solo escondía la opción en el navegador. La decisión de «¿puede entrar?» nunca se tomó en el servidor.",
      tone: "warn",
    },
    "Nota: usamos DevTools para *ver* el enlace, pero el fallo no es que se pueda inspeccionar el HTML (eso es normal). El fallo es que el servidor no protege la ruta.",
  ],

  postLab: {
    whatYouDid: [
      "Descubriste un enlace que la app te ocultaba y, al abrirlo tú mismo, entraste en un panel pensado solo para el personal.",
      "La app confiaba en que, si no te mostraba el botón, no llegarías ahí. Te bastó con mirar el HTML.",
    ],
    whyItWorked: [
      "El navegador recibe todo el HTML de la página y lo dibuja. Ocultar un elemento (con `hidden` o `display:none`) solo afecta a lo que *se ve*: el contenido sigue ahí y es inspeccionable.",
      "Pero el fallo de fondo no es que el enlace fuese visible en el HTML. Es que, al pedir `/labs/pulsofit/staff`, el **servidor no comprobó tu rol**. Aunque el enlace hubiera estado perfectamente oculto, escribir la dirección a mano habría funcionado igual.",
    ],
    howItWorked: {
      flow: [
        { actor: "Servidor PulsoFit", action: "Te envío la página de socio", detail: "Con el enlace de staff marcado como oculto" },
        { actor: "Tú (navegador)", action: "Inspecciono el HTML y encuentro /labs/pulsofit/staff" },
        { actor: "Tú (navegador)", action: "Abro esa dirección directamente" },
        { actor: "Servidor PulsoFit", action: "¿Es del personal quien lo pide?", detail: "NUNCA se comprobó", highlight: true },
        { actor: "Servidor PulsoFit", action: "Te muestro el panel del personal", detail: "Acceso concedido por error" },
      ],
      simple:
        "Es como tapar la puerta de la trastienda con una cortina en lugar de con una cerradura. Quien aparte la cortina entra: nunca hubo llave.",
      technical: [
        "El frontend decidió no *renderizar* visualmente el enlace al panel de staff para los socios, pero lo dejó en el DOM. Con DevTools se ve y se copia la ruta.",
        "El problema real es del backend: la ruta `/labs/pulsofit/staff` no verifica el rol de la sesión antes de responder. Debería devolver 403 (o 404) a quien no sea personal.",
        "Controlar la visibilidad en el cliente es cuestión de experiencia de usuario, no de seguridad.",
      ],
      deep: [
        "Esto es de nuevo **Broken Access Control**, en su variante de **función/ruta desprotegida** (a veces llamada *forced browsing* o *missing function level access control*).",
        "La lección general: el frontend decide **qué mostrar**; el backend debe decidir **qué está permitido**. Toda la lógica de autorización que solo vive en JavaScript del navegador es, en la práctica, opcional para un atacante.",
        "Ocultar, ofuscar o minificar el código cliente no aporta seguridad real: es *security through obscurity*.",
      ],
    },
    technicalName: {
      name: "Broken Access Control (control de acceso a nivel de función)",
      aka: ["Missing Function Level Access Control", "Forced Browsing"],
      summary: "Una función o ruta privilegiada queda accesible porque el servidor no comprueba el rol/permiso: solo se «escondía» en la interfaz.",
    },
    practicalUse: [
      "Te enseña a no fiarte de lo que la interfaz te muestra (o te oculta) y a preguntarte siempre qué comprueba el servidor.",
      "Como desarrollador, te recuerda que cada ruta o acción sensible necesita su propia comprobación de permisos en el backend.",
    ],
    realWorldExamples: [
      { title: "Panel de administración", description: "Un /admin que carga aunque tu cuenta no sea admin." },
      { title: "Botón «eliminar» oculto", description: "La acción destructiva sigue disponible por API aunque no veas el botón." },
      { title: "Menús premium", description: "Funciones de pago ocultas para cuentas gratuitas pero accesibles por su ruta." },
      { title: "Exportar datos", description: "Un endpoint de exportación pensado para managers, abierto a cualquiera." },
    ],
    howToRecognizeAgain: [
      "Cuando una app diga «esto es solo para X», comprueba si de verdad te frena o solo te esconde la opción.",
      "Inspecciona el HTML (DevTools → Elements) buscando enlaces o botones ocultos, y prueba a abrir directamente rutas privilegiadas. Si cargan, la protección estaba solo en la pantalla.",
    ],
    remediation: {
      explanation: [
        "Cada ruta y cada acción sensible debe verificar en el **servidor** que la sesión tiene el rol o permiso necesario, antes de hacer nada.",
        "Ocultar el enlace en el frontend está bien para no confundir al usuario, pero **nunca** sustituye a la comprobación del servidor.",
      ],
      code: [
        {
          title: "Vulnerable",
          lang: "ts",
          tone: "vulnerable",
          code: `// La ruta responde a cualquiera; el enlace solo se ocultaba en el HTML.
export function GET() {
  return renderStaffPanel();
}`,
        },
        {
          title: "Corregido",
          lang: "ts",
          tone: "fixed",
          code: `export function GET() {
  if (session.role !== "staff") {
    return new Response("No autorizado", { status: 403 });
  }
  return renderStaffPanel();
}`,
        },
      ],
    },
    takeaway: "Ocultar un botón no protege una función. El servidor debe comprobar quién puede entrar.",
    reflection: {
      question: "¿Por qué pudiste entrar en el panel del personal?",
      options: [
        { id: "a", text: "Porque adiviné una contraseña." },
        { id: "b", text: "Porque el enlace estaba oculto en el HTML pero el servidor no comprobaba mi rol." },
        { id: "c", text: "Porque desactivé el JavaScript de la página." },
        { id: "d", text: "Porque el gimnasio me dio permisos de personal." },
      ],
      correctId: "b",
      explanation:
        "La app solo escondía la opción en la interfaz. Como el servidor no verificaba el rol al pedir la ruta, abrirla directamente bastó.",
    },
  },
};
