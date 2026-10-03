import Link from "next/link";
import { LabFrame } from "@/components/lab/LabFrame";
import { CURRENT_CUSTOMER, getOrderForViewer, orderTotal } from "@/scenarios/voltio/orders";

export const metadata = { title: "Voltio — Pedido", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function VoltioOrder({ params }: PageProps<"/labs/voltio/pedido/[id]">) {
  const { id } = await params;
  // ⚠️ Fallo educativo: se consulta el pedido sin comprobar que sea del cliente.
  const order = getOrderForViewer(id, CURRENT_CUSTOMER.id);

  return (
    <LabFrame brand="Voltio" accent="#e2571e" backHref="/web/level-1" nav={<Link href="/labs/voltio" className="text-sm text-slate-500 hover:underline">← Mis pedidos</Link>}>
      {!order ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
          <p className="text-slate-700">No existe ningún pedido con el número #{id}.</p>
          <Link href="/labs/voltio" className="mt-3 inline-block text-sm" style={{ color: "var(--brand)" }}>
            Volver a mis pedidos
          </Link>
        </div>
      ) : (
        <article className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Pedido #{order.id}</h1>
              <p className="text-sm text-slate-500">Realizado el {order.placedAt}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{order.status}</span>
          </div>

          <dl className="mt-5 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="text-slate-500">Cliente:</dt>
              <dd className="font-medium text-slate-800">{order.customerName}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Envío a:</dt>
              <dd className="text-slate-800">{order.shippingAddress}</dd>
            </div>
          </dl>

          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="pb-2 font-medium">Artículo</th>
                <th className="pb-2 text-center font-medium">Cant.</th>
                <th className="pb-2 text-right font-medium">Precio</th>
              </tr>
            </thead>
            <tbody>
              {order.lines.map((line, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 text-slate-800">{line.name}</td>
                  <td className="py-2 text-center text-slate-600">{line.quantity}</td>
                  <td className="py-2 text-right text-slate-800">{(line.quantity * line.unitPrice).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="pt-3 text-right font-medium text-slate-500">Total</td>
                <td className="pt-3 text-right font-bold text-slate-900">{orderTotal(order).toFixed(2)} €</td>
              </tr>
            </tfoot>
          </table>

          {order.deliveryNote && (
            <div className="mt-5 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-medium">Nota de entrega</p>
              <p className="mt-0.5 whitespace-pre-wrap">{order.deliveryNote}</p>
            </div>
          )}
        </article>
      )}
    </LabFrame>
  );
}
