import { useState } from "react";
import { Ban, MessageCircle, Phone, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge, Button, Field, Input, Modal, PageHeader, Select, Surface, Switch, Table, Tabs, Td, Textarea, Th, Tr, useToast } from "../../ui";
import { Donut, Progress } from "../../ui/charts";

const couriers = [["Steadfast", 14, 1, 1], ["Pathao", 6, 1, 0], ["RedX", 3, 0, 1], ["Paperfly", 2, 0, 0]] as const;

/** Phone inspection — reused by the staff "Fraud check" page. */
export function FraudInspector() {
  const [phone, setPhone] = useState("");
  const [res, setRes] = useState<null | { rate: number; d: number; c: number; r: number }>(null);
  const [busy, setBusy] = useState(false);
  const run = (v = phone) => {
    if (v.replace(/\D/g, "").length < 10) return;
    setBusy(true);
    setRes(null);
    setTimeout(() => {
      const bad = v.endsWith("0");
      setRes(bad ? { rate: 38, d: 5, c: 4, r: 4 } : { rate: 92, d: 24, c: 1, r: 1 });
      setBusy(false);
    }, 900);
  };
  return (
    <div className="space-y-6">
      <Surface>
        <h2 className="font-extrabold">Customer delivery history</h2><p className="mb-4 mt-1 text-sm text-slate-500">Check return rates across Steadfast, Pathao, RedX and Paperfly before approving a high-value COD order.</p>
        <form onSubmit={(e) => (e.preventDefault(), run())} className="flex gap-2"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Customer mobile (017XXXXXXXX)" inputMode="tel" className="max-w-sm" /><Button type="submit" loading={busy}>Inspect phone</Button></form>
        <p className="mt-3 text-xs text-slate-500">Quick test: <button onClick={() => (setPhone("01711223344"), run("01711223344"))} className="font-bold text-brand-700 cursor-pointer">01711223344</button> (safe) · <button onClick={() => (setPhone("01600000000"), run("01600000000"))} className="font-bold text-brand-700 cursor-pointer">01600000000</button> (risky)</p>
      </Surface>
      {res && (
        <Surface className="anim-rise">
          <div className="flex flex-wrap items-center gap-8">
            <Donut size={140} parts={[{ label: "Delivered", value: res.d, color: "#10b981" }, { label: "Cancelled", value: res.c, color: "#f59e0b" }, { label: "Returned", value: res.r, color: "#f43f5e" }]} center={{ big: res.rate + "%", small: "Success rate" }} />
            <div className="min-w-60 flex-1">
              <div className={`mb-4 flex items-start gap-3 rounded-xl p-4 text-sm ${res.rate > 70 ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>{res.rate > 70 ? <ShieldCheck className="size-5 shrink-0" /> : <ShieldAlert className="size-5 shrink-0" />}<div><p className="font-extrabold">{res.rate > 70 ? "Safe order recommendation" : "Fraud prevention recommendation"}</p><p className="mt-0.5">{res.rate > 70 ? "Strong delivery record. Proceed with COD." : "High return rate. Ask for an advance bKash/Nagad payment or block this number."}</p></div></div>
              <div className="flex gap-2"><Button size="sm" variant="secondary"><Phone className="size-3.5" />Call</Button><Button size="sm" variant="secondary"><MessageCircle className="size-3.5" />WhatsApp</Button>{res.rate <= 70 && <Button size="sm" variant="danger"><Ban className="size-3.5" />Block</Button>}</div>
            </div>
          </div>
          <Table className="mt-6"><thead><tr><Th>Courier</Th><Th className="text-right">Delivered</Th><Th className="text-right">Cancelled</Th><Th className="text-right">Returned</Th><Th className="w-40">Rate</Th></tr></thead><tbody>
            {couriers.map(([n, d, c, r]) => <Tr key={n}><Td className="font-semibold text-slate-900">{n}</Td><Td className="tnum text-right">{d}</Td><Td className="tnum text-right">{c}</Td><Td className="tnum text-right">{r}</Td><Td><Progress value={(d / (d + c + r)) * 100} tone="success" /></Td></Tr>)}
          </tbody></Table>
        </Surface>
      )}
    </div>
  );
}

export default function Fraud() {
  const [tab, setTab] = useState("inspect");
  const [modal, setModal] = useState<null | "block" | "report">(null);
  const [vpn, setVpn] = useState(true);
  const [dup, setDup] = useState(true);
  const toast = useToast();
  return (
    <>
      <PageHeader title="Fraud & security" sub="Phone inspection, blacklist, courier complaints and anti-fraud rules." actions={<Button variant="secondary" onClick={() => setModal("block")}><Ban className="size-4" />Block number</Button>} />
      <Tabs className="mb-6" value={tab} onChange={setTab} tabs={[{ value: "inspect", label: "Inspect phone" }, { value: "black", label: "Blacklist", count: 2 }, { value: "rep", label: "Complaints", count: 2 }, { value: "rules", label: "Rules" }]} />
      <div className="anim-fade" key={tab}>
        {tab === "inspect" && <FraudInspector />}
        {tab === "black" && (
          <Surface pad={false}><Table><thead><tr><Th>Mobile</Th><Th>Name</Th><Th>Reason</Th><Th>Admin note</Th><Th /></tr></thead><tbody>
            {[["01600 000000", "Rakib Hasan", "Wrong address / phone switched off", "Returned 3×"], ["01500 111222", "Unknown", "Competitor spam orders", "—"]].map((r) => <Tr key={r[0]}><Td className="tnum font-bold text-slate-900">{r[0]}</Td><Td>{r[1]}</Td><Td><Badge tone="danger">{r[2]}</Badge></Td><Td className="text-[13px]">{r[3]}</Td><Td className="text-right"><Button size="sm" variant="secondary" onClick={() => toast.push("Customer unblocked")}>Unblock</Button></Td></Tr>)}
          </tbody></Table></Surface>
        )}
        {tab === "rep" && (
          <><div className="mb-4 flex justify-end"><Button onClick={() => setModal("report")}>Add complaint</Button></div><Surface pad={false}><Table><thead><tr><Th>Phone</Th><Th>Courier</Th><Th>Type</Th><Th className="text-right">Amount</Th></tr></thead><tbody>
            {[["01711 009900", "Pathao", "Phone switched off at delivery", 2400], ["01844 332211", "Steadfast", "Wrong or fake address", 1800]].map((r) => <Tr key={r[0] as string}><Td className="tnum font-bold text-slate-900">{r[0]}</Td><Td>{r[1]}</Td><Td>{r[2]}</Td><Td className="tnum text-right">৳{(r[3] as number).toLocaleString()}</Td></Tr>)}
          </tbody></Table></Surface></>
        )}
        {tab === "rules" && (
          <Surface className="max-w-2xl divide-y divide-line !p-0">
            {[["VPN / proxy protection", "Flag orders placed through VPN or foreign IPs.", vpn, setVpn], ["Duplicate order block", "Block repeat orders from the same phone within the window.", dup, setDup]].map(([t, d, v, s]) => <div key={t as string} className="flex items-center justify-between gap-6 p-5"><div><p className="font-bold">{t as string}</p><p className="text-sm text-slate-500">{d as string}</p></div><Switch checked={v as boolean} onChange={s as (v: boolean) => void} /></div>)}
            <div className="grid gap-4 p-5 sm:grid-cols-2"><Field label="Block window (minutes)"><Input defaultValue={30} /></Field><Field label="Minimum delivery success rate (%)"><Input defaultValue={60} /></Field></div>
            <div className="p-5"><Button onClick={() => toast.push("Rules saved")}>Save rules</Button></div>
          </Surface>
        )}
      </div>
      <Modal open={modal === "block"} onClose={() => setModal(null)} title="Add to blacklist" footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button variant="danger" onClick={() => (setModal(null), toast.push("Number blocked"))}>Block customer</Button></>}>
        <div className="space-y-4"><Field label="Mobile number *"><Input placeholder="017XXXXXXXX" /></Field><Field label="Customer name"><Input /></Field><Field label="Reason *"><Select><option>Wrong address / phone switched off</option><option>Competitor spam orders</option><option>Other financial risk / fraud</option></Select></Field><Field label="Details"><Textarea placeholder="Additional details…" /></Field></div>
      </Modal>
      <Modal open={modal === "report"} onClose={() => setModal(null)} title="Submit courier complaint" footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button onClick={() => (setModal(null), toast.push("Complaint submitted"))}>Submit</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Phone *"><Input placeholder="017XXXXXXXX" /></Field><Field label="Courier"><Select><option>Steadfast</option><option>Pathao</option><option>RedX</option><option>Paperfly</option></Select></Field><Field label="Type *" className="sm:col-span-2"><Select><option>Parcel returned with no reason</option><option>Phone switched off at delivery</option><option>Wrong or fake address</option><option>Rider misbehaviour</option></Select></Field><Field label="Order amount"><Input placeholder="1500" /></Field><Field label="Comment *" className="sm:col-span-2"><Textarea /></Field></div>
      </Modal>
    </>
  );
}
