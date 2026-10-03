import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { ContinueButton } from "@/components/portal/ContinueButton";

const STEPS = [
  { n: 1, title: "Entra en un escenario", text: "Una tienda, un gimnasio, un hotel... situaciones que reconoces." },
  { n: 2, title: "Investiga", text: "Mira la web, la URL, el código, las peticiones. Curiosea." },
  { n: 3, title: "Prueba cosas", text: "Equivocarte forma parte del juego. Nadie te mira." },
  { n: 4, title: "Usa pistas si las necesitas", text: "Cuatro niveles de ayuda. Usarlas no es hacer trampas." },
  { n: 5, title: "Encuentra la flag", text: "La señal de que reprodujiste el fallo." },
  { n: 6, title: "Entiende qué ocurrió", text: "El post-lab te explica qué hiciste y por qué funcionó." },
  { n: 7, title: "Aplica la idea", text: "En el siguiente reto reconocerás el patrón por ti mismo." },
];

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink-700/60">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: "radial-gradient(60% 60% at 50% 0%, #f4b5470f, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28">
          <Badge tone="accent">Web Wargame · v0.1</Badge>
          <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-ink-50 sm:text-6xl">
            Aprende ciberseguridad <span className="text-accent">haciendo</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-200">
            No copies comandos sin entenderlos. Investiga. Experimenta. Encuentra qué falla. Y, sobre todo,
            entiende <em>por qué</em> falla.
          </p>
          <p className="mt-4 max-w-2xl font-mono text-sm text-ink-300">
            Jugar primero. Entender después. Recordar para siempre.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/web" className={buttonClass("primary", "lg")}>
              Empezar
            </Link>
            <ContinueButton />
          </div>
          <p className="mt-6 max-w-2xl text-sm text-ink-400">
            Se juega directamente en el navegador. No necesitas instalar Kali, máquinas virtuales, Docker ni
            herramientas: solo tu navegador y curiosidad. <span className="text-ink-300">Click and hack.</span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-ink-50">No enseñamos a conseguir flags.</h2>
          <p className="mt-2 text-lg text-ink-300">Enseñamos a entender por qué se pueden conseguir.</p>
          <p className="mt-4 leading-relaxed text-ink-200">
            Mucha gente supera ejercicios siguiendo instrucciones y termina sin saber qué hizo ni por qué funcionó.
            ChoskoLabs existe para evitar eso: cada nivel está diseñado para que descubras algo por ti mismo y
            después entiendas qué hiciste, por qué funcionó, para qué sirve y cómo se evita.
          </p>
        </div>
      </section>

      <section className="border-y border-ink-700/60 bg-ink-850/50">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-2xl font-semibold text-ink-50">Cómo funciona</h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.n} className="rounded-xl border border-ink-700 bg-ink-800/60 p-5">
                <span className="font-mono text-sm text-accent">0{step.n}</span>
                <h3 className="mt-1 font-medium text-ink-50">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-300">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-2xl font-semibold text-ink-50">Categorías</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/web"
            className="group rounded-xl border border-ink-600 bg-ink-800/70 p-6 transition-colors hover:border-accent/50 hover:bg-ink-800"
          >
            <div className="flex items-center justify-between">
              <Badge tone="accent">Disponible</Badge>
              <span className="text-ink-500 transition-transform group-hover:translate-x-1">→</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-ink-50">Web Wargame</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              Tu primera puerta de entrada. Aprende a mirar aplicaciones web como lo haría un auditor: pedidos,
              paneles, precios, APIs y permisos.
            </p>
          </Link>
          <div className="rounded-xl border border-dashed border-ink-700 bg-ink-850/40 p-6">
            <Badge>Próximamente</Badge>
            <h3 className="mt-4 text-xl font-semibold text-ink-300">Más categorías en el futuro</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Linux, redes, bases de datos, criptografía, forense, OSINT, APIs... Primero queremos que la categoría
              Web sea excelente.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
