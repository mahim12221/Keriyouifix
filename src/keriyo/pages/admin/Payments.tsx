import { useState } from "react";
import { Check, Copy, RefreshCw, X } from "lucide-react";
import { Badge, Button, Chip, Field, Input, Modal, PageHeader, SearchInput, StatusBadge, Stat, Surface, Table, Td, Textarea, Th, Tr, money, useToast } from "../../ui";
import { orderTotal, orders } from "../../data";

type Row = { id: string; customer: string; phone: string; method: string; trx: string; amount: number; total: number; state: string };
const seed: Row[] = [
  ...orders.filter((o) => o.trx).map((o) => ({ id: o.id, customer: o.customer, phone: o.phone, method: o.payment, trx: o.trx!, amount: o.advance, total: orderTotal(o), state: o.trxState! })),
  { id: "KR-10470", customer: "Imran Khan", phone: "01712 003344", method: "bKash", trx: "", amount: 500, total: 3200, state: "Pending" },
  { id: "KR-10466", customer: "Shuvo Das", phone: "01922 118877", method: "Nagad", trx: "FAKE12345", amount: 4200, total: 4280, state: "Rejected" },
];

export default function Payments() {
  const [rows, setRows] = useState(seed);
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const [rec, setRec] = useState<Row | null>(null);
  const [rej, setRej] = useState<Row | null>(null);
  const [amt, setAmt] = useState("");
  const toast = useToast();
  const set = (id: string, state: string, msg: string) => (setRows((r) => r.map((x) => (x.id === id ? { ...x, state } : x))), toast.push(msg));
  const list = rows.filter((r) => (f === "All" || r.state === f) && (r.id + r.trx + r.phone + r.customer).toLowerCase().includes(q.toLowerCase()));
  const n = (s: string) => rows.filter((r) => r.state === s).length;
  return (
    <>
      <PageHeader title="Payments" sub="bKash & Nagad TrxID verification against your statement." actions={<Button variant="secondary" onClick={() => toast.push("Synced")}><RefreshCw className="size-4" />Sync live</Button>} />
      <Surface pad={false} className="grid grid-cols-2 sm:grid-cols-4 [&>*]:p-5"><Stat label="Total MFS orders" value={String(rows.length)} /><Stat label="Pending review" value={String(n("Pending"))} hint="Need verification" /><Stat label="Verified paid" value={String(n("Verified"))} /><Stat label="Rejected / fake" value={String(n("Rejected"))} /></Surface>
      <div className="mt-6 mb-4 flex flex-wrap items-center gap-2">{["All", "Pending", "Verified", "Rejected"].map((s) => <Chip key={s} active={f === s} onClick={() => setF(s)}>{s}</Chip>)}<SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="TrxID, phone or order ID…" className="ml-auto sm:w-72" /></div>
      <Surface pad={false}>
        <Table><thead><tr><Th>Order</Th><Th>Method</Th><Th>TrxID</Th><Th className="text-right">Claimed</Th><Th className="text-right">Order total</Th><Th>Status</Th><Th /></tr></thead><tbody>
          {list.map((r) => (
            <Tr key={r.id}>
              <Td><p className="font-extrabold text-slate-900">{r.id}</p><p className="text-xs text-slate-500">{r.customer} · <span className="tnum">{r.phone}</span></p></Td>
              <Td><Badge tone={r.method === "bKash" ? "danger" : "warning"}>{r.method}</Badge></Td>
              <Td>{r.trx ? <button onClick={() => toast.push("TrxID copied")} className="inline-flex items-center gap-1.5 rounded-md bg-stone-100 px-2 py-1 font-mono text-xs font-bold cursor-pointer">{r.trx}<Copy className="size-3 text-slate-400" /></button> : <span className="text-xs text-slate-400">Not provided</span>}</Td>
              <Td className="tnum text-right font-bold text-slate-900">{money(r.amount)}</Td><Td className="tnum text-right">{money(r.total)}</Td>
              <Td><StatusBadge status={r.state} /></Td>
              <Td className="text-right">{r.state === "Pending" ? <div className="flex justify-end gap-1.5"><Button size="sm" onClick={() => (setRec(r), setAmt(String(r.amount)))}><Check className="size-3.5" />Verify</Button><Button size="sm" variant="danger" onClick={() => setRej(r)}><X className="size-3.5" />Reject</Button></div> : <Button size="sm" variant="ghost" onClick={() => set(r.id, "Pending", "Verification reverted")}>Revert</Button>}</Td>
            </Tr>
          ))}
        </tbody></Table>
      </Surface>

      <Modal open={!!rec} onClose={() => setRec(null)} title="Reconcile payment" sub={rec ? `${rec.id} · ${rec.method} · ${rec.trx || "no TrxID"}` : ""} width="max-w-md" footer={<><Button variant="ghost" onClick={() => setRec(null)}>Cancel</Button><Button onClick={() => (set(rec!.id, "Verified", "Payment verified"), setRec(null))}>Verified &amp; confirmed</Button></>}>
        <Field label="Actually received amount (BDT) *" hint="Edit if the statement differs from the claimed amount."><Input value={amt} onChange={(e) => setAmt(e.target.value)} inputMode="numeric" /></Field>
      </Modal>
      <Modal open={!!rej} onClose={() => setRej(null)} title="Reject / flag TrxID" width="max-w-md" footer={<><Button variant="ghost" onClick={() => setRej(null)}>Cancel</Button><Button variant="danger" onClick={() => (set(rej!.id, "Rejected", "TrxID rejected"), setRej(null))}>Reject payment</Button></>}>
        <Field label="Reason for rejection *"><Textarea placeholder="e.g. Fake TrxID, repetitive, unmatched statement" /></Field>
      </Modal>
    </>
  );
}
