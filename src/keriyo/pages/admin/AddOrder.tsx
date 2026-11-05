import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Field, Img, Input, PageHeader, Select, SearchInput, Surface, Textarea, money, useToast } from "../../ui";
import { products, salePrice } from "../../data";
import { Qty } from "../../layout/StoreLayout";

export default function AddOrder() {
  const [lines, setLines] = useState<{ id: string; qty: number }[]>([{ id: "edc-clicker-titanium", qty: 1 }]);
  const [q, setQ] = useState("");
  const [delivery, setDelivery] = useState(80);
  const [advance, setAdvance] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const sub = lines.reduce((a, l) => a + salePrice(products.find((p) => p.id === l.id)!) * l.qty, 0);
  const matches = q ? products.filter((p) => (p.name + p.id).toLowerCase().includes(q.toLowerCase())).slice(0, 4) : [];
  return (
    <>
      <PageHeader crumb="Web orders" title="Add order" sub="Create a manual or telephone order with live catalog selection." />
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Surface>
            <h2 className="mb-4 font-extrabold">Customer</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Customer name *"><Input placeholder="e.g. Md Jakir Hossain" /></Field>
              <Field label="Phone number *"><Input placeholder="01XXXXXXXXX" /></Field>
              <Field label="Email (optional)"><Input type="email" placeholder="customer@gmail.com" /></Field>
              <Field label="Source"><Select><option>Website storefront</option><option>Facebook page / Messenger</option><option>WhatsApp order</option><option>Telephone direct</option></Select></Field>
              <Field label="Shipping address *" className="sm:col-span-2"><Input placeholder="Street / house / market / thana" /></Field>
              <Field label="Delivery method"><Select onChange={(e) => setDelivery(e.target.value === "Steadfast" ? 80 : 130)}><option>Steadfast</option><option>Pathao</option><option>RedX Logistics</option><option>Sundarban Courier</option></Select></Field>
              <Field label="Shipping note (visible to courier)"><Input placeholder="Call before delivery, handle carefully" /></Field>
            </div>
          </Surface>
          <Surface>
            <h2 className="mb-4 font-extrabold">Items</h2>
            <div className="relative"><SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type SKU or name, then select…" />
              {matches.length > 0 && <ul className="anim-scale absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-line bg-white shadow-lift">{matches.map((p) => (<li key={p.id}><button onClick={() => (setLines((l) => (l.find((x) => x.id === p.id) ? l : [...l, { id: p.id, qty: 1 }])), setQ(""))} className="flex w-full items-center gap-3 p-2.5 text-left hover:bg-stone-50 cursor-pointer"><Img src={p.img} alt="" className="size-10 rounded-lg" /><span className="flex-1 truncate text-sm font-semibold">{p.name}</span><span className="tnum text-sm font-bold">{money(salePrice(p))}</span><Plus className="size-4 text-slate-400" /></button></li>))}</ul>}
            </div>
            {lines.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">No items yet. Search above to add catalog items.</p> : (
              <ul className="mt-4 divide-y divide-line">{lines.map((l) => { const p = products.find((x) => x.id === l.id)!; return (<li key={l.id} className="flex items-center gap-3 py-3"><Img src={p.img} alt="" className="size-12 rounded-lg" /><span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.name}</span><Qty value={l.qty} onChange={(n) => setLines((s) => s.map((x) => (x.id === l.id ? { ...x, qty: n } : x)))} /><span className="tnum w-20 text-right text-sm font-bold">{money(salePrice(p) * l.qty)}</span><button aria-label="Remove" onClick={() => setLines((s) => s.filter((x) => x.id !== l.id))} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="size-4" /></button></li>); })}</ul>
            )}
          </Surface>
          <Surface><Field label="Internal admin note"><Textarea placeholder="e.g. Call back at 5 PM, confirmed on WhatsApp" /></Field></Surface>
        </div>
        <Surface className="xl:sticky xl:top-20">
          <h2 className="font-extrabold">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="tnum font-semibold">{money(sub)}</dd></div>
            <div className="flex items-center justify-between"><dt className="text-slate-500">Delivery charge</dt><dd><Input value={delivery} onChange={(e) => setDelivery(+e.target.value || 0)} className="h-8 w-24 text-right" /></dd></div>
            <div className="flex items-center justify-between"><dt className="text-slate-500">Advance paid</dt><dd><Input value={advance} onChange={(e) => setAdvance(+e.target.value || 0)} className="h-8 w-24 text-right" /></dd></div>
            <div className="flex justify-between border-t border-line pt-3"><dt className="font-bold">Total order value</dt><dd className="tnum font-extrabold">{money(sub + delivery)}</dd></div>
            <div className="flex justify-between"><dt className="font-bold">Due on delivery (COD)</dt><dd className="tnum text-xl font-extrabold">{money(sub + delivery - advance)}</dd></div>
          </dl>
          <Button size="lg" full className="mt-6" disabled={!lines.length} onClick={() => (toast.push("Order created"), navigate("/admin/orders"))}>Create order</Button>
        </Surface>
      </div>
    </>
  );
}
