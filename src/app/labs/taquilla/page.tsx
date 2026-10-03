import { LabFrame } from "@/components/lab/LabFrame";
import { PRODUCTS } from "@/scenarios/taquilla/checkout";
import { CheckoutForm } from "./CheckoutForm";

export const metadata = { title: "Taquilla Norte — Entradas", robots: { index: false } };
const ACCENT = "#7c3aed";

export default function TaquillaPage() {
  const product = PRODUCTS[0];
  return (
    <LabFrame brand="Taquilla Norte" accent={ACCENT} backHref="/web/level-3">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <div className="flex h-40 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 text-5xl">
            🎫
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-1 text-sm text-slate-500">{product.venue}</p>
          <p className="text-sm text-slate-500">{product.date}</p>
          <p className="mt-3 text-2xl font-bold text-slate-900">{product.price.toFixed(2)} €</p>
          <p className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
            El importe final siempre lo calcula nuestro servidor. Es imposible pagar un precio distinto al real.
          </p>
        </div>
        <div>
          <CheckoutForm productId={product.id} price={product.price} />
        </div>
      </div>
    </LabFrame>
  );
}
