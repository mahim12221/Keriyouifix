import { useState } from "react";
import { Bell, CheckCircle2, Clock, Package, Send } from "lucide-react";
import { Badge, Button, Field, Img, Input, PageHeader, Select, Stat, Surface, Table, Td, Textarea, Th, Tr, Chip, money, useToast, Tabs } from "../../ui";
import { Progress } from "../../ui/charts";
import { orders, products, type Order } from "../../data";
import { OrderDrawer, OrdersTable } from "../admin/Orders";
import { ChatsView } from "../admin/Team";
import { FraudInspector } from "../admin/Fraud";

export function StaffDashboard() {
  const [open, setOpen] = useState<Order | null>(null);
  const mine = orders.filter((o) => o.staff === "Rafi Hasan" || !o.staff);
  const queue = mine.filter((o) => !["Delivered", "Cancelled", "Returned"].includes(o.status));
  return (
    <>
      <PageHeader title="Good morning, Rafi" sub="Here's your queue for today." />
      <Surface pad={false} className="grid grid-cols-2 sm:grid-cols-4 [&>*]:p-5"><Stat icon={<Package className="size-4" />} label="Assigned" value="148" /><Stat icon={<Clock className="size-4" />} label="Open now" value={String(queue.length)} /><Stat icon={<CheckCircle2 className="size-4" />} label="Delivered ratio" value="91%" delta="+2%" /><Stat icon={<Bell className="size-4" />} label="Unread alerts" value="3" /></Surface>
      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_320px]">
        <Surface pad={false}><div className="border-b border-line p-5"><h2 className="font-extrabold">Your queue</h2></div><OrdersTable rows={queue} onOpen={setOpen} staff /></Surface>
        <Surface><h2 className="mb-4 font-extrabold">This month</h2><div className="space-y-5">{[["Confirmed on time", 94], ["Delivered", 91], ["Call-back rate", 78]].map(([l, v]) => <div key={l as string}><div className="mb-1.5 flex justify-between text-sm"><span className="text-slate-600">{l as string}</span><b>{v}%</b></div><Progress value={v as number} tone="success" /></div>)}</div></Surface>
      </div>
      <OrderDrawer o={open} onClose={() => setOpen(null)} staff />
    </>
  );
}

export function StaffOrders() {
  const [open, setOpen] = useState<Order | null>(null);
  const [f, setF] = useState("All");
  const rows = orders.filter((o) => f === "All" || (f === "Unclaimed" ? !o.staff : o.staff === "Rafi Hasan"));
  return (
    <>
      <PageHeader title="Orders" sub="Claim orders, add call notes and update the workflow." />
      <div className="mb-4 flex gap-2">{["All", "Unclaimed", "Mine"].map((x) => <Chip key={x} active={f === x} onClick={() => setF(x)}>{x}</Chip>)}</div>
      <Surface pad={false}><OrdersTable rows={rows} onOpen={setOpen} staff /></Surface>
      <OrderDrawer o={open} onClose={() => setOpen(null)} staff />
    </>
  );
}

export function StaffProducts() {
  const [tab, setTab] = useState("propose");
  const toast = useToast();
  const [sel, setSel] = useState(products[4].id);
  const p = products.find((x) => x.id === sel)!;
  return (
    <>
      <PageHeader title="Product proposals" sub="Suggest price, stock or content changes. Admin reviews and publishes." />
      <Tabs className="mb-6" value={tab} onChange={setTab} tabs={[{ value: "propose", label: "New proposal" }, { value: "sent", label: "Submitted", count: 2 }]} />
      {tab === "propose" ? (
        <div className="anim-fade grid items-start gap-6 lg:grid-cols-[320px_1fr]">
          <Surface pad={false}><ul className="max-h-[480px] divide-y divide-line overflow-y-auto">{products.map((x) => <li key={x.id}><button onClick={() => setSel(x.id)} className={`flex w-full items-center gap-3 p-3 text-left transition-colors cursor-pointer ${sel === x.id ? "bg-brand-50/60" : "hover:bg-stone-50"}`}><Img src={x.img} alt="" className="size-11 rounded-lg" /><span className="line-clamp-2 text-sm font-semibold">{x.name}</span></button></li>)}</ul></Surface>
          <Surface key={sel} className="anim-fade"><h2 className="mb-5 font-extrabold">{p.name}</h2><div className="grid gap-4 sm:grid-cols-2"><Field label="Price (৳)"><Input defaultValue={p.price} /></Field><Field label="Stock"><Input defaultValue={p.stock} /></Field><Field label="Description" className="sm:col-span-2"><Textarea defaultValue={p.blurb} className="min-h-28" /></Field></div><Button className="mt-5" onClick={() => toast.push("Proposal sent to admin")}><Send className="size-4" />Submit for approval</Button></Surface>
        </div>
      ) : (
        <Surface pad={false} className="anim-fade"><Table><thead><tr><Th>Product</Th><Th>Change</Th><Th>Submitted</Th><Th>Status</Th></tr></thead><tbody><Tr><Td className="font-semibold text-slate-900">Air Buds Pro</Td><Td>Price ৳3,600 → ৳3,200</Td><Td>Today</Td><Td><Badge tone="warning" dot>Pending</Badge></Td></Tr><Tr><Td className="font-semibold text-slate-900">Pulse Smartwatch S2</Td><Td>Description & stock</Td><Td>Yesterday</Td><Td><Badge tone="success" dot>Approved</Badge></Td></Tr></tbody></Table></Surface>
      )}
    </>
  );
}

export const StaffChats = () => (<><PageHeader title="Chats" sub="Reply to customer conversations." /><ChatsView /></>);
export const StaffFraud = () => (<><PageHeader title="Fraud check" sub="Look up a customer's delivery history before confirming an order." /><FraudInspector /></>);
export { Select, money };
