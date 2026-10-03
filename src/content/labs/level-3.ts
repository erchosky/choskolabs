import type { PlayableLabDefinition } from "../types";

export const level3: PlayableLabDefinition = {
  id: "level-3",
  slug: "level-3",
  kind: "level",
  number: 3,
  chapterId: "chapter-2",
  title: "El precio no lo decides tú",
  subtitle: "Una web de entradas jura que siempre cobra el precio correcto. Vamos a comprobarlo.",
  difficulty: "principiante",
  estimatedMinutes: 14,
  labBrand: "Taquilla Norte",
  labUrl: "/labs/taquilla",
  bestOnDesktop: true,
  unlockRequires: ["level-2"],
  prerequisites: ["level-2"],

  scenario: [
    "**Taquilla Norte** vende entradas para conciertos y festivales. Quieres una entrada general para el **Festival Ola Sur**: cuesta **50 €**.",
    "En su web presumen de tienda segura:",
    { note: "«El importe final siempre lo calcula nuestro servidor. Es imposible pagar un precio distinto al real.»", tone: "info" },
    "Vas a poner a prueba esa afirmación. (Tranquilo: no se cobra nada de verdad; no hay pasarela de pago ni datos bancarios en este laboratorio.)",
  ],
  mission: [
    "Ve a comprar la entrada del Festival Ola Sur en Taquilla Norte.",
    "La web asegura que el servidor siempre cobra el precio correcto. Comprueba si eso es cierto: intenta que el servidor acepte un importe que **tú** decidas, no el real.",
    "Si el servidor procesa un cobro con un precio que no debería aceptar, aparecerá una **flag**.",
  ],

  mentalModel: "El servidor debe validar y calcular los datos importantes; jamás confiar en los que llegan del cliente.",

  hints: [
    {
      label: "Pista 1 — Hazme pensar",
      body: [
        "Cuando pulsas «Comprar», ¿qué información viaja de tu navegador al servidor? ¿Solo *qué* compras... o también *cuánto* cuesta?",
        "Si el precio viaja desde tu navegador, ¿quién controla realmente ese dato antes de que salga?",
      ],
    },
    {
      label: "Pista 2 — Dime dónde mirar",
      body: [
        "Mira el formulario de compra con DevTools (F12 → Elements). Además de la cantidad, puede haber datos que se envían pero **no se muestran** como campos editables normales.",
        "También puedes vigilar la petición que sale al pulsar «Comprar» en la pestaña **Network** de DevTools.",
      ],
    },
    {
      label: "Pista 3 — Ayúdame técnicamente",
      body: [
        "En el formulario hay un campo oculto (`<input type=\"hidden\">`) con el precio, por ejemplo `price=\"50\"`. Ese valor se envía tal cual al servidor.",
        "Con DevTools → Elements puedes editar ese valor antes de comprar (doble clic sobre el atributo y cámbialo, p. ej. a `1`). O, en Network, reenviar la petición cambiando el precio.",
        "Luego completa la compra y observa el recibo: ¿qué importe ha aceptado el servidor?",
      ],
    },
  ],
  lost: [
    "Cuando compras algo online, tu navegador envía al servidor los datos de la compra. La pregunta clave de seguridad es: *¿qué datos y quién los controla?*",
    "En muchas webs mal hechas, el **precio** viaja desde el navegador (por ejemplo en un campo oculto del formulario). Y todo lo que sale de tu navegador lo puedes cambiar antes de enviarlo.",
    {
      list: [
        "Abre DevTools (F12) → Elements y localiza el formulario de compra.",
        "Busca un campo oculto con el precio (algo como `type=\"hidden\" ... value=\"50\"`).",
        "Edítalo a un valor menor (por ejemplo `1`) y completa la compra.",
        "Lee el recibo: si el servidor ha aceptado tu precio, ha confiado en un dato que no debía.",
      ],
      ordered: true,
    },
    "Esto no enseña a estafar a nadie: todo es ficticio. Enseña una idea fundamental: **cualquier dato que envía el cliente puede ser manipulado**, así que el servidor debe calcular él mismo lo importante.",
  ],
  solution: [
    "Auditamos el checkout de Taquilla Norte. La entrada cuesta 50 €, pero queremos saber de dónde sale ese número cuando pulsamos «Comprar».",
    "Inspeccionando el formulario (DevTools → Elements) encontramos un campo oculto `price` con valor `50`. Ese campo se envía al servidor junto con el producto y la cantidad. Es decir: **el precio lo está diciendo el navegador**, no el servidor.",
    "Cambiamos ese valor (por ejemplo a `1`) directamente en el HTML y completamos la compra. El servidor genera el recibo cobrando **1 €** en lugar de 50 €: ha aceptado el precio que le mandamos sin comprobar el real.",
    "En ese momento el laboratorio detecta el desajuste entre el precio real y el cobrado, y te muestra la flag.",
    {
      note: "El servidor debería haber ignorado el precio del cliente y calcularlo así: recibo el `productId` → busco su precio real en mi catálogo → cobro ese. La cantidad se valida; el precio no se pregunta.",
      tone: "warn",
    },
  ],

  postLab: {
    whatYouDid: [
      "Modificaste el precio que tu navegador enviaba al comprar y el servidor lo aceptó, cobrando un importe distinto al real.",
      "En resumen: le dijiste al servidor cuánto querías pagar... y te hizo caso.",
    ],
    whyItWorked: [
      "El formulario enviaba el precio desde el navegador (en un campo oculto). Todo lo que envía el cliente está bajo control del usuario: se puede leer y cambiar.",
      "El servidor usó ese precio para generar el cobro en lugar de buscar el precio real del producto en su propia base de datos. Confió en un dato manipulable.",
    ],
    howItWorked: {
      flow: [
        { actor: "Tú (navegador)", action: "Edito el campo oculto price: 50 → 1" },
        { actor: "Tú (navegador)", action: "Envío la compra", detail: "productId + cantidad + price=1" },
        { actor: "Servidor Taquilla", action: "¿Cuánto cobro?", detail: "Uso el price que llegó del cliente", highlight: true },
        { actor: "Servidor Taquilla", action: "Genero recibo por 1 €", detail: "Debería haber sido 50 €" },
      ],
      simple:
        "Imagina un supermercado donde tú mismo escribes en la etiqueta lo que cuesta cada cosa y la caja se fía de tu etiqueta. Evidentemente, alguien pondrá «1 €» a lo que vale 50.",
      technical: [
        "La petición de compra incluía un parámetro `price` controlado por el cliente. El backend lo tomó como fuente de verdad para el importe.",
        "Lo correcto es que el servidor reciba únicamente `productId` y `quantity`, busque el precio en su catálogo (`price = catalog[productId].price`) y calcule `total = price * quantity`. El `price` que llegue del cliente debe ignorarse por completo.",
        "Esto también aplica a descuentos, cupones, saldos, roles... cualquier dato con consecuencias debe calcularse o validarse en servidor.",
      ],
      deep: [
        "Es un fallo de **lógica de negocio** por **exceso de confianza en datos del cliente** (client-side trust). En OWASP encaja en *Insecure Design* y en la vieja categoría *tampering* de parámetros.",
        "Regla mental: **todo input del cliente es hostil hasta que el servidor lo valida**. El navegador es territorio del usuario; DevTools, proxies como Burp o un simple `curl` permiten enviar cualquier valor.",
        "Variantes clásicas: cambiar `quantity` a negativo para generar abonos, alterar `currency`, manipular `userId` en una transferencia, o forzar `isAdmin=true`.",
      ],
    },
    technicalName: {
      name: "Confianza indebida en datos del cliente (parameter tampering)",
      aka: ["Client-Side Trust", "Business Logic Flaw", "Insecure Design"],
      summary: "El servidor toma decisiones importantes (como el precio) a partir de datos que el cliente puede modificar, en vez de calcularlos o validarlos por su cuenta.",
    },
    practicalUse: [
      "Es uno de los fallos con impacto económico más directo, y muy común en tiendas y reservas.",
      "Te entrena para desconfiar de cualquier dato con consecuencias que viaje desde el cliente, tanto auditando como programando.",
    ],
    realWorldExamples: [
      { title: "Precio en el carrito", description: "Un campo oculto con el importe que el backend acepta sin recalcular." },
      { title: "Descuentos y cupones", description: "Un porcentaje enviado por el cliente y aplicado sin verificar." },
      { title: "Cantidad negativa", description: "Comprar «-2» unidades para generar un abono." },
      { title: "Saldo o puntos", description: "Modificar los puntos de fidelidad enviados en la petición." },
    ],
    howToRecognizeAgain: [
      "Ante cualquier operación con dinero, permisos o límites, pregúntate: *¿este dato viene del cliente? ¿el servidor lo recalcula o se lo cree?*",
      "En Network, mira qué campos se envían al confirmar una acción. Si ves `price`, `total`, `discount`, `role`, `isAdmin`... y puedes cambiarlos con efecto, hay confianza indebida en el cliente.",
    ],
    remediation: {
      explanation: [
        "El servidor debe tratar los datos del cliente como **peticiones**, no como **verdades**. Los valores con consecuencias (precio, total, permisos) se calculan o validan en el backend a partir de fuentes fiables.",
        "En este caso: recibir solo `productId` y `quantity`, y obtener el precio del catálogo del servidor.",
      ],
      code: [
        {
          title: "Vulnerable",
          lang: "ts",
          tone: "vulnerable",
          code: `// Usa el precio que mandó el navegador.
const total = body.price * body.quantity;
charge(total);`,
        },
        {
          title: "Corregido",
          lang: "ts",
          tone: "fixed",
          code: `// El precio sale del catálogo del servidor; el del cliente se ignora.
const product = catalog.find(body.productId);
if (!product) return badRequest();
const qty = validateQuantity(body.quantity);
const total = product.price * qty;
charge(total);`,
        },
      ],
    },
    takeaway: "Todo dato enviado por el cliente puede modificarse. El servidor debe calcular y validar lo importante.",
    reflection: {
      question: "¿Qué debería haber hecho el servidor de Taquilla Norte?",
      options: [
        { id: "a", text: "Cifrar el campo del precio en el formulario." },
        { id: "b", text: "Buscar el precio real del producto en su catálogo e ignorar el enviado por el cliente." },
        { id: "c", text: "Ocultar mejor el campo del precio." },
        { id: "d", text: "Impedir abrir las DevTools." },
      ],
      correctId: "b",
      explanation:
        "Cifrar u ocultar el campo no arregla nada: el cliente sigue controlándolo. La única solución robusta es que el servidor calcule el precio a partir de datos fiables suyos.",
    },
  },
};
