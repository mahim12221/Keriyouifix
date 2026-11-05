import { useState } from "react";
import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { Badge, Button, Chip, Field, Input, Modal, PageHeader, SearchInput, Select, Stat, StatusBadge, Surface, Switch, Table, Tabs, Td, Textarea, Th, Tr, money, useToast } from "../../ui";
import { Progress } from "../../ui/charts";
import { abandoned, smsLogs } from "../../data";

export function Abandoned() {
  const [q, setQ] = useState("");
  const [offer, setOffer] = useState<(typeof abandoned)[number] | null>(null);
  const toast = useToast();
  const rows = abandoned.filter((a) => (a.name + a.phone).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Abandoned carts" sub="Track customers who left without ordering and win the sale back with a timely offer." />
      <Surface pad={false} className="grid grid-cols-2 sm:grid-cols-4 [&>*]:p-5"><Stat label="Total leads" value="4" hint="Drop-off customers" /><Stat label="Abandoned revenue" value={money(13434)} hint="Potential lost sales" /><Stat label="Recovered value" value={money(4200)} /><Stat label="Recovery rate" value="25%" delta="+4%" /></Surface>
      <div className="my-5"><SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search phone or customer…" className="sm:w-80" /></div>
      <Surface pad={false}><Table><thead><tr><Th>Customer</Th><Th>Cart</Th><Th className="text-right">Value</Th><Th>Last activity</Th><Th>Status</Th><Th /></tr></thead><tbody>
        {rows.map((a) => <Tr key={a.phone}><Td><p className="font-semibold text-slate-900">{a.name}</p><p className="tnum text-xs text-slate-500">{a.phone}</p></Td><Td className="text-[13px]">{a.items}</Td><Td className="tnum text-right font-bold text-slate-900">{money(a.value)}</Td><Td className="text-[13px]">{a.last}</Td><Td><StatusBadge status={a.status} /></Td><Td className="text-right"><div className="flex justify-end gap-1.5"><Button size="sm" variant="secondary"><Phone className="size-3.5" />Call</Button><Button size="sm" onClick={() => setOffer(a)}>Send offer</Button></div></Td></Tr>)}
      </tbody></Table></Surface>
      <Modal open={!!offer} onClose={() => setOffer(null)} title="Send recovery offer SMS" sub={offer?.name} footer={<><Button variant="ghost" onClick={() => setOffer(null)}>Cancel</Button><Button onClick={() => (setOffer(null), toast.push("SMS sent"))}><Send className="size-4" />Send SMS</Button></>}>
        <div className="space-y-4"><Field label="Discount offer"><Select><option>5% off</option><option>10% off</option><option>Free delivery</option></Select></Field><Field label="SMS message" hint="Delivered through your Bangladeshi SMS gateway."><Textarea defaultValue="Still thinking? Complete your Keriyo order today and enjoy 5% off. Reply or call 01880172859." /></Field></div>
      </Modal>
    </>
  );
}

export function Sms() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(true);
  const toast = useToast();
  return (
    <>
      <PageHeader title="SMS center" sub="Automatic order and tracking messages, plus one-off custom SMS." actions={<Badge tone="success" dot>Active</Badge>} />
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Surface className="space-y-5">
          <h2 className="font-extrabold">Automation</h2>
          {[["Order placed SMS", "Sent instantly when an order is received", a, setA], ["Steadfast tracking SMS", "Sent with a tracking link on courier handover", b, setB]].map(([t, d, v, s]) => <div key={t as string} className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold">{t as string}</p><p className="text-xs text-slate-500">{d as string}</p></div><Switch checked={v as boolean} onChange={s as (v: boolean) => void} /></div>)}
          <Field label="Order placed template" hint="{customerName}, {orderId}, {amount}"><Textarea defaultValue="Hi {customerName}, your Keriyo order {orderId} ({amount}) is received." /></Field>
          <Field label="Tracking template" hint="{trackingCode}, {trackingUrl}"><Textarea defaultValue="Your parcel is with Steadfast. Track: {trackingCode} {trackingUrl}" /></Field>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Gateway"><Select><option>Keriyo Smart Gateway (simulator)</option><option>Greenweb BD</option><option>BulkSMS BD</option><option>ElitBuzz BD</option></Select></Field><Field label="Sender ID"><Input placeholder="KERIYO" /></Field></div>
          <Button onClick={() => toast.push("SMS settings saved")}>Save settings</Button>
        </Surface>
        <Surface>
          <h2 className="mb-4 flex items-center gap-2 font-extrabold"><MessageSquare className="size-4" />Send custom SMS</h2>
          <div className="space-y-4"><Field label="Mobile number"><Input placeholder="01XXXXXXXXX" /></Field><Field label="Message"><Textarea placeholder="Write your message…" className="min-h-28" /></Field><Button onClick={() => toast.push("SMS sent")}><Send className="size-4" />Send SMS</Button></div>
        </Surface>
      </div>
      <h2 className="mb-3 mt-10 font-extrabold">Sent SMS logs</h2>
      <Surface pad={false}><Table><thead><tr><Th>Time</Th><Th>Recipient</Th><Th>Type</Th><Th>Message</Th><Th>Status</Th></tr></thead><tbody>
        {smsLogs.map((l, i) => <Tr key={i}><Td className="whitespace-nowrap text-[13px]">{l.time}</Td><Td><p className="font-semibold text-slate-900">{l.to}</p><p className="tnum text-xs text-slate-500">{l.phone}</p></Td><Td><Badge>{l.type}</Badge></Td><Td className="max-w-xs truncate text-[13px]">{l.msg}</Td><Td><Badge tone={l.status === "Failed" ? "danger" : "success"} dot>{l.status}</Badge></Td></Tr>)}
      </tbody></Table></Surface>
    </>
  );
}

export function Email() {
  const [tab, setTab] = useState("settings");
  const toast = useToast();
  return (
    <>
      <PageHeader title="Email" sub="Sender configuration, automatic triggers and test delivery." />
      <Tabs className="mb-6" value={tab} onChange={setTab} tabs={[{ value: "settings", label: "Sender & server" }, { value: "test", label: "Send test" }, { value: "logs", label: "Logs" }]} />
      <div className="anim-fade" key={tab}>
        {tab === "settings" && <Surface className="max-w-2xl"><div className="grid gap-4 sm:grid-cols-2"><Field label="Sender name"><Input defaultValue="Keriyo" /></Field><Field label="Support email (From)"><Input defaultValue="support.keriyo@gmail.com" /></Field><Field label="SMTP host"><Input defaultValue="smtp.gmail.com" /></Field><Field label="Mode"><Select><option>Port 465 (SSL encrypted)</option><option>Port 587 (TLS)</option></Select></Field></div><p className="mt-5 text-sm text-slate-500">Automatic triggers: <span className="font-semibold text-slate-800">Order placed · Dispatched · OTP · Password reset · Welcome</span></p><Button className="mt-5" onClick={() => toast.push("Email settings saved")}>Save settings</Button></Surface>}
        {tab === "test" && <Surface className="max-w-xl space-y-4"><Field label="Recipient email"><Input type="email" placeholder="you@example.com" /></Field><Field label="Test message (optional)"><Textarea /></Field><Button onClick={() => toast.push("Test email sent")}><Mail className="size-4" />Send test email</Button></Surface>}
        {tab === "logs" && <Surface pad={false}><Table><thead><tr><Th>Time</Th><Th>Recipient</Th><Th>Type</Th><Th>Subject</Th><Th>Status</Th></tr></thead><tbody>{[["11:42 AM", "tanvir@example.com", "Order placed", "Your Keriyo order KR-10482", "Sent"], ["10:31 AM", "sadia@example.com", "Dispatched", "Your parcel is on the way", "Sent"], ["Yesterday", "nusrat@example.com", "OTP", "Your verification code", "Sent"]].map((r) => <Tr key={r[3]}><Td className="text-[13px]">{r[0]}</Td><Td>{r[1]}</Td><Td><Badge>{r[2]}</Badge></Td><Td className="text-[13px]">{r[3]}</Td><Td><StatusBadge status={r[4]} /></Td></Tr>)}</tbody></Table></Surface>}
      </div>
    </>
  );
}
export { Chip, Progress };
