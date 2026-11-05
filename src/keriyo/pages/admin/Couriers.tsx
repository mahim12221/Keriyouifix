import { useState } from "react";
import { ScanBarcode, Truck, Check } from "lucide-react";
import { Badge, Button, Field, Input, PageHeader, Stat, Surface, Table, Tabs, Td, Th, Tr, money, useToast, StatusBadge } from "../../ui";
import { orders, orderTotal } from "../../data";

export default function Couriers() {
  const [tab, setTab] = useState("overview");
  const [code, setCode] = useState("");
  const [log, setLog] = useState<{ c: string; t: string; ok: boolean }[]>([]);
  const toast = useToast();
  const booked = orders.filter((o) => o.tracking);
  const scan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const ok = booked.some((o) => o.tracking === code.trim() || o.id === code.trim());
    setLog((l) => [{ c: code.trim(), t: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }), ok }, ...l]);
    setCode("");
  };
  return (
    <>
      <PageHeader title="Couriers" sub="Steadfast, Pathao and RedX — bookings, balances and warehouse scanning." />
      <Tabs className="mb-6" value={tab} onChange={setTab} tabs={[{ value: "overview", label: "Overview" }, { value: "scan", label: "Warehouse scan" }, { value: "api", label: "API credentials" }]} />

      {tab === "overview" && (
        <div className="anim-fade space-y-6">
          <Surface pad={false} className="grid grid-cols-2 sm:grid-cols-4 [&>*]:p-5"><Stat label="Steadfast bookings" value={String(booked.length)} /><Stat label="COD collected" value={money(21450)} hint="Delivered" /><Stat label="In transit" value="2" /><Stat label="Merchant balance" value={money(12840)} hint="Steadfast" /></Surface>
          <Surface pad={false}><Table><thead><tr><Th>Order</Th><Th>Customer</Th><Th>Consignment</Th><Th className="text-right">COD</Th><Th>Courier status</Th></tr></thead><tbody>
            {booked.map((o) => <Tr key={o.id}><Td className="font-extrabold text-slate-900">{o.id}</Td><Td>{o.customer}</Td><Td className="tnum font-mono text-xs">{o.tracking}</Td><Td className="tnum text-right font-bold text-slate-900">{money(orderTotal(o) - (o.trxState === "Verified" ? o.advance : 0))}</Td><Td><StatusBadge status={o.status} /></Td></Tr>)}
          </tbody></Table></Surface>
        </div>
      )}

      {tab === "scan" && (
        <div className="anim-fade grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Surface>
            <div className="mb-4 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700"><ScanBarcode className="size-5" /></span><div><h2 className="font-extrabold">Scan to dispatch</h2><p className="text-sm text-slate-500">USB / Bluetooth reader or paste a tracking code.</p></div></div>
            <form onSubmit={scan} className="flex gap-2"><Input autoFocus value={code} onChange={(e) => setCode(e.target.value)} placeholder="SF-88420191 or KR-10479" className="font-mono" /><Button type="submit">Scan</Button></form>
            <p className="mt-3 text-xs text-slate-500">Try: <button className="font-mono font-bold text-brand-700 cursor-pointer" onClick={() => setCode("SF-88420191")}>SF-88420191</button></p>
          </Surface>
          <Surface pad={false}>
            <div className="border-b border-line p-5"><h2 className="font-extrabold">Session log</h2></div>
            {log.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">Ready for scanning. Connect a barcode reader or paste a code.</p> : <ul className="divide-y divide-line">{log.map((l, i) => <li key={i} className="anim-rise flex items-center gap-3 px-5 py-3 text-sm"><span className={`grid size-6 place-items-center rounded-full ${l.ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{l.ok ? <Check className="size-3.5" strokeWidth={3} /> : "!"}</span><span className="font-mono font-bold">{l.c}</span><Badge tone={l.ok ? "success" : "danger"}>{l.ok ? "Handed over" : "Not found"}</Badge><span className="ml-auto text-xs text-slate-400">{l.t}</span></li>)}</ul>}
          </Surface>
        </div>
      )}

      {tab === "api" && (
        <div className="anim-fade grid gap-6 lg:grid-cols-3">
          {[["Steadfast", "Merchant portal integration", ["API key", "Secret key"]], ["Pathao", "Aladdin gateway", ["Client ID", "Client secret"]], ["RedX", "Bearer token (optional)", ["API token"]]].map(([n, d, f]) => (
            <Surface key={n as string}>
              <div className="mb-4 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-stone-100"><Truck className="size-5 text-slate-600" /></span><div><h2 className="font-extrabold">{n as string}</h2><p className="text-xs text-slate-500">{d as string}</p></div></div>
              <div className="space-y-3">{(f as string[]).map((x) => <Field key={x} label={x}><Input type="password" placeholder={`Paste ${x.toLowerCase()}`} /></Field>)}</div>
              <Button className="mt-4" variant="secondary" full onClick={() => toast.push(`${n} credentials saved`)}>Save credentials</Button>
            </Surface>
          ))}
        </div>
      )}
    </>
  );
}
