import Link from "next/link";
import { LabFrame } from "@/components/lab/LabFrame";
import { GUEST, getInvoiceByBookingCode } from "@/scenarios/faro/bookings";

export const metadata = { title: "Faro Azul — Factura", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function FaroInvoice({ params }: PageProps<"/labs/faro/factura/[code]">) {
  const { code } = await params;
  // ⚠️ Fallo educativo: no comprueba que la reserva pertenezca al huésped.
  const invoice = getInvoiceByBookingCode(code, GUEST.id);

  return (
    <LabFrame brand="Faro Azul" accent="#0d9488" backHref="/web/checkpoint-1" nav={<Link href="/labs/faro" className="text-sm text-slate-500 hover:underline">← Mis reservas</Link>}>
      {!invoice ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
          <p className="text-slate-700">No se encontró ninguna factura para la reserva «{code}».</p>
          <Link href="/labs/faro" className="mt-3 inline-block text-sm" style={{ color: "var(--brand)" }}>
            Volver
          </Link>
        </div>
      ) : (
        <article className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Factura {invoice.invoiceNumber}</h1>
              <p className="text-sm text-slate-500">Reserva {invoice.bookingCode}</p>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p>{invoice.billedTo}</p>
              <p>{invoice.room}</p>
              <p>{invoice.stay}</p>
            </div>
          </div>

          <table className="mt-5 w-full text-sm">
            <tbody>
              {invoice.lines.map((line, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 text-slate-800">{line.concept}</td>
                  <td className="py-2 text-right text-slate-800">{line.amount.toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-3 text-right font-medium text-slate-500">Total</td>
                <td className="pt-3 text-right font-bold text-slate-900">{invoice.total.toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>

          {invoice.note && (
            <div className="mt-5 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-medium">Nota de facturación</p>
              <p className="mt-0.5 whitespace-pre-wrap">{invoice.note}</p>
            </div>
          )}
        </article>
      )}
    </LabFrame>
  );
}
