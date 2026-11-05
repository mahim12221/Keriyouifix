import { useState } from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Badge, Button, Input, PageHeader, Surface, useToast } from "../../ui";
import { categories, type Cat } from "../../data";

const clone = (c: Cat[]): Cat[] => c.map((x) => ({ name: x.name, children: x.children ? clone(x.children) : undefined }));

function Node({ c, level, onAdd, onRemove }: { c: Cat; level: number; onAdd: (c: Cat, n: string) => void; onRemove: (c: Cat) => void }) {
  const [open, setOpen] = useState(level === 1);
  const [v, setV] = useState("");
  return (
    <li>
      <div className="group flex items-center gap-2 rounded-lg py-1.5 pr-2 hover:bg-stone-50" style={{ paddingLeft: (level - 1) * 22 + 6 }}>
        <button onClick={() => setOpen((o) => !o)} aria-label="Toggle" className="grid size-6 place-items-center rounded text-slate-400 hover:bg-stone-200/60 cursor-pointer"><ChevronRight className={cn("size-4 transition-transform duration-200", open && "rotate-90", !c.children?.length && level === 4 && "opacity-0")} /></button>
        <span className="text-sm font-semibold">{c.name}</span>
        <Badge className="ml-1">Level {level}</Badge>
        <button onClick={() => onRemove(c)} aria-label="Remove" className="ml-auto text-slate-300 opacity-0 transition-opacity hover:text-rose-600 group-hover:opacity-100 cursor-pointer"><Trash2 className="size-4" /></button>
      </div>
      {open && level < 4 && (
        <div className="anim-fade">
          <ul>{c.children?.map((k) => <Node key={k.name} c={k} level={level + 1} onAdd={onAdd} onRemove={onRemove} />)}</ul>
          <form onSubmit={(e) => { e.preventDefault(); if (v.trim()) { onAdd(c, v.trim()); setV(""); } }} className="flex gap-2 py-1.5" style={{ paddingLeft: level * 22 + 6 }}>
            <Input value={v} onChange={(e) => setV(e.target.value)} placeholder={`Add level ${level + 1} under “${c.name}”…`} className="h-8 max-w-xs text-[13px]" />
            <Button type="submit" size="sm" variant="secondary"><Plus className="size-3.5" />Add</Button>
          </form>
        </div>
      )}
    </li>
  );
}

export default function Categories() {
  const [tree, setTree] = useState<Cat[]>(() => clone(categories));
  const [main, setMain] = useState("");
  const toast = useToast();
  const upd = () => setTree((t) => [...t]);
  return (
    <>
      <PageHeader title="Navigation & categories" sub="Build clean hover-dropdown trees, e.g. Phone Covers → iPhone → iPhone 17 → Pro. Changes sync to the storefront menu instantly." />
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <Surface>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Active categories tree</h2>
          {tree.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">No menu items yet. Add a level 1 menu to get started.</p> : <ul>{tree.map((c) => <Node key={c.name} c={c} level={1} onAdd={(p, n) => { (p.children ??= []).push({ name: n }); upd(); toast.push("Category added"); }} onRemove={(c) => { const rm = (a: Cat[]): Cat[] => a.filter((x) => x !== c).map((x) => ({ ...x, children: x.children ? rm(x.children) : undefined })); setTree((t) => rm(t)); }} />)}</ul>}
        </Surface>
        <Surface className="lg:sticky lg:top-20">
          <h2 className="font-extrabold">Add main menu</h2><p className="mb-4 mt-1 text-sm text-slate-500">Level 1 item in the navbar.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (main.trim()) { setTree((t) => [...t, { name: main.trim() }]); setMain(""); toast.push("Main menu added"); } }} className="space-y-3"><Input value={main} onChange={(e) => setMain(e.target.value)} placeholder="e.g. Fidget Toys, Gadgets…" /><Button type="submit" full><Plus className="size-4" />Add main menu</Button></form>
        </Surface>
      </div>
    </>
  );
}
