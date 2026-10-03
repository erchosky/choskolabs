import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Marco visual para los laboratorios ficticios. Da un aspecto "de web real"
 * (claro, con marca propia) distinto del portal oscuro, e incluye una barra
 * discreta que recuerda que es un entorno de ChoskoLabs.
 */
export function LabFrame({
  brand,
  accent = "#2563eb",
  backHref,
  children,
  nav,
}: {
  brand: string;
  accent?: string;
  backHref: string;
  children: ReactNode;
  nav?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800" style={{ ["--brand" as string]: accent }}>
      <div className="bg-slate-900 px-4 py-1.5 text-center text-[11px] text-slate-300">
        Entorno de laboratorio ChoskoLabs · datos ficticios ·{" "}
        <Link href={backHref} className="underline hover:text-white">
          volver al nivel
        </Link>
      </div>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold" style={{ color: "var(--brand)" }}>
            {brand}
          </span>
          {nav}
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}

export function BrandButton({
  children,
  href,
  type,
  name,
  value,
}: {
  children: ReactNode;
  href?: string;
  type?: "submit" | "button";
  name?: string;
  value?: string;
}) {
  const cls =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90";
  const style = { background: "var(--brand)" } as const;
  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} name={name} value={value} className={cls} style={style}>
      {children}
    </button>
  );
}
