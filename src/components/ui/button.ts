/** Estilos de botón compartidos (aplicables a <button> y <Link>). */
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS = {
  primary: "bg-accent text-ink-950 hover:bg-accent-strong",
  secondary: "border border-ink-600 bg-ink-800 text-ink-100 hover:border-ink-500 hover:bg-ink-700",
  ghost: "text-ink-200 hover:bg-ink-800 hover:text-ink-50",
  danger: "border border-bad/50 bg-bad-soft text-bad hover:bg-bad/20",
} as const;

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

export function buttonClass(variant: keyof typeof VARIANTS = "primary", size: keyof typeof SIZES = "md"): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]}`;
}
