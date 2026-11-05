import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronDown, Copy, ExternalLink, Package } from "lucide-react";
import { cn } from "@/utils/cn";
import { Badge, Button, Container, EmptyState, Field, Img, Input, Modal, Select, StatusBadge, Tabs, Textarea, money, useToast } from "../../ui";
import { ORDER_STEPS, getProduct, orderItemsTotal, orderTotal, orders as all, type Order } from "../../data";

export default function Orders() {
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState<string | null>("KR-10482");
  const [cancel, setCancel] = useState<Order | null>(null);
  const [pay, setPay] = useState<Order | null>(null);
  const mine = all.slice(0, 7);
  const list = mine.filter((o) => (tab === "all" ? true : tab === "active" ? !["Delivered", "Cancelled", "Returned"].includes(o.status) : tab === "delivered" ? o.status === "Delivered" : ["Cancelled", "Returned"].includes(o.status)));

  return (
    <Container className="max-w-4xl pb-8 pt-24 sm:pt-28">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">My orders</h1>
      <p className="mt-1.5 text-slate-500">Track parcels, pay dues and manage your orders.</p>
      <Tabs className="mt-8" value={tab} onChange={setTab} tabs={[{ value: "all", label: "All", count: mine.length }, { value: "active", label: "Active" }, { value: "delivered", label: "Delivered" }, { value: "closed", label: "Cancelled / Returned" }]} />

      {list.length === 0 ? (
        <EmptyState icon={<Package className="size-6" />} title="No orders here yet" sub="Your placed orders and parcel tracking will appear here." action={<Link to="/collection"><Button>Start shopping</Button></Link>} />
      ) : (
        <ul className="mt-6 space-y-4">
          {list.map((o, i) => {
            const isOpen = open === o.id;
            const total = orderTotal(o);
            const due = total - (o.trxState === "Verified" ? o.advance : 0);
            const step = ORDER_STEPS.indexOf(o.status as (typeof ORDER_STEPS)[number]);
            const closed = o.status === "Cancelled" || o.status === "Returned";
            return (
              <li key={o.id} className="anim-rise overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line" style={{ animationDelay: `${i * 50}ms` }}>
                <button onClick={() => setOpen(isOpen ? null : o.id)} className="flex w-full items-center gap-4 p-5 text-left cursor-pointer">
                  <div className="flex -space-x-3">
                    {o.items.slice(0, 3).map((it) => <Img key={it.id} src={getProduct(it.id)!.img} alt="" className="size-14 rounded-xl ring-2 ring-white" />)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="font-extrabold">{o.id}</span><StatusBadge status={o.status} /></div>
                    <p className="mt-1 text-sm text-slate-500">{o.date} · {o.items.reduce((a, x) => a + x.qty, 0)} items</p>
                  </div>
                  <div className="text-right"><p className="tnum font-extrabold">{money(total)}</p><p className="text-xs text-slate-500">{o.payment}</p></div>
                  <ChevronDown className={cn("size-5 text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                  <div className="anim-fade border-t border-line px-5 pb-5 pt-6">
                    {!closed ? (
                      <ol className="relative mb-8 grid grid-cols-6 gap-1">
                        <div className="absolute left-[8.3%] right-[8.3%] top-[11px] h-0.5 bg-stone-200"><div className="h-full origin-left bg-brand-600" style={{ width: `${(Math.max(0, step) / 5) * 100}%`, animation: "k-bar 0.8s var(--ease-out-soft) both" }} /></div>
                        {ORDER_STEPS.map((s, idx) => (
                          <li key={s} className="relative flex flex-col items-center text-center">
                            <span className={cn("z-10 grid size-6 place-items-center rounded-full border-2 bg-white transition-colors", idx <= step ? "border-brand-600 bg-brand-600 text-white" : "border-stone-300")}>{idx <= step && <Check className="size-3.5" strokeWidth={3.5} />}</span>
                            <span className={cn("mt-2 text-[11px] font-bold leading-tight sm:text-xs", idx <= step ? "text-slate-900" : "text-slate-400")}>{s}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <div className="mb-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-800"><b>{o.status === "Returned" ? "পার্সেল রিটার্ন হয়েছে" : "অর্ডার বাতিল করা হয়েছে"}</b>{o.status === "Returned" && <p className="mt-1 text-rose-700">কুরিয়ার থেকে পার্সেল ওয়্যারহাউসে ফেরত এসেছে। বিস্তারিত জানতে কাস্টমার সাপোর্টে যোগাযোগ করুন।</p>}</div>
                    )}

                    <div className="grid gap-8 md:grid-cols-2">
                      <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Items</h3>
                        <ul className="space-y-3">
                          {o.items.map((it) => { const p = getProduct(it.id)!; return (<li key={it.id} className="flex items-center gap-3"><Img src={p.img} alt="" className="size-12 rounded-lg" /><span className="line-clamp-2 flex-1 text-sm font-semibold">{p.name}</span><span className="text-xs text-slate-500">×{it.qty}</span></li>); })}
                        </ul>
                        {o.tracking && (
                          <div className="mt-5 flex items-center justify-between rounded-xl bg-stone-100/70 p-3.5 text-sm">
                            <div><p className="text-xs font-semibold text-slate-500">{o.courier} · ট্র্যাকিং</p><p className="tnum font-bold">{o.tracking}</p></div>
                            <div className="flex gap-1.5"><Button size="sm" variant="secondary" onClick={() => toast.push("Tracking code copied")}><Copy className="size-3.5" /></Button><Button size="sm" variant="secondary"><ExternalLink className="size-3.5" />লাইভ ট্র্যাক</Button></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Payment</h3>
                        <dl className="space-y-2.5 text-sm">
                          <Row k="পণ্যের মূল্য" v={money(orderItemsTotal(o))} />
                          <Row k="ডেলিভারি চার্জ" v={money(o.delivery)} />
                          <Row k="মোট বিল" v={money(total)} bold />
                          {o.advance > 0 && <Row k={o.trxState === "Verified" ? "পরিশোধিত" : "যাচাই অপেক্ষমাণ"} v={money(o.advance)} tone={o.trxState === "Verified" ? "ok" : "warn"} />}
                          <div className="flex justify-between border-t border-line pt-3"><dt className="font-bold">ডেলিভারিতে প্রদেয়</dt><dd className="tnum text-lg font-extrabold">{money(closed ? 0 : due)}</dd></div>
                        </dl>
                        {o.trx && <p className="mt-2 text-xs text-slate-500">TrxID: <span className="tnum font-semibold text-slate-700">{o.trx}</span></p>}
                      </div>
                    </div>

                    {!closed && o.status !== "Delivered" && (
                      <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-line pt-5">
                        {due > 0 && <Button variant="secondary" onClick={() => setPay(o)}>বিকাশ/নগদে দিন</Button>}
                        {["Order Placed", "Confirmed"].includes(o.status) && <Button variant="danger" onClick={() => setCancel(o)}>Cancel order</Button>}
                      </div>
                    )}
                    {closed && <div className="mt-6 flex justify-end border-t border-line pt-5"><Button variant="danger" onClick={() => toast.push("Order removed")}>Delete from history</Button></div>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Modal open={!!cancel} onClose={() => setCancel(null)} title={`Cancel ${cancel?.id}`} sub="Are you sure? Please select a reason." footer={<><Button variant="ghost" onClick={() => setCancel(null)}>Keep order</Button><Button variant="danger" onClick={() => (setCancel(null), toast.push("Order cancelled"))}>Cancel order</Button></>}>
        <div className="space-y-4">
          <Field label="Reason"><Select><option>Ordered by mistake</option><option>Found a better price</option><option>Delivery takes too long</option><option>Other</option></Select></Field>
          <Field label="Additional note (optional)"><Textarea placeholder="Explain why you are cancelling…" /></Field>
        </div>
      </Modal>

      <Modal open={!!pay} onClose={() => setPay(null)} title="Submit bKash / Nagad payment" width="max-w-md" footer={<><Button variant="ghost" onClick={() => setPay(null)}>Cancel</Button><Button onClick={() => (setPay(null), toast.push("Payment submitted for review"))}>Submit payment</Button></>}>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-stone-100/70 px-4 py-3 text-sm"><span className="text-slate-600">Current due</span><b className="tnum">{pay && money(orderTotal(pay))}</b></div>
          <div className="grid grid-cols-2 gap-4"><Field label="Amount"><Input placeholder="Enter amount" inputMode="numeric" /></Field><Field label="Method"><Select><option>bKash</option><option>Nagad</option></Select></Field></div>
          <Field label="Sender phone number"><Input placeholder="01XXXXXXXXX" /></Field>
          <Field label="TrxID"><Input placeholder="e.g. 9J3K8L2P1X" className="uppercase" /></Field>
        </div>
      </Modal>
    </Container>
  );
}
const Row = ({ k, v, bold, tone }: { k: string; v: string; bold?: boolean; tone?: "ok" | "warn" }) => (
  <div className="flex justify-between"><dt className="text-slate-500">{k}</dt><dd className={cn("tnum", bold ? "font-extrabold" : "font-semibold", tone === "ok" && "text-emerald-700", tone === "warn" && "text-amber-700")}>{v}</dd></div>
);
export { Badge };
