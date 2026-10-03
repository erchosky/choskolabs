import Link from "next/link";
import { LabFrame } from "@/components/lab/LabFrame";
import { CURRENT_CUSTOMER, listOrdersOf, orderTotal } from "@/scenarios/voltio/orders";

export const metadata = { title: "Voltio — Mi cuenta", robots: { index: false } };

const ACCENT = "#e2571e";

export default function VoltioAccount() {
  const orders = listOrdersOf(CURRENT_CUSTOMER.id);
  return (
    <LabFrame
      brand="Voltio"
      accent={ACCENT}
      backHref="/web/level-1"
      nav={<span className="text-sm text-slate-500">Hola, {CURRENT_CUSTOMER.name.split(" ")[0]}</span>}
    >
      <h1 className="text-2xl font-bold text-slate-900">Mis pedidos</h1>
      <p className="mt-1 text-sm text-slate-500">
        Cuenta de {CURRENT_CUSTOMER.name} · {CURRENT_CUSTOMER.email}
      </p>
      <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
        En Voltio tu privacidad es lo primero: cada cliente solo puede consultar sus propios pedidos.
      </p>

      <ul className="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/labs/voltio/pedido/${order.id}`}
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"
            >
              <div>
                <p className="font-medium text-slate-900">Pedido #{order.id}</p>
                <p className="text-sm text-slate-500">
                  {order.placedAt} · {order.lines[0]?.name}
                  {order.lines.length > 1 ? ` +${order.lines.length - 1}` : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{orderTotal(order).toFixed(2)} €</p>
                <p className="text-xs text-slate-500">{order.status}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </LabFrame>
  );
}
