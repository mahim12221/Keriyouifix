import { useState } from "react";
import { AlertTriangle, ArrowUpRight, Package, ShoppingBag, Users, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Img, PageHeader, Segmented, Stat, Surface, money } from "../../ui";
import { AreaChart, BarChart, Donut, Heatmap, Progress } from "../../ui/charts";
import { days30, getProduct, hourly, products, regions, revenue30 } from "../../data";

const pipeline = [["Order placed", 18, "#a8a29e"], ["Confirmed", 24, "#38bdf8"], ["Packaging", 14, "#8b5cf6"], ["In courier", 31, "#f59e0b"], ["Delivered", 212, "#10b981"], ["Cancelled / returned", 19, "#f43f5e"]] as const;

export default function Dashboard() {
  const [range, setRange] = useState("30D");
  const [metric, setMetric] = useState<"rev" | "ord">("rev");
  const data = revenue30.slice(range === "7D" ? -7 : range === "14D" ? -14 : 0);
  const labels = days30.slice(range === "7D" ? -7 : range === "14D" ? -14 : 0);
  const series = metric === "rev" ? data : data.map((v) => Math.round(v / 2150));
  const total = pipeline.reduce((a, p) => a + p[1], 0);
  const top = [...products].filter((p) => p.stock >= 0).slice(0, 5);

  return (
    <>
      <PageHeader title="Dashboard" sub="Real-time analytics for orders, inventory velocity, courier success and financial health." actions={<Segmented size="sm" value={range} onChange={setRange} options={["7D", "14D", "30D", "90D", "12M"].map((v) => ({ value: v, label: v }))} />} />

      <Surface pad={false} className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x [&>*]:p-5 [&>*:nth-child(-n+2)]:border-b sm:[&>*]:border-b-0 [&>*:nth-child(odd)]:border-r sm:[&>*:nth-child(odd)]:border-r-0 border-line">
        <Stat icon={<ShoppingBag className="size-4" />} label="Today's orders" value="24" delta="+12%" hint="vs yesterday" />
        <Stat icon={<Wallet className="size-4" />} label="Total sales" value={money(98450)} delta="+8.4%" hint="Delivered + in transit" />
        <Stat icon={<Package className="size-4" />} label="Units sold" value="318" delta="+5%" hint="Across 9 SKUs" />
        <Stat icon={<Users className="size-4" />} label="Customers" value="1,284" delta="+3.1%" hint="Verified phones" />
      </Surface>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <Surface>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-extrabold">Activity timeline</h2><p className="text-sm text-slate-500">Sales velocity and order volume</p></div>
            <Segmented size="sm" value={metric} onChange={setMetric} options={[{ value: "rev", label: "৳ Revenue" }, { value: "ord", label: "Orders" }]} />
          </div>
          <AreaChart key={range + metric} data={series} labels={labels} height={240} format={(n) => (metric === "rev" ? money(n) : `${n} orders`)} />
        </Surface>
        <Surface>
          <h2 className="font-extrabold">Order health</h2>
          <p className="text-sm text-slate-500">Genuine vs cancelled / fraud</p>
          <div className="mt-5 flex items-center gap-5"><Donut size={132} parts={[{ label: "Genuine", value: 93, color: "#10b981" }, { label: "Cancelled", value: 5, color: "#f43f5e" }, { label: "Fraud", value: 2, color: "#f59e0b" }]} center={{ big: "93", small: "Health score" }} />
            <ul className="space-y-2.5 text-sm">{[["Genuine", "93%", "bg-emerald-500"], ["Cancelled", "5%", "bg-rose-500"], ["Fraud / fake", "2%", "bg-amber-500"]].map(([l, v, c]) => (<li key={l} className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${c}`} /><span className="text-slate-600">{l}</span><b className="ml-auto pl-3">{v}</b></li>))}</ul>
          </div>
          <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-amber-50 p-3 text-[13px] text-amber-900"><AlertTriangle className="mt-0.5 size-4 shrink-0" />3 COD orders from Cumilla have a delivery success rate under 50%.</div>
        </Surface>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Surface>
          <div className="mb-4 flex items-center justify-between"><h2 className="font-extrabold">Top selling products</h2><Link to="/admin/inventory" className="inline-flex items-center gap-1 text-sm font-bold text-brand-700">Inventory <ArrowUpRight className="size-4" /></Link></div>
          <ul className="space-y-4">{top.map((p, i) => (<li key={p.id} className="flex items-center gap-3"><Img src={p.img} alt="" className="size-11 rounded-lg" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3 text-sm"><span className="truncate font-semibold">{p.name}</span><span className="tnum shrink-0 font-bold">{[84, 66, 51, 38, 29][i]} sold</span></div><div className="mt-1.5"><Progress value={[100, 78, 61, 45, 34][i]} /></div></div></li>))}</ul>
        </Surface>
        <Surface>
          <h2 className="mb-1 font-extrabold">Status pipeline</h2><p className="mb-5 text-sm text-slate-500">Live distribution across {total} orders</p>
          <div className="flex h-3 overflow-hidden rounded-full">{pipeline.map(([l, n, c]) => <div key={l} title={`${l}: ${n}`} style={{ width: `${(n / total) * 100}%`, background: c }} className="transition-all hover:opacity-80" />)}</div>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">{pipeline.map(([l, n, c]) => (<li key={l} className="flex items-center gap-2"><span className="size-2.5 rounded-full" style={{ background: c }} /><span className="text-slate-600">{l}</span><b className="tnum ml-auto">{n}</b></li>))}</ul>
        </Surface>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Surface>
          <h2 className="font-extrabold">Regional distribution</h2><p className="mb-5 text-sm text-slate-500">Extracted from order addresses</p>
          <ul className="space-y-3.5">{regions.map((r) => (<li key={r.name}><div className="mb-1.5 flex justify-between text-sm"><span className="font-semibold">{r.name}</span><span className="tnum text-slate-500">{r.n} · {r.pct}%</span></div><Progress value={r.pct * 2} /></li>))}</ul>
        </Surface>
        <Surface>
          <div className="mb-4 flex items-center justify-between"><div><h2 className="font-extrabold">24-hour order trend</h2><p className="text-sm text-slate-500">Peak at 7 PM</p></div><Badge tone="brand">Live</Badge></div>
          <BarChart data={hourly} labels={hourly.map((_, i) => (i % 6 === 0 ? (i === 0 ? "12a" : i === 12 ? "12p" : i < 12 ? `${i}a` : `${i - 12}p`) : ""))} height={160} highlight={19} />
        </Surface>
      </div>

      <Surface className="mt-6">
        <div className="mb-4 flex items-end justify-between"><div><h2 className="font-extrabold">Annual sales intensity</h2><p className="text-sm text-slate-500">Rolling recorded store sales</p></div><div className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">Less {["bg-stone-100", "bg-brand-100", "bg-brand-300", "bg-brand-500", "bg-brand-700"].map((c) => <span key={c} className={`size-3 rounded-[3px] ${c}`} />)} More</div></div>
        <Heatmap weeks={36} />
      </Surface>
    </>
  );
}
export { getProduct };
