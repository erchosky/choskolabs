import { describe, expect, it } from "vitest";
import { getFlag } from "@/server/flags";
import { getOrderForViewer, getOrderForViewerSecure, listOrdersOf, CURRENT_CUSTOMER } from "./voltio/orders";
import { canViewStaffPanel, getStaffPanelData } from "./pulsofit/data";
import { processCheckoutSecure, processCheckoutTrustingClient } from "./taquilla/checkout";
import { getTicketById, getTicketForCustomer, CURRENT_USER } from "./nimbo/tickets";
import { hasManagementAccess, parseRole } from "./colmena/session";
import { getInvoiceByBookingCode, getInvoiceSecure, GUEST } from "./faro/bookings";

describe("Level 1 · Voltio (IDOR)", () => {
  it("la versión vulnerable devuelve pedidos ajenos", () => {
    const alien = getOrderForViewer("1843", CURRENT_CUSTOMER.id);
    expect(alien).not.toBeNull();
    expect(alien!.customerId).not.toBe(CURRENT_CUSTOMER.id);
  });
  it("la versión segura solo devuelve pedidos propios", () => {
    expect(getOrderForViewerSecure("1843", CURRENT_CUSTOMER.id)).toBeNull();
    expect(getOrderForViewerSecure("1842", CURRENT_CUSTOMER.id)?.customerId).toBe(CURRENT_CUSTOMER.id);
  });
  it("el pedido con la flag es accesible por el fallo", () => {
    const flag = getFlag("level-1");
    const found = ["1840", "1841", "1843", "1844"].some((id) =>
      getOrderForViewer(id, CURRENT_CUSTOMER.id)?.deliveryNote?.includes(flag),
    );
    expect(found).toBe(true);
  });
  it("el jugador tiene sus propios pedidos", () => {
    expect(listOrdersOf(CURRENT_CUSTOMER.id).length).toBeGreaterThan(0);
  });
});

describe("Level 2 · PulsoFit (función oculta)", () => {
  it("un socio no debería ver el panel según la comprobación correcta", () => {
    expect(canViewStaffPanel("socio")).toBe(false);
    expect(canViewStaffPanel("staff")).toBe(true);
  });
  it("el panel de staff contiene la flag", () => {
    expect(getStaffPanelData().openingCode).toBe(getFlag("level-2"));
  });
});

describe("Level 3 · Taquilla (precio manipulable)", () => {
  it("la versión vulnerable acepta un precio del cliente y detecta el fraude", () => {
    const r = processCheckoutTrustingClient({ productId: "ola-sur-general", quantity: 1, price: 1 });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.receipt.totalCharged).toBe(1);
      expect(r.labAudit?.flag).toBe(getFlag("level-3"));
    }
  });
  it("con el precio real no hay auditoría/flag", () => {
    const r = processCheckoutTrustingClient({ productId: "ola-sur-general", quantity: 1, price: 50 });
    expect(r.ok && r.labAudit).toBeUndefined();
  });
  it("la versión segura ignora el precio del cliente", () => {
    const r = processCheckoutSecure({ productId: "ola-sur-general", quantity: 2, price: 1 });
    expect(r.ok && r.receipt.totalCharged).toBe(100);
  });
  it("valida cantidad y producto", () => {
    expect(processCheckoutTrustingClient({ productId: "no-existe", quantity: 1, price: 1 }).ok).toBe(false);
    expect(processCheckoutTrustingClient({ productId: "ola-sur-general", quantity: 99, price: 50 }).ok).toBe(false);
  });
});

describe("Level 4 · Nimbo (API insegura)", () => {
  it("la API vulnerable devuelve tickets ajenos con notas internas", () => {
    const alien = getTicketById("427");
    expect(alien).not.toBeNull();
    expect(alien!.customer.id).not.toBe(CURRENT_USER.id);
    expect(alien!.internal_notes.join(" ")).toContain(getFlag("level-4"));
  });
  it("la versión segura oculta tickets ajenos y campos internos", () => {
    expect(getTicketForCustomer("427", CURRENT_USER.id)).toBeNull();
    const mine = getTicketForCustomer("431", CURRENT_USER.id);
    expect(mine).not.toBeNull();
    expect(mine as Record<string, unknown>).not.toHaveProperty("internal_notes");
  });
});

describe("Level 5 · Colmena (rol en cookie)", () => {
  it("parseRole normaliza y detecta valores", () => {
    expect(parseRole("STAFF")).toBe("staff");
    expect(parseRole("member")).toBe("member");
    expect(parseRole("cualquiera")).toBe("unknown");
    expect(parseRole(undefined)).toBeNull();
  });
  it("hasManagementAccess concede a staff/admin (fallo: viene del cliente)", () => {
    expect(hasManagementAccess("member")).toBe(false);
    expect(hasManagementAccess("staff")).toBe(true);
    expect(hasManagementAccess("admin")).toBe(true);
  });
});

describe("Checkpoint 1 · Faro (IDOR en facturas)", () => {
  it("la factura ajena es accesible por el fallo y contiene la flag", () => {
    const invoice = getInvoiceByBookingCode("FA-2605", GUEST.id);
    expect(invoice).not.toBeNull();
    expect(invoice!.note).toContain(getFlag("checkpoint-1"));
  });
  it("la versión segura bloquea reservas ajenas", () => {
    expect(getInvoiceSecure("FA-2605", GUEST.id)).toBeNull();
    expect(getInvoiceSecure("FA-2607", GUEST.id)?.bookingCode).toBe("FA-2607");
  });
  it("valida el formato del código", () => {
    expect(getInvoiceByBookingCode("no-valido", GUEST.id)).toBeNull();
  });
});
