import { useMemo, useState } from "react";
import { AlertTriangle, Minus, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import { Badge, Button, Field, Img, Input, PageHeader, SearchInput, Select, Segmented, Stat, Surface, Table, Td, Th, Tr, Tabs, money, useToast } from "../../ui";
import { products as seed, salePrice } from "../../data";

export default function Inventory() {
  const [tab, setTab] = useState("overview");
  const [stock, setStock] = useState<Record<string, number>>(Object.fromEntries(seed.map((p) => [p.id, p.stock])));
  const [q, setQ] = useState("");
  const [lvl, setLvl] = useState("all");
  const [sku, setSku] = useState(seed[0].id);
  const toast = useToast();
  const totalUnits = Object.values(stock).reduce((a, b) => a + b, 0);
  const value = seed.reduce((a, p) => a + stock[p.id] * salePrice(p), 0);
  const low = seed.filter((p) => stock[p.id] > 0 && stock[p.id] <= 5);
  const rows = useMemo(() => seed.filter((p) => (p.name + p.sub).toLowerCase().includes(q.toLowerCase()) && (lvl === "all" || (lvl === "in" ? stock[p.id] > 0 : lvl === "low" ? stock[p.id] > 0 && stock[p.id] <= 5 : stock[p.id] === 0))), [q, lvl, stock]);
  const bump = (id: string, d: number) => setStock((s) => ({ ...s, [id]: Math.max(0, s[id] + d) }));
  const cats = [...new Set(seed.map((p) => p.category))].map((c) => ({ c, n: seed.filter((p) => p.category === c).length, u: seed.filter((p) => p.category === c).reduce((a, p) => a + stock[p.id], 0), v: seed.filter((p) => p.category === c).reduce((a, p) => a + stock[p.id] * salePrice(p), 0) }));
  const sel = seed.find((p) => p.id === sku)!;
  const moves = [["12 May", "Order KR-10482", -1, "Order"], ["11 May", "Stock received", 20, "Adjustment"], ["10 May", "Order KR-10475", -1, "Order"], ["09 May", "Return KR-10471", 1, "Return"]] as const;

  return (
    <>
      <PageHeader title="Inventory" sub="Stock levels, value and movement across the catalog." actions={<Segmented size="sm" value="30" onChange={() => {}} options={[{ value: "30", label: "30 days" }, { value: "90", label: "90 days" }]} />} />
      <Tabs className="mb-6" value={tab} onChange={setTab} tabs={[{ value: "overview", label: "Overview" }, { value: "manage", label: "Stock management" }, { value: "tracker", label: "Stock tracker" }]} />

      {tab === "overview" && (
        <div className="anim-fade space-y-6">
          <Surface pad={false} className="grid grid-cols-2 sm:grid-cols-4 [&>*]:p-5">
            <Stat label="Products" value={String(seed.length)} hint="Active in catalog" />
            <Stat label="Total stock" value={totalUnits.toLocaleString()} hint="Units on hand" />
            <Stat label="Stock value" value={money(value)} hint="Retail estimate" />
            <Stat label="Total cost" value={money(value * 0.6)} hint="Capital tied" />
          </Surface>
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <Surface pad={false}>
              <div className="border-b border-line p-5"><h2 className="font-extrabold">By category</h2></div>
              <Table><thead><tr><Th>Category</Th><Th className="text-right">SKUs</Th><Th className="text-right">Units</Th><Th className="text-right">Est. value</Th></tr></thead><tbody>{cats.map((c) => <Tr key={c.c}><Td className="font-semibold text-slate-900">{c.c}</Td><Td className="tnum text-right">{c.n}</Td><Td className="tnum text-right">{c.u}</Td><Td className="tnum text-right font-bold text-slate-900">{money(c.v)}</Td></Tr>)}</tbody></Table>
            </Surface>
            <Surface>
              <h2 className="mb-1 flex items-center gap-2 font-extrabold"><AlertTriangle className="size-4 text-amber-500" />Approaching depletion</h2>
              <p className="mb-4 text-sm text-slate-500">At or below safety threshold</p>
              {low.length === 0 ? <p className="text-sm text-slate-500">All products are above the minimum threshold.</p> : <ul className="space-y-3">{low.map((p) => <li key={p.id} className="flex items-center gap-3"><Img src={p.img} alt="" className="size-11 rounded-lg" /><span className="flex-1 truncate text-sm font-semibold">{p.name}</span><Badge tone="warning">{stock[p.id]} left</Badge></li>)}</ul>}
              {seed.filter((p) => stock[p.id] === 0).map((p) => <div key={p.id} className="mt-4 flex items-center gap-3 border-t border-line pt-4"><Img src={p.img} alt="" className="size-11 rounded-lg" /><span className="flex-1 truncate text-sm font-semibold">{p.name}</span><Badge tone="danger">Out</Badge></div>)}
            </Surface>
          </div>
        </div>
      )}

      {tab === "manage" && (
        <Surface pad={false} className="anim-fade">
          <div className="flex flex-wrap items-center gap-3 border-b border-line p-4">
            <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by SKU or product name…" className="sm:w-72" />
            <Select value={lvl} onChange={(e) => setLvl(e.target.value)} className="sm:w-48"><option value="all">All stock levels</option><option value="in">In stock</option><option value="low">Low stock (≤ 5)</option><option value="out">Out of stock</option></Select>
            <div className="ml-auto flex gap-2"><Button size="sm" variant="secondary" onClick={() => setStock((s) => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v + 10])))}>+10 to all</Button><Button size="sm" variant="secondary" onClick={() => setStock((s) => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, Math.max(0, v - 5)])))}>−5 to all</Button></div>
          </div>
          <Table><thead><tr><Th>Product</Th><Th>Category</Th><Th>Status</Th><Th className="text-right">Stock</Th><Th /></tr></thead><tbody>
            {rows.map((p) => { const n = stock[p.id]; return (
              <Tr key={p.id}><Td><div className="flex items-center gap-3"><Img src={p.img} alt="" className="size-10 rounded-lg" /><div><p className="max-w-xs truncate font-semibold text-slate-900">{p.name}</p><p className="text-xs text-slate-500">{p.id}</p></div></div></Td><Td className="text-[13px]">{p.sub}</Td>
                <Td>{n === 0 ? <Badge tone="danger" dot>Out of stock</Badge> : n <= 5 ? <Badge tone="warning" dot>Low</Badge> : <Badge tone="success" dot>In stock</Badge>}</Td>
                <Td><div className="ml-auto flex w-fit items-center rounded-lg border border-stone-300/80 bg-white"><button aria-label="Decrease" onClick={() => bump(p.id, -1)} className="grid size-8 place-items-center text-slate-500 hover:bg-stone-100 cursor-pointer"><Minus className="size-3.5" /></button><input value={n} onChange={(e) => setStock((s) => ({ ...s, [p.id]: Math.max(0, +e.target.value || 0) }))} className={cn("tnum h-8 w-12 text-center text-sm font-bold outline-none", n === 0 && "text-rose-600")} /><button aria-label="Increase" onClick={() => bump(p.id, 1)} className="grid size-8 place-items-center text-slate-500 hover:bg-stone-100 cursor-pointer"><Plus className="size-3.5" /></button></div></Td>
                <Td className="text-right"><Button size="sm" variant="ghost" onClick={() => toast.push("Stock saved")}>Save</Button></Td></Tr>); })}
          </tbody></Table>
        </Surface>
      )}

      {tab === "tracker" && (
        <div className="anim-fade space-y-6">
          <div className="flex flex-wrap items-end gap-4"><Field label="Product SKU" className="w-full sm:w-80"><Select value={sku} onChange={(e) => setSku(e.target.value)}>{seed.map((p) => <option key={p.id} value={p.id}>{p.name.slice(0, 48)}</option>)}</Select></Field><Field label="Date range" className="w-48"><Select><option>Last 7 days</option><option>Last 30 days</option><option>Lifetime</option></Select></Field><Button variant="secondary" className="ml-auto" onClick={() => toast.push("Exported CSV")}>Export tracker</Button></div>
          <Surface pad={false} className="grid grid-cols-2 sm:grid-cols-5 [&>*]:p-5"><Stat label="Initial" value="50" /><Stat label="Orders (−)" value="−32" /><Stat label="Returned (+)" value="+3" /><Stat label="Adjustments" value="+9" /><Stat label="On hand now" value={String(stock[sel.id])} /></Surface>
          <Surface pad={false}><Table><thead><tr><Th>Date</Th><Th>Reason</Th><Th>Source</Th><Th className="text-right">Change</Th></tr></thead><tbody>{moves.map((m, i) => <Tr key={i}><Td>{m[0]}</Td><Td className="font-semibold text-slate-900">{m[1]}</Td><Td><Badge>{m[3]}</Badge></Td><Td className={cn("tnum text-right font-extrabold", m[2] < 0 ? "text-rose-600" : "text-emerald-600")}>{m[2] > 0 ? "+" : ""}{m[2]}</Td></Tr>)}</tbody></Table></Surface>
        </div>
      )}
    </>
  );
}
export { Input };
