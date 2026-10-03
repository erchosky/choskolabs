import { processCheckoutTrustingClient } from "@/scenarios/taquilla/checkout";

// ⚠️ Fallo educativo: el checkout confía en el precio enviado por el cliente.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Petición inválida." }, { status: 400 });
  }
  const { productId, quantity, price } = (body ?? {}) as Record<string, unknown>;
  const result = processCheckoutTrustingClient({ productId, quantity, price });
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
