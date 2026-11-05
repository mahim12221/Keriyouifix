import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, RotateCcw, Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { Popover } from "../ui";
import { pages } from "../data/pages";

/** Evaluation helper — jump to any redesigned page. Not part of the product UI. */
export function DemoDock() {
  const { pathname } = useLocation();
  const [q, setQ] = useState("");
  const inPanel = pathname.startsWith("/admin/") || pathname.startsWith("/staff/");
  const groups = useMemo(() => {
    const f = pages.filter((p) => (p.name + p.to + p.group).toLowerCase().includes(q.toLowerCase()));
    return [...new Set(f.map((p) => p.group))].map((g) => ({ g, items: f.filter((p) => p.group === g) }));
  }, [q]);
  return (
    <div className={cn("no-print fixed left-4 z-[70] sm:left-6", pathname.startsWith("/product/") ? "bottom-24 lg:bottom-5" : "bottom-5", inPanel && "lg:left-[272px]")}>
      <Popover
        align="left"
        up
        width="w-[320px] max-w-[calc(100vw-2rem)]"
        trigger={(_, t) => (
          <button onClick={t} className="flex h-11 items-center gap-2 rounded-full bg-white pl-3.5 pr-4 text-sm font-bold text-slate-900 shadow-lift ring-1 ring-line transition-all hover:shadow-pop active:scale-95 cursor-pointer">
            <Compass className="size-[18px] text-brand-700" />
            <span className="hidden sm:inline">Demo pages</span>
          </button>
        )}
      >
        {(close) => (
          <div className="flex max-h-[min(70dvh,560px)] flex-col" style={{ transformOrigin: "bottom left" }}>
            <div className="border-b border-line p-3">
              <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a page…" className="h-9 w-full rounded-lg bg-stone-100 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand-500/30" /></div>
            </div>
            <div className="thin-scroll flex-1 overflow-y-auto p-2">
              {groups.map(({ g, items }) => (
                <div key={g} className="mb-2">
                  <p className="px-2.5 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{g}</p>
                  {items.map((p) => (
                    <Link key={p.to + p.name} to={p.to} onClick={() => { close(); setQ(""); }} className={cn("block rounded-lg px-2.5 py-1.5 text-[13px] font-semibold transition-colors", pathname === p.to ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-stone-100")}>{p.name}</Link>
                  ))}
                </div>
              ))}
            </div>
            <button onClick={() => { sessionStorage.removeItem("k-splash"); window.location.hash = "#/"; window.location.reload(); }} className="flex items-center gap-2 border-t border-line px-4 py-3 text-[13px] font-bold text-slate-600 hover:bg-stone-50 cursor-pointer"><RotateCcw className="size-4" />Replay splash intro</button>
          </div>
        )}
      </Popover>
    </div>
  );
}
