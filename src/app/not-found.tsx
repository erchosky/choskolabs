import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink-50">Esta página no existe</h1>
      <p className="mt-2 text-ink-300">
        Puede que el enlace esté roto o que el recurso no esté disponible.
      </p>
      <Link href="/" className={`${buttonClass("primary")} mt-6`}>
        Volver al inicio
      </Link>
    </div>
  );
}
