import "server-only";
import { getFlag } from "@/server/flags";

/**
 * Level 3 — Taquilla Norte, venta de entradas ficticia.
 *
 * FALLO INTENCIONADO: `processCheckoutTrustingClient` cobra el precio que
 * llega en la petición en lugar de buscar el precio real del producto.
 * `processCheckoutSecure` es la versión correcta (tests + post-lab).
 *
 * Nada se cobra de verdad: no hay pasarela de pago ni datos bancarios.
 */

export interface TicketProduct {
  id: string;
  name: string;
  venue: string;
  date: string;
  price: number;
}

export const PRODUCTS: readonly TicketProduct[] = [
  {
    id: "ola-sur-general",
    name: "Festival Ola Sur · Entrada general",
    venue: "Recinto Ferial Ficticio",
    date: "Sábado 17 de octubre de 2026",
    price: 50,
  },
];

export function findProduct(id: unknown): TicketProduct | null {
  if (typeof id !== "string") return null;
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export interface CheckoutInput {
  productId: unknown;
  quantity: unknown;
  price: unknown;
}

export type CheckoutResult =
  | {
      ok: true;
      receipt: {
        reference: string;
        product: string;
        quantity: number;
        unitPriceCharged: number;
        totalCharged: number;
      };
      /** Solo aparece si el cobro no coincide con el precio real (instrumentación del lab). */
      labAudit?: { realUnitPrice: number; message: string; flag: string };
    }
  | { ok: false; error: string };

function parseQuantity(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isInteger(n) || n < 1 || n > 4) return null;
  return n;
}

function parsePrice(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value.replace(",", ".")) : NaN;
  if (!Number.isFinite(n) || n < 0 || n > 100000) return null;
  return Math.round(n * 100) / 100;
}

function reference(): string {
  return `TN-${Math.floor(100000 + Math.random() * 900000)}`;
}

/** ⚠️ VULNERABLE A PROPÓSITO: confía en `price` enviado por el navegador. */
export function processCheckoutTrustingClient(input: CheckoutInput): CheckoutResult {
  const product = findProduct(input.productId);
  if (!product) return { ok: false, error: "Ese producto no existe." };
  const quantity = parseQuantity(input.quantity);
  if (quantity === null) return { ok: false, error: "Puedes comprar entre 1 y 4 entradas." };
  const price = parsePrice(input.price);
  if (price === null) return { ok: false, error: "El precio recibido no es válido." };

  const totalCharged = Math.round(price * quantity * 100) / 100;
  const result: CheckoutResult = {
    ok: true,
    receipt: { reference: reference(), product: product.name, quantity, unitPriceCharged: price, totalCharged },
  };
  if (price !== product.price) {
    result.labAudit = {
      realUnitPrice: product.price,
      message:
        price < product.price
          ? "El servidor ha cobrado un precio inferior al real sin darse cuenta."
          : "El servidor ha cobrado un precio distinto al real sin darse cuenta.",
      flag: getFlag("level-3"),
    };
  }
  return result;
}

/** Versión correcta: el precio sale del catálogo del servidor; `price` se ignora. */
export function processCheckoutSecure(input: CheckoutInput): CheckoutResult {
  const product = findProduct(input.productId);
  if (!product) return { ok: false, error: "Ese producto no existe." };
  const quantity = parseQuantity(input.quantity);
  if (quantity === null) return { ok: false, error: "Puedes comprar entre 1 y 4 entradas." };
  return {
    ok: true,
    receipt: {
      reference: reference(),
      product: product.name,
      quantity,
      unitPriceCharged: product.price,
      totalCharged: product.price * quantity,
    },
  };
}
