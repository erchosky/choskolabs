"use client";

import { useState, type FormEvent } from "react";
import type { CheckoutResult } from "@/scenarios/taquilla/checkout";

/**
 * Formulario no controlado a propósito: al enviar leemos los valores REALES
 * del DOM (incluido el input oculto `price`). Así, si el jugador edita el
 * precio con DevTools, ese valor es el que viaja al servidor.
 */
export function CheckoutForm({ productId, price }: { productId: string; price: number }) {
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/labs/taquilla/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: data.get("productId"),
          quantity: data.get("quantity"),
          price: data.get("price"),
        }),
      });
      setResult((await res.json()) as CheckoutResult);
    } catch {
      setResult({ ok: false, error: "No se pudo completar la compra." });
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5">
        <input type="hidden" name="productId" value={productId} />
        {/* El precio viaja en un campo oculto controlado por el navegador. */}
        <input type="hidden" name="price" defaultValue={price} />

        <div className="flex items-center justify-between">
          <label htmlFor="quantity" className="text-sm font-medium text-slate-700">
            Cantidad
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min={1}
            max={4}
            defaultValue={1}
            className="w-20 rounded-md border border-slate-300 px-2 py-1 text-center"
          />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm text-slate-500">Precio por entrada</span>
          <span className="font-semibold text-slate-900">{price.toFixed(2)} €</span>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-md py-2.5 text-sm font-medium text-white disabled:opacity-60"
          style={{ background: "var(--brand)" }}
        >
          {pending ? "Procesando…" : "Comprar entradas"}
        </button>
        <p className="mt-2 text-center text-xs text-slate-400">
          Simulación: no se realiza ningún cobro real ni se piden datos bancarios.
        </p>
      </form>

      {result && (
        <div className="mt-4">
          {result.ok ? (
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <p className="text-sm font-medium text-green-700">✓ Compra registrada</p>
              <dl className="mt-3 space-y-1 text-sm text-slate-700">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Referencia</dt>
                  <dd className="font-mono">{result.receipt.reference}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Entrada</dt>
                  <dd>{result.receipt.product}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Cantidad</dt>
                  <dd>{result.receipt.quantity}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Precio cobrado/ud.</dt>
                  <dd>{result.receipt.unitPriceCharged.toFixed(2)} €</dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1 font-semibold text-slate-900">
                  <dt>Total cobrado</dt>
                  <dd>{result.receipt.totalCharged.toFixed(2)} €</dd>
                </div>
              </dl>
              {result.labAudit && (
                <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
                  <p className="font-medium">Auditoría del laboratorio</p>
                  <p className="mt-0.5">
                    {result.labAudit.message} El precio real era {result.labAudit.realUnitPrice.toFixed(2)} €.
                  </p>
                  <p className="mt-2 font-mono text-xs">
                    Has reproducido el fallo. Tu flag:{" "}
                    <span className="select-all font-semibold text-amber-950">{result.labAudit.flag}</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
