import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { Badge, Button, Field, Input, Modal, PageHeader, Select, Stat, Surface, Table, Tabs, Td, Th, Tr, money, useToast, Img } from "../../ui";
import { AreaChart } from "../../ui/charts";
import { days30, expenses, products, revenue30, staffMembers } from "../../data";
import { Progress } from "../../ui/charts";

export function Finance() {
  const [add, setAdd] = useState(false);
  const toast = useToast();
  const gross = 312400;
  const cogs = 187440;
  const exp = expenses.reduce((a, e) => a + e.amount, 0);
  return (
    <>
      <PageHeader title="Finance" sub="Real-time COGS, ad spend, courier settlements and net profit." actions={<Button onClick={() => setAdd(true)}><Plus className="size-4" />Record expense</Button>} />
      <Surface pad={false} className="grid grid-cols-2 sm:grid-cols-4 [&>*]:p-5"><Stat label="Gross sales" value={money(gross)} hint="Delivered & confirmed" /><Stat label="Product COGS" value={money(cogs)} hint="Inventory cost" /><Stat label="Total expenses" value={money(exp)} hint="Ads & operations" /><Stat label="Net profit" value={money(gross - cogs - exp)} delta="+11%" hint={`${Math.round(((gross - cogs - exp) / gross) * 100)}% margin`} /></Surface>
      <Surface className="mt-6"><h2 className="mb-4 font-extrabold">Revenue · last 30 days</h2><AreaChart data={revenue30} labels={days30} height={200} format={money} /></Surface>
      <h2 className="mb-3 mt-8 font-extrabold">Operational expenses ledger</h2>
      <Surface pad={false}><Table><thead><tr><Th>Title</Th><Th>Category</Th><Th>Date</Th><Th className="text-right">Amount</Th></tr></thead><tbody>{expenses.map((e) => <Tr key={e.title}><Td className="font-semibold text-slate-900">{e.title}</Td><Td><Badge>{e.cat}</Badge></Td><Td>{e.date}</Td><Td className="tnum text-right font-bold text-slate-900">{money(e.amount)}</Td></Tr>)}</tbody></Table></Surface>
      <Modal open={add} onClose={() => setAdd(false)} title="Record business expense" footer={<><Button variant="ghost" onClick={() => setAdd(false)}>Cancel</Button><Button onClick={() => (setAdd(false), toast.push("Expense recorded"))}>Save expense</Button></>}>
        <div className="space-y-4"><Field label="Expense title *"><Input placeholder="e.g. Facebook Ads Campaign #5" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Category"><Select><option>Facebook ad spend</option><option>Google / TikTok ads</option><option>Packaging & labels</option><option>Courier return charges</option><option>Staff salary & commission</option><option>Other overhead</option></Select></Field><Field label="Amount (৳)"><Input placeholder="0.00" /></Field></div><Field label="Notes (optional)"><Input placeholder="Reference invoice or details…" /></Field></div>
      </Modal>
    </>
  );
}

export function Reports() {
  const [tab, setTab] = useState("sales");
  const toast = useToast();
  return (
    <>
      <PageHeader title="Reports" sub="Downloadable audits for sales, staff delivery success and product velocity." actions={<Button variant="secondary" onClick={() => toast.push("CSV exported")}><Download className="size-4" />Export CSV</Button>} />
      <Tabs className="mb-6" value={tab} onChange={setTab} tabs={[{ value: "sales", label: "Sales & revenue" }, { value: "staff", label: "Staff performance" }, { value: "products", label: "Product velocity" }]} />
      <div key={tab} className="anim-fade">
        {tab === "sales" && <><Surface pad={false} className="mb-6 grid grid-cols-3 [&>*]:p-5"><Stat label="Total orders" value="318" /><Stat label="Cancelled / fake" value="19" /><Stat label="Gross revenue" value={money(312400)} /></Surface><Surface pad={false}><Table><thead><tr><Th>Date</Th><Th className="text-right">Orders</Th><Th className="text-right">Cancelled</Th><Th className="text-right">Revenue</Th></tr></thead><tbody>{[["12 May", 24, 1, 48200], ["11 May", 19, 2, 36950], ["10 May", 22, 0, 41200], ["09 May", 17, 1, 30800]].map((r) => <Tr key={r[0]}><Td className="font-semibold text-slate-900">{r[0]}</Td><Td className="tnum text-right">{r[1]}</Td><Td className="tnum text-right">{r[2]}</Td><Td className="tnum text-right font-bold text-slate-900">{money(r[3] as number)}</Td></Tr>)}</tbody></Table></Surface></>}
        {tab === "staff" && <Surface pad={false}><Table><thead><tr><Th>Staff</Th><Th>Role</Th><Th className="text-right">Assigned</Th><Th className="w-48">Delivered ratio</Th></tr></thead><tbody>{staffMembers.filter((s) => s.assigned).map((s) => <Tr key={s.name}><Td className="font-semibold text-slate-900">{s.name}</Td><Td>{s.role}</Td><Td className="tnum text-right">{s.assigned}</Td><Td><div className="flex items-center gap-3"><div className="flex-1"><Progress value={s.ratio} tone="success" /></div><b className="tnum text-xs">{s.ratio}%</b></div></Td></Tr>)}</tbody></Table></Surface>}
        {tab === "products" && <Surface pad={false}><Table><thead><tr><Th>Product</Th><Th className="text-right">Units sold</Th></tr></thead><tbody>{products.slice(0, 6).map((p, i) => <Tr key={p.id}><Td><div className="flex items-center gap-3"><Img src={p.img} alt="" className="size-10 rounded-lg" /><span className="font-semibold text-slate-900">{p.name}</span></div></Td><Td className="tnum text-right font-bold text-slate-900">{[84, 66, 51, 38, 29, 17][i]}</Td></Tr>)}</tbody></Table></Surface>}
      </div>
    </>
  );
}
