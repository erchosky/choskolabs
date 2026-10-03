/** Marca ChoskoLabs: un matraz esquemático + wordmark. Sin calaveras ni neón. */
export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <rect x="1" y="1" width="22" height="22" rx="6" className="fill-ink-800 stroke-ink-600" />
      <path d="M9.5 5.5h5M10.5 5.5v4.2L6.8 16.4a1.4 1.4 0 0 0 1.2 2.1h8a1.4 1.4 0 0 0 1.2-2.1l-3.7-6.7V5.5" className="stroke-ink-200" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.4 14h7.2l1.1 2.3a.8.8 0 0 1-.7 1.2H8a.8.8 0 0 1-.7-1.2L8.4 14Z" className="fill-accent" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="font-mono text-[15px] font-semibold tracking-tight text-ink-50">
      chosko<span className="text-accent">labs</span>
    </span>
  );
}
