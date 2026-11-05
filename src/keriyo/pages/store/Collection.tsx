import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, PackageSearch } from "lucide-react";
import { Button, Checkbox, Container, Drawer, EmptyState, Select, Skeleton } from "../../ui";
import { categories, products, salePrice } from "../../data";
import { ProductCard } from "./ProductCard";
import { cn } from "@/utils/cn";
import { useEffect } from "react";

export default function Collection() {
  const [sp, setSp] = useSearchParams();
  const cat = sp.get("cat") ?? "";
  const sub = sp.get("sub") ?? "";
  const [sort, setSort] = useState("featured");
  const [inStock, setInStock] = useState(false);
  const [filters, setFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [cat, sub]);

  const list = useMemo(() => {
    let l = products.filter((p) => (!cat || p.category === cat) && (!sub || p.sub === sub) && (!inStock || p.stock > 0));
    if (sort === "low") l = [...l].sort((a, b) => salePrice(a) - salePrice(b));
    if (sort === "high") l = [...l].sort((a, b) => salePrice(b) - salePrice(a));
    if (sort === "new") l = [...l].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return l;
  }, [cat, sub, sort, inStock]);

  const set = (c: string, s = "") => {
    const n = new URLSearchParams();
    if (c) n.set("cat", c);
    if (s) n.set("sub", s);
    setSp(n);
  };

  const Rail = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Categories</h3>
        <ul className="space-y-0.5">
          <li><RailBtn active={!cat} onClick={() => set("")}>All products</RailBtn></li>
          {categories.map((c) => (
            <li key={c.name}>
              <RailBtn active={cat === c.name && !sub} onClick={() => set(c.name)}>{c.name}</RailBtn>
              {cat === c.name && c.children && (
                <ul className="anim-fade ml-3 mt-0.5 space-y-0.5 border-l border-line pl-2">
                  {c.children.map((s) => (
                    <li key={s.name}><RailBtn active={sub === s.name} onClick={() => set(c.name, s.name)} small>{s.name}</RailBtn></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Availability</h3>
        <Checkbox checked={inStock} onChange={setInStock} label="In stock only" />
      </div>
    </div>
  );

  return (
    <Container className="pb-8 pt-24 sm:pt-28">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">Collection</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{sub || cat || "All products"}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{list.length} {list.length === 1 ? "product" : "products"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="lg:hidden" onClick={() => setFilters(true)}><SlidersHorizontal className="size-4" />Filters</Button>
          <Select value={sort} onChange={(e) => setSort(e.target.value)} className="w-52" aria-label="Sort">
            <option value="featured">Featured</option>
            <option value="new">Newest arrivals</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
          </Select>
        </div>
      </div>

      {(cat || inStock) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {cat && <Pill onClick={() => set("")}>{cat}</Pill>}
          {sub && <Pill onClick={() => set(cat)}>{sub}</Pill>}
          {inStock && <Pill onClick={() => setInStock(false)}>In stock</Pill>}
          <button onClick={() => (set(""), setInStock(false))} className="ml-1 text-sm font-semibold text-brand-700 cursor-pointer">Clear all</button>
        </div>
      )}

      <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24">{Rail}</div></aside>
        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}><Skeleton className="aspect-square rounded-2xl" /><Skeleton className="mt-4 h-3 w-1/3" /><Skeleton className="mt-2 h-4 w-4/5" /><Skeleton className="mt-3 h-4 w-1/4" /></div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <EmptyState icon={<PackageSearch className="size-6" />} title="No gadgets match your filters" sub="Try a different category or clear your filters." action={<Button onClick={() => (set(""), setInStock(false))}>Reset filters</Button>} />
          ) : (
            <div className="anim-fade grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 md:grid-cols-3">
              {list.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>

      <Drawer open={filters} onClose={() => setFilters(false)} title="Filters" side="left" width="max-w-[320px]" footer={<Button full onClick={() => setFilters(false)}>Show {list.length} products</Button>}>
        <div className="p-5">{Rail}</div>
      </Drawer>
    </Container>
  );
}
const RailBtn = ({ active, onClick, children, small }: { active?: boolean; onClick: () => void; children: React.ReactNode; small?: boolean }) => (
  <button onClick={onClick} className={cn("w-full rounded-lg px-3 py-2 text-left font-semibold transition-colors cursor-pointer", small ? "text-[13px]" : "text-sm", active ? "bg-ink-900 text-white" : "text-slate-600 hover:bg-stone-100 hover:text-slate-900")}>{children}</button>
);
const Pill = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button onClick={onClick} className="group inline-flex h-8 items-center gap-1.5 rounded-full bg-stone-200/70 pl-3.5 pr-2.5 text-[13px] font-semibold text-slate-700 hover:bg-stone-200 cursor-pointer">{children}<X className="size-3.5 text-slate-500" /></button>
);
