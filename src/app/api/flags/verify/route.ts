import { checkFlag } from "@/server/flags";

/**
 * POST /api/flags/verify
 * Body: { "labId": "level-1", "flag": "flag{...}" }
 * Respuesta: { "status": "correct" | "incorrect" | "format" | "empty" | "other-level" | "unknown-lab", ... }
 *
 * La validación ocurre SIEMPRE en servidor. La respuesta nunca incluye la flag correcta.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ status: "bad-request" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return Response.json({ status: "bad-request" }, { status: 400 });
  }
  const { labId, flag } = body as { labId?: unknown; flag?: unknown };
  if (typeof labId !== "string") {
    return Response.json({ status: "bad-request" }, { status: 400 });
  }

  const result = checkFlag(labId, flag);
  const httpStatus = result.status === "unknown-lab" ? 404 : 200;
  return Response.json(result, { status: httpStatus, headers: { "Cache-Control": "no-store" } });
}
