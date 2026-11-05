import { useState } from "react";
import { Check, Database, ImagePlus, Mail, Send, Trash2, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar, Badge, Button, Field, Input, Modal, PageHeader, SearchInput, Select, Surface, Table, Td, Th, Tr, EmptyState, useToast, Stat } from "../../ui";
import { customers, pendingStaff, proposals, staffMembers, thread } from "../../data";

export function Staff() {
  const [pend, setPend] = useState(pendingStaff);
  const [props, setProps] = useState(proposals);
  const [diff, setDiff] = useState<(typeof proposals)[number] | null>(null);
  const [add, setAdd] = useState(false);
  const toast = useToast();
  return (
    <>
      <PageHeader title="Staff & approvals" sub="Approve access requests, review product changes and manage your team." actions={<Button onClick={() => setAdd(true)}>Add staff member</Button>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Surface>
          <div className="mb-4 flex items-center gap-2"><h2 className="font-extrabold">Access requests</h2>{pend.length > 0 && <Badge tone="warning">{pend.length} action required</Badge>}</div>
          {pend.length === 0 ? <p className="py-6 text-sm text-slate-500">No pending staff registration requests.</p> : pend.map((p) => (
            <div key={p.email} className="anim-rise flex flex-wrap items-center gap-4"><Avatar name={p.name} size={44} /><div className="min-w-0 flex-1"><p className="font-bold">{p.name}</p><p className="text-xs text-slate-500">{p.role} · {p.email} · {p.when}</p></div><div className="flex gap-2"><Button size="sm" variant="danger" onClick={() => setPend([])}><X className="size-3.5" />Reject</Button><Button size="sm" onClick={() => (setPend([]), toast.push("Access approved"))}><Check className="size-3.5" />Approve</Button></div></div>
          ))}
        </Surface>
        <Surface>
          <div className="mb-4 flex items-center gap-2"><h2 className="font-extrabold">Product proposals</h2>{props.length > 0 && <Badge tone="info">Requires verification</Badge>}</div>
          {props.length === 0 ? <p className="py-6 text-sm text-slate-500">No pending product proposals.</p> : <ul className="divide-y divide-line">{props.map((p) => <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0"><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{p.product} <span className="font-medium text-slate-500">· {p.field}</span></p><p className="text-xs text-slate-500">{p.staff} · {p.when}</p></div><Button size="sm" variant="secondary" onClick={() => setDiff(p)}>Review diff</Button></li>)}</ul>}
        </Surface>
      </div>
      <h2 className="mb-3 mt-8 font-extrabold">Team</h2>
      <Surface pad={false}><Table><thead><tr><Th>Staff</Th><Th>Email & phone</Th><Th>Role</Th><Th /></tr></thead><tbody>{staffMembers.map((s) => <Tr key={s.email}><Td><div className="flex items-center gap-3"><Avatar name={s.name} size={34} /><span className="font-semibold text-slate-900">{s.name}</span></div></Td><Td className="text-[13px]">{s.email}<span className="tnum block text-xs text-slate-400">{s.phone}</span></Td><Td><Badge tone="brand">{s.role}</Badge></Td><Td className="text-right"><Button size="sm" variant="ghost" className="text-rose-600" aria-label="Remove"><Trash2 className="size-4" /></Button></Td></Tr>)}</tbody></Table></Surface>

      <Modal open={!!diff} onClose={() => setDiff(null)} title="Product change detail" sub={diff ? `${diff.product} · submitted by ${diff.staff}` : ""} width="max-w-2xl" footer={<><Button variant="danger" onClick={() => (setProps((p) => p.filter((x) => x.id !== diff!.id)), setDiff(null))}>Reject proposal</Button><Button onClick={() => (setProps((p) => p.filter((x) => x.id !== diff!.id)), setDiff(null), toast.push("Approved & published"))}>Approve &amp; publish</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-stone-100/70 p-4"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Original live data</p><p className="font-bold">{diff?.from}</p></div>
          <div className="rounded-xl bg-emerald-50 p-4"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">Staff proposed</p><p className="font-bold text-emerald-900">{diff?.to}</p></div>
        </div>
        <p className="mt-4 text-sm text-slate-600">{diff?.desc}</p>
        <Field label="Admin verification note (optional)" className="mt-4"><Input placeholder="e.g. Verified pricing and stock count." /></Field>
      </Modal>
      <Modal open={add} onClose={() => setAdd(false)} title="Add new staff member" footer={<><Button variant="ghost" onClick={() => setAdd(false)}>Cancel</Button><Button onClick={() => (setAdd(false), toast.push("Staff created & activated"))}>Create &amp; activate</Button></>}>
        <div className="space-y-4"><Field label="Full name *"><Input placeholder="e.g. Tanvir Ahmed" /></Field><Field label="Work email *"><Input placeholder="tanvir@keriyo.com" /></Field><Field label="Phone"><Input placeholder="01822334455" /></Field><Field label="Assign role"><Select><option>Sales Executive</option><option>Courier Support Agent</option><option>Product Content Staff</option><option>Manager</option></Select></Field></div>
      </Modal>
    </>
  );
}

export function ChatsView({ full = true }: { full?: boolean }) {
  const [sel, setSel] = useState(0);
  const [msgs, setMsgs] = useState(thread);
  const [t, setT] = useState("");
  const [profile, setProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const c = customers[sel];
  const send = (e: React.FormEvent) => { e.preventDefault(); if (!t.trim()) return; setMsgs((m) => [...m, { from: "agent", text: t, t: "now" }]); setT(""); };
  return (
    <>
      <div className={cn("grid overflow-hidden rounded-2xl border border-line bg-white shadow-card", full ? "h-[calc(100dvh-13rem)] min-h-[480px]" : "h-[520px]", "lg:grid-cols-[320px_1fr]")}>
        <div className={cn("flex-col border-r border-line", mobileOpen ? "hidden lg:flex" : "flex")}>
          <div className="border-b border-line p-3"><SearchInput placeholder="Search name, email or ID…" /></div>
          <ul className="thin-scroll flex-1 overflow-y-auto">{customers.map((u, i) => <li key={u.email}><button onClick={() => (setSel(i), setMobileOpen(true))} className={cn("flex w-full items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer", sel === i ? "bg-brand-50/60" : "hover:bg-stone-50")}><Avatar name={u.name} size={40} /><div className="min-w-0 flex-1"><div className="flex justify-between"><p className="truncate text-sm font-bold">{u.name}</p><span className="text-[11px] text-slate-400">11:2{i}</span></div><p className="truncate text-xs text-slate-500">{i === 0 ? "Great, can I get it with cash on delivery?" : "Thanks for the quick reply!"}</p></div>{i < 2 && <span className="size-2 rounded-full bg-brand-500" />}</button></li>)}</ul>
        </div>
        <div className={cn("min-w-0 flex-col", mobileOpen ? "flex" : "hidden lg:flex")}>
          <div className="flex items-center gap-3 border-b border-line px-4 py-3"><button onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-brand-700 lg:hidden cursor-pointer">←</button><Avatar name={c.name} size={36} /><div className="flex-1"><p className="text-sm font-bold">{c.name}</p><p className="flex items-center gap-1.5 text-xs text-slate-500"><span className="size-1.5 rounded-full bg-emerald-500" />Online</p></div><Button size="sm" variant="secondary" onClick={() => setProfile(true)}>View profile</Button></div>
          <div className="thin-scroll flex-1 space-y-3 overflow-y-auto bg-stone-50/70 p-4">{msgs.map((m, i) => <div key={i} className={cn("flex", m.from === "agent" && "justify-end")}><p className={cn("max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed", m.from === "agent" ? "rounded-br-md bg-ink-900 text-white" : "rounded-bl-md border border-line bg-white")}>{m.text}</p></div>)}</div>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-line p-3"><button type="button" aria-label="Attach" className="grid size-10 place-items-center rounded-full text-slate-500 hover:bg-stone-100 cursor-pointer"><ImagePlus className="size-5" /></button><input value={t} onChange={(e) => setT(e.target.value)} placeholder="Type a reply…" className="h-10 flex-1 rounded-full bg-stone-100 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/30" /><button type="submit" aria-label="Send" className="grid size-10 place-items-center rounded-full bg-brand-600 text-white hover:bg-brand-700 cursor-pointer"><Send className="size-4" /></button></form>
        </div>
      </div>
      <Modal open={profile} onClose={() => setProfile(false)} title="Customer profile" sub="Read-only view" width="max-w-md">
        <div className="mb-5 flex items-center gap-4"><Avatar name={c.name} size={56} /><div><p className="font-extrabold">{c.name}</p><Badge tone="success" dot>Verified customer</Badge></div></div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">{[["Phone", c.phone], ["Email", c.email], ["Orders placed", String(c.orders)], ["Total logins", String(c.logins)], ["Joined", c.joined]].map(([k, v]) => <div key={k}><dt className="text-xs font-semibold text-slate-500">{k}</dt><dd className="mt-0.5 font-bold">{v}</dd></div>)}<div className="col-span-2"><dt className="text-xs font-semibold text-slate-500">Default address</dt><dd className="mt-0.5 font-bold">{c.address}</dd></div></dl>
      </Modal>
    </>
  );
}
export const Chats = () => (<><PageHeader title="Live chats" sub="Customer conversations in real time." /><ChatsView /></>);

export function Customers() {
  const [q, setQ] = useState("");
  const rows = customers.filter((c) => (c.name + c.email + c.phone).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Customers" sub="Read-only directory of registered customers." />
      <Surface pad={false}><div className="border-b border-line p-4"><SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or phone…" className="sm:w-80" /></div>
        <Table><thead><tr><Th>Customer</Th><Th>Phone</Th><Th className="text-right">Orders</Th><Th className="text-right">Logins</Th><Th>Joined</Th></tr></thead><tbody>{rows.map((c) => <Tr key={c.email}><Td><div className="flex items-center gap-3"><Avatar name={c.name} size={34} /><div><p className="font-semibold text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.email}</p></div></div></Td><Td className="tnum">{c.phone}</Td><Td className="tnum text-right font-bold text-slate-900">{c.orders}</Td><Td className="tnum text-right">{c.logins}</Td><Td>{c.joined}</Td></Tr>)}</tbody></Table>
        {rows.length === 0 && <EmptyState title="No customers found" />}
      </Surface>
    </>
  );
}

export function System() {
  const toast = useToast();
  return (
    <>
      <PageHeader title="System" sub="Environment variables and database diagnostics." actions={<Button variant="secondary" onClick={() => toast.push("Status refreshed")}>Refresh status</Button>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Surface><h2 className="mb-4 font-extrabold">Environment</h2><ul className="divide-y divide-line">{[["ADMIN_EMAIL", true], ["ADMIN_PASSWORD", true], ["Gmail transporter", true], ["Assistant API key", true], ["Steadfast API key", false]].map(([k, ok]) => <li key={k as string} className="flex items-center justify-between py-3 text-sm"><span className="font-mono text-[13px] font-semibold">{k as string}</span><Badge tone={ok ? "success" : "warning"} dot>{ok ? "Configured" : "Missing"}</Badge></li>)}</ul></Surface>
        <Surface><div className="mb-4 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Database className="size-5" /></span><div><h2 className="font-extrabold">MongoDB Atlas</h2><p className="text-xs text-slate-500">Status: live & synced</p></div></div><Field label="Test new connection string"><Input placeholder="mongodb+srv://…" /></Field><div className="mt-4 flex gap-2"><Button onClick={() => toast.push("Connection OK")}>Test connection</Button><Button variant="danger" onClick={() => toast.push("Demo items cleared")}>Clear demo items</Button></div></Surface>
      </div>
    </>
  );
}
export { Mail, Stat };
