import "server-only";
import { getFlag } from "@/server/flags";

/**
 * Checkpoint 1 — Hotel Faro Azul, reservas ficticias.
 *
 * Aquí conviven cosas BIEN hechas y una MAL hecha, como en una auditoría real:
 * - La "recepción" (/labs/faro/recepcion) SÍ comprueba permisos en servidor.
 * - La API de facturas (/api/labs/faro/reservas/<código>/factura) NO comprueba
 *   que la reserva pertenezca a quien la pide. ⚠️ VULNERABLE A PROPÓSITO.
 */

export const GUEST = { id: "g-5530", name: "Samuel Ortega", email: "samuel.ortega@correo.test" };

export interface Booking {
  code: string;
  guestId: string;
  guestName: string;
  room: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  extras: { concept: string; amount: number }[];
  billingNote?: string;
}

function buildBookings(): Booking[] {
  return [
    {
      code: "FA-2604",
      guestId: "g-1102",
      guestName: "Clara Benítez",
      room: "Doble vista mar",
      checkIn: "2026-10-01",
      checkOut: "2026-10-04",
      nights: 3,
      pricePerNight: 118,
      extras: [{ concept: "Desayuno x2", amount: 54 }],
    },
    {
      code: "FA-2605",
      guestId: "g-0001",
      guestName: "Dirección Hotel Faro Azul",
      room: "Suite Faro (bloqueo interno)",
      checkIn: "2026-10-09",
      checkOut: "2026-10-11",
      nights: 2,
      pricePerNight: 0,
      extras: [],
      billingNote: `Bloqueo para la auditoría de seguridad. Si esta factura la ve un huésped, la API tiene un fallo. Referencia: ${getFlag("checkpoint-1")}`,
    },
    {
      code: "FA-2606",
      guestId: "g-2290",
      guestName: "Familia Quintero",
      room: "Familiar",
      checkIn: "2026-10-02",
      checkOut: "2026-10-09",
      nights: 7,
      pricePerNight: 145,
      extras: [
        { concept: "Cuna", amount: 0 },
        { concept: "Parking", amount: 84 },
      ],
    },
    {
      code: "FA-2607",
      guestId: GUEST.id,
      guestName: GUEST.name,
      room: "Individual interior",
      checkIn: "2026-10-12",
      checkOut: "2026-10-14",
      nights: 2,
      pricePerNight: 72,
      extras: [{ concept: "Late check-out", amount: 15 }],
    },
    {
      code: "FA-2608",
      guestId: "g-7741",
      guestName: "Tomás Luján",
      room: "Doble estándar",
      checkIn: "2026-10-12",
      checkOut: "2026-10-13",
      nights: 1,
      pricePerNight: 96,
      extras: [],
    },
  ];
}

const BOOKINGS: readonly Booking[] = buildBookings();

export function bookingsOfGuest(guestId: string): Booking[] {
  return BOOKINGS.filter((b) => b.guestId === guestId);
}

export interface Invoice {
  invoiceNumber: string;
  bookingCode: string;
  billedTo: string;
  room: string;
  stay: string;
  lines: { concept: string; amount: number }[];
  total: number;
  note?: string;
}

function toInvoice(b: Booking): Invoice {
  const lines = [{ concept: `${b.nights} noche(s) · ${b.room}`, amount: b.nights * b.pricePerNight }, ...b.extras];
  return {
    invoiceNumber: `F26-${b.code.slice(3)}`,
    bookingCode: b.code,
    billedTo: b.guestName,
    room: b.room,
    stay: `${b.checkIn} → ${b.checkOut}`,
    lines,
    total: lines.reduce((s, l) => s + l.amount, 0),
    note: b.billingNote,
  };
}

function findBooking(code: string): Booking | null {
  const normalized = code.trim().toUpperCase();
  if (!/^FA-\d{4}$/.test(normalized)) return null;
  return BOOKINGS.find((b) => b.code === normalized) ?? null;
}

/** ⚠️ VULNERABLE A PROPÓSITO: no comprueba a quién pertenece la reserva. */
export function getInvoiceByBookingCode(code: string, _viewerId: string): Invoice | null {
  const booking = findBooking(code);
  return booking ? toInvoice(booking) : null;
}

/** Versión correcta. */
export function getInvoiceSecure(code: string, viewerId: string): Invoice | null {
  const booking = findBooking(code);
  if (!booking || booking.guestId !== viewerId) return null;
  return toInvoice(booking);
}

/**
 * La recepción está BIEN protegida: el rol viene de la sesión del servidor,
 * y en este laboratorio el huésped nunca tiene rol de recepción.
 */
export function receptionAccessFor(_viewerId: string): "denied" {
  return "denied";
}
