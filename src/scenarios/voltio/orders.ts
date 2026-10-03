import "server-only";
import { getFlag } from "@/server/flags";

/**
 * Level 1 — Voltio, tienda de electrónica ficticia.
 *
 * FALLO INTENCIONADO: `getOrderForViewer` devuelve cualquier pedido que exista,
 * sin comprobar que pertenece a la persona que lo consulta.
 * La versión corregida (`getOrderForViewerSecure`) existe para los tests y
 * como referencia de lo que explica el post-lab.
 */

export interface OrderLine {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  customerId: string;
  customerName: string;
  placedAt: string;
  status: "Entregado" | "En reparto" | "Preparando" | "Cancelado";
  shippingAddress: string;
  lines: OrderLine[];
  deliveryNote?: string;
}

/** La "sesión" del laboratorio: siempre eres Lucía. */
export const CURRENT_CUSTOMER = {
  id: "cus_2201",
  name: "Lucía Martín",
  email: "lucia.martin@correo.test",
} as const;

function buildOrders(): Order[] {
  return [
    {
      id: 1779,
      customerId: CURRENT_CUSTOMER.id,
      customerName: CURRENT_CUSTOMER.name,
      placedAt: "2026-06-02",
      status: "Entregado",
      shippingAddress: "C/ Ficticia 12, 3ºB · 28000 Ciudad Ejemplo",
      lines: [{ name: "Cable USB-C trenzado 2 m", quantity: 2, unitPrice: 9.9 }],
    },
    {
      id: 1840,
      customerId: "cus_1187",
      customerName: "Marcos Vidal",
      placedAt: "2026-09-18",
      status: "Entregado",
      shippingAddress: "Av. Imaginaria 77 · 41000 Villaprueba",
      lines: [{ name: "Ratón inalámbrico Kora", quantity: 1, unitPrice: 24.5 }],
    },
    {
      id: 1841,
      customerId: "cus_3045",
      customerName: "Aitana Rueda",
      placedAt: "2026-09-19",
      status: "En reparto",
      shippingAddress: "Pl. del Ejemplo 3 · 46000 Pueblo Demo",
      lines: [
        { name: "Teclado mecánico Brisa 75%", quantity: 1, unitPrice: 89 },
        { name: "Reposamuñecas de madera", quantity: 1, unitPrice: 19 },
      ],
    },
    {
      id: 1842,
      customerId: CURRENT_CUSTOMER.id,
      customerName: CURRENT_CUSTOMER.name,
      placedAt: "2026-09-20",
      status: "En reparto",
      shippingAddress: "C/ Ficticia 12, 3ºB · 28000 Ciudad Ejemplo",
      lines: [{ name: "Auriculares inalámbricos Onda Pro", quantity: 1, unitPrice: 79.99 }],
      deliveryNote: "Si no estoy, dejadlo en conserjería. ¡Gracias!",
    },
    {
      id: 1843,
      customerId: "cus_0007",
      customerName: "Equipo interno Voltio",
      placedAt: "2026-09-20",
      status: "Preparando",
      shippingAddress: "Almacén central Voltio · Polígono Ficticio, nave 4",
      lines: [{ name: "Reposición de stock: Onda Pro (x40)", quantity: 40, unitPrice: 0 }],
      deliveryNote: `Pedido interno. Si alguien que no es del equipo está leyendo esto, la tienda tiene un problema. Código de auditoría: ${getFlag("level-1")}`,
    },
    {
      id: 1844,
      customerId: "cus_2950",
      customerName: "Héctor Salas",
      placedAt: "2026-09-21",
      status: "Cancelado",
      shippingAddress: "C/ de la Prueba 5 · 50000 Zaragoza Demo",
      lines: [{ name: "Altavoz Faro Mini", quantity: 1, unitPrice: 39.9 }],
      deliveryNote: "Llamar antes de subir, el timbre no funciona.",
    },
  ];
}

const ORDERS: readonly Order[] = buildOrders();

export function listOrdersOf(customerId: string): Order[] {
  return ORDERS.filter((o) => o.customerId === customerId).sort((a, b) => b.id - a.id);
}

function parseOrderId(rawId: string): number | null {
  if (!/^\d{1,9}$/.test(rawId)) return null;
  return Number(rawId);
}

/** ⚠️ VULNERABLE A PROPÓSITO: no comprueba a quién pertenece el pedido. */
export function getOrderForViewer(rawId: string, _viewerId: string): Order | null {
  const id = parseOrderId(rawId);
  if (id === null) return null;
  return ORDERS.find((o) => o.id === id) ?? null;
}

/** Versión correcta: el pedido debe existir Y pertenecer a quien lo consulta. */
export function getOrderForViewerSecure(rawId: string, viewerId: string): Order | null {
  const order = getOrderForViewer(rawId, viewerId);
  if (!order || order.customerId !== viewerId) return null;
  return order;
}

export function orderTotal(order: Order): number {
  return order.lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0);
}
