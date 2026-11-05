import { useMemo, useState } from "react";
import { Copy, Download, MessageCircle, Phone, Plus, ScanBarcode, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { Badge, Button, Chip, Drawer, Field, Img, PageHeader, SearchInput, Select, StatusBadge, Table, Td, Textarea, Th, Tr, money, useToast, Surface } from "../../ui";
import { ORDER_STEPS, getProduct, orderItemsTotal, orderTotal, orders, salePrice, type Order } from "../../data";

export function OrderDrawer({ o, onClose, staff }: { o: Order | null; onClose: () => void; staff?: boolean }) {
  const toast = useToast();
  const [status, setStatus] = useState<string>("");
  const [courier, setCourier] = useState("Steadfast");
  const [booked, setBooked] = useState(false);
  if (!o) return null;
  const total = orderTotal(o);
  const cod = total - (o.trxState === "Verified" ? o.advance : 0);
  const trust = o.risk;
  return (
    <Drawer
      open={!!o}
      onClose={onClose}
      width="max-w-xl"
      title={<span className="flex items-center gap-3">{o.id}<StatusBadge status={status || o.status} /></span>}
      footer={<div className="flex gap-2"><Button variant="secondary" full onClick={() => toast.push("Invoice ready to print")}><Download className="size-4" />Invoice</Button><Button full onClick={() => (toast.push("Order updated"), onClose())}>Save changes</Button></div>}
    >
      <div className="divide-y divide-line">
        <section className="p-5">
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-extrabold">Customer & delivery</h3><Badge tone={trust > 80 ? "success" : trust > 60 ? "warning" : "danger"} dot>{trust}% delivery success</Badge></div>
          <p className="font-bold">{o.customer}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-600"><span className="tnum">{o.phone}</span><button onClick={() => toast.push("Phone copied")} className="text-slate-400 hover:text-slate-700 cursor-pointer"><Copy className="size-3.5" /></button><a className="inline-flex items-center gap-1 font-semibold text-emerald-600" href="#"><MessageCircle className="size-3.5" />WhatsApp</a><a className="inline-flex items-center gap-1 font-semibold text-brand-700" href="#"><Phone className="size-3.5" />Call</a></div>
          <p className="mt-2 text-sm text-slate-600">{o.address}, {o.district}</p>
          {o.note && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-900">Rider instruction: {o.note}</p>}
        </section>

        <section className="p-5">
          <h3 className="mb-3 text-sm font-extrabold">Items · {o.items.length}</h3>
          <ul className="space-y-3">{o.items.map((i) => { const p = getProduct(i.id)!; return (<li key={i.id} className="flex items-center gap-3"><Img src={p.img} alt="" className="size-12 rounded-lg" /><span className="line-clamp-1 flex-1 text-sm font-semibold">{p.name}</span><span className="text-xs text-slate-500">×{i.qty}</span><span className="tnum w-20 text-right text-sm font-bold">{money(salePrice(p) * i.qty)}</span></li>); })}</ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Items subtotal</dt><dd className="tnum font-semibold">{money(orderItemsTotal(o))}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Delivery</dt><dd className="tnum font-semibold">{money(o.delivery)}</dd></div>
            {o.advance > 0 && <div className="flex justify-between"><dt className="text-slate-500">Advance paid ({o.payment})</dt><dd className="tnum font-semibold">−{money(o.advance)}</dd></div>}
            <div className="flex justify-between border-t border-line pt-3"><dt className="font-extrabold">Due on delivery</dt><dd className="tnum text-lg font-extrabold">{money(cod)}</dd></div>
          </dl>
        </section>

        {!staff && (
          <section className="p-5">
            <h3 className="mb-3 text-sm font-extrabold">Courier & dispatch</h3>
            {o.tracking || booked ? (
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4 text-sm"><div><p className="font-bold text-emerald-900">Booked with {o.courier ?? courier}</p><p className="tnum text-emerald-700">{o.tracking ?? "SF-88420555"}</p></div><Button size="sm" variant="secondary"><ScanBarcode className="size-4" />Label</Button></div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">{["Steadfast", "Pathao", "RedX", "Sundarban"].map((c) => <Chip key={c} active={courier === c} onClick={() => setCourier(c)}>{c}</Chip>)}</div>
                <p className="text-[13px] text-slate-500">Invoice and tracking code are generated through the {courier} API. COD to collect: <b className="tnum text-slate-900">{money(cod)}</b></p>
                <Button onClick={() => (setBooked(true), toast.push(`Booked with ${courier}`))}><Truck className="size-4" />Double-check &amp; dispatch</Button>
              </div>
            )}
          </section>
        )}

        <section className="p-5">
          <h3 className="mb-3 text-sm font-extrabold">Workflow status</h3>
          <div className="mb-4 flex flex-wrap gap-1.5">{[...ORDER_STEPS, "Cancelled"].map((s) => { const on = (status || o.status) === s; return (<button key={s} onClick={() => setStatus(s)} className={cn("rounded-full border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer", on ? "border-ink-900 bg-ink-900 text-white" : "border-stone-300 bg-white text-slate-600 hover:border-stone-400")}>{s}</button>); })}</div>
          <Field label="Staff notes"><Textarea defaultValue={o.note} placeholder="Call outcome or internal note…" className="min-h-20" /></Field>
        </section>
      </div>
    </Drawer>
  );
}

export function OrdersTable({ rows, onOpen, staff }: { rows: Order[]; onOpen: (o: Order) => void; staff?: boolean }) {
  return (
    <Table>
      <thead><tr><Th>Order</Th><Th>Customer</Th><Th>Items</Th><Th>Payment</Th><Th className="text-right">Total</Th><Th>Status</Th><Th>{staff ? "Claimed" : "Staff"}</Th></tr></thead>
      <tbody>
        {rows.map((o) => (
          <Tr key={o.id} onClick={() => onOpen(o)}>
            <Td><p className="font-extrabold text-slate-900">{o.id}</p><p className="text-xs text-slate-500">{o.date}</p></Td>
            <Td><p className="font-semibold text-slate-900">{o.customer}</p><p className="tnum text-xs text-slate-500">{o.phone} · {o.district}</p></Td>
            <Td><div className="flex -space-x-2">{o.items.map((i) => <Img key={i.id} src={getProduct(i.id)!.img} alt="" className="size-8 rounded-md ring-2 ring-white" />)}</div></Td>
            <Td><Badge tone={o.payment === "COD" ? "neutral" : "violet"}>{o.payment}</Badge></Td>
            <Td className="tnum text-right font-extrabold text-slate-900">{money(orderTotal(o))}</Td>
            <Td><StatusBadge status={o.status} /></Td>
            <Td className="text-[13px]">{o.staff ?? <span className="text-slate-400">Unclaimed</span>}</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}

export default function Orders() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [pay, setPay] = useState("all");
  const [open, setOpen] = useState<Order | null>(null);
  const rows = useMemo(() => orders.filter((o) => (status === "All" || o.status === status) && (pay === "all" || o.payment === pay || (pay === "mfs" && o.payment !== "COD")) && (o.id + o.customer + o.phone).toLowerCase().includes(q.toLowerCase())), [q, status, pay]);
  const counts = (s: string) => (s === "All" ? orders.length : orders.filter((o) => o.status === s).length);
  return (
    <>
      <PageHeader title="Web orders" sub="Manage web orders, claim notes, inspect addresses and dispatch to courier." actions={<Link to="/admin/add-order"><Button><Plus className="size-4" />Add order</Button></Link>} />
      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">{["All", "Order Placed", "Confirmed", "Packaging", "In Courier", "Out for delivery", "Delivered", "Cancelled"].map((s) => <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s} <span className="ml-1 opacity-60">{counts(s)}</span></Chip>)}</div>
      <Surface pad={false}>
        <div className="flex flex-wrap gap-3 border-b border-line p-4"><SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order, phone or name…" className="sm:w-72" /><Select value={pay} onChange={(e) => setPay(e.target.value)} className="sm:w-52"><option value="all">All payments</option><option value="COD">Cash on delivery</option><option value="mfs">bKash / Nagad</option></Select></div>
        <OrdersTable rows={rows} onOpen={setOpen} />
        {rows.length === 0 && <p className="py-14 text-center text-sm text-slate-500">No orders match.</p>}
        <div className="flex items-center justify-between p-4 text-sm text-slate-500"><span>Showing {rows.length} of {orders.length}</span><Select className="w-24"><option>10</option><option>20</option><option>50</option></Select></div>
      </Surface>
      <OrderDrawer o={open} onClose={() => setOpen(null)} />
    </>
  );
}
