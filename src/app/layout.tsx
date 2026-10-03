import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { LogoMark, Wordmark } from "@/components/ui/Logo";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "ChoskoLabs — Aprende ciberseguridad jugando",
    template: "%s · ChoskoLabs",
  },
  description:
    "Academia práctica de ciberseguridad donde el curso se recorre jugando wargames. Juega primero, entiende después, recuerda para siempre.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ink-900 text-ink-100">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-ink-950"
        >
          Saltar al contenido
        </a>
        <header className="sticky top-0 z-40 border-b border-ink-700/70 bg-ink-900/85 backdrop-blur">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2" aria-label="ChoskoLabs, inicio">
              <LogoMark />
              <Wordmark />
            </Link>
            <div className="flex items-center gap-1 text-sm">
              <Link href="/web" className="rounded-md px-3 py-1.5 text-ink-200 hover:bg-ink-800 hover:text-ink-50">
                Web Wargame
              </Link>
              <Link href="/progreso" className="rounded-md px-3 py-1.5 text-ink-200 hover:bg-ink-800 hover:text-ink-50">
                Progreso
              </Link>
            </div>
          </nav>
        </header>
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <footer className="border-t border-ink-700/70 py-6 text-center text-xs text-ink-400">
          ChoskoLabs · Laboratorios ficticios con fines educativos. Practica solo en sistemas que tengas permiso para probar.
        </footer>
      </body>
    </html>
  );
}
