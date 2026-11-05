import { useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Checkbox, Field, Img, Input, Modal, PageHeader, SearchInput, Select, Surface, Table, Tabs, Td, Textarea, Th, Tr, money, useToast, Switch } from "../../ui";
import { categories, products, salePrice, type Product } from "../../data";

export default function Products() {
  const [tab, setTab] = useState("catalog");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Product | "new" | null>(null);
  const [upsell, setUpsell] = useState(false);
  const toast = useToast();
  const rows = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const p = edit && edit !== "new" ? edit : null;
  return (
    <>
      <PageHeader title="Products" sub="Manage the catalog and the upsell offers shown across the storefront." actions={tab === "catalog" ? <Button onClick={() => setEdit("new")}><Plus className="size-4" />Add product</Button> : <Button onClick={() => setUpsell(true)}><Plus className="size-4" />Create upsell</Button>} />
      <Tabs className="mb-6" value={tab} onChange={setTab} tabs={[{ value: "catalog", label: "Catalog", count: products.length }, { value: "upsell", label: "Upsell products", count: 2 }]} />

      {tab === "catalog" ? (
        <Surface pad={false} className="anim-fade">
          <div className="border-b border-line p-4"><SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by title or category…" className="sm:w-80" /></div>
          <Table><thead><tr><Th>Product</Th><Th>Category</Th><Th className="text-right">Price</Th><Th className="text-right">Stock</Th><Th>Visibility</Th><Th /></tr></thead><tbody>
            {rows.map((x) => (
              <Tr key={x.id} onClick={() => setEdit(x)}>
                <Td><div className="flex items-center gap-3"><Img src={x.img} alt="" className="size-11 rounded-lg" /><div className="min-w-0"><p className="max-w-sm truncate font-semibold text-slate-900">{x.name}</p><div className="mt-0.5 flex gap-1.5">{x.best && <Badge tone="brand">Bestseller</Badge>}{x.isNew && <Badge>New</Badge>}</div></div></div></Td>
                <Td className="text-[13px]">{x.category}<span className="block text-xs text-slate-400">{x.sub}</span></Td>
                <Td className="tnum text-right"><b className="text-slate-900">{money(salePrice(x))}</b>{x.discount > 0 && <span className="block text-xs text-slate-400 line-through">{money(x.price)}</span>}</Td>
                <Td className="tnum text-right">{x.stock === 0 ? <Badge tone="danger">Out</Badge> : x.stock}</Td>
                <Td><Badge tone="success" dot>Live</Badge></Td>
                <Td className="text-right"><Button size="sm" variant="ghost"><Pencil className="size-3.5" />Edit</Button></Td>
              </Tr>
            ))}
          </tbody></Table>
        </Surface>
      ) : (
        <Surface pad={false} className="anim-fade"><Table><thead><tr><Th>Upsell product</Th><Th>Shows on</Th><Th>Tags</Th><Th /></tr></thead><tbody>
          {[[products[4], ["Checkout summary", "Cart drawer"], "iPhone, Checkout"], [products[6], ["Product detail"], "Samsung, Charger"]].map(([x, where, tags]) => { const pr = x as Product; return (
            <Tr key={pr.id}><Td><div className="flex items-center gap-3"><Img src={pr.img} alt="" className="size-11 rounded-lg" /><span className="font-semibold text-slate-900">{pr.name}</span></div></Td><Td><div className="flex flex-wrap gap-1.5">{(where as string[]).map((w) => <Badge key={w} tone="info">{w}</Badge>)}</div></Td><Td className="text-[13px]">{tags as string}</Td><Td className="text-right"><Button size="sm" variant="ghost">Edit</Button><Button size="sm" variant="ghost" className="text-rose-600"><Trash2 className="size-3.5" /></Button></Td></Tr>); })}
        </tbody></Table></Surface>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title={p ? "Edit product" : "Add product"} width="max-w-2xl" footer={<><Button variant="ghost" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={() => (setEdit(null), toast.push(p ? "Product updated" : "Product added"))}>{p ? "Save changes" : "Add product"}</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name" className="sm:col-span-2"><Input defaultValue={p?.name} placeholder="e.g. Keriyo Air Buds Pro" /></Field>
          <Field label="Price (৳)"><Input defaultValue={p?.price} inputMode="numeric" /></Field>
          <Field label="Discount (%)"><Input defaultValue={p?.discount ?? 0} inputMode="numeric" /></Field>
          <Field label="Category"><Select defaultValue={p?.category}>{categories.map((c) => <option key={c.name}>{c.name}</option>)}</Select></Field>
          <Field label="Sub-category"><Select defaultValue={p?.sub}>{categories.flatMap((c) => c.children ?? []).map((c) => <option key={c.name}>{c.name}</option>)}</Select></Field>
          <Field label="Stock"><Input defaultValue={p?.stock ?? 0} inputMode="numeric" /></Field>
          <Field label="Low-stock threshold"><Input defaultValue={5} inputMode="numeric" /></Field>
          <Field label="Description" className="sm:col-span-2"><Textarea defaultValue={p?.blurb} className="min-h-28" /></Field>
          <div className="sm:col-span-2"><p className="mb-1.5 text-[13px] font-semibold text-slate-700">Images</p>
            <div className="flex flex-wrap gap-3">{p && <Img src={p.img} alt="" className="size-20 rounded-xl" />}<button className="grid size-20 place-items-center rounded-xl border-2 border-dashed border-stone-300 text-slate-400 transition-colors hover:border-brand-500 hover:text-brand-700 cursor-pointer"><ImagePlus className="size-5" /></button></div></div>
          <div className="flex items-center gap-8 sm:col-span-2"><label className="flex items-center gap-3 text-sm font-semibold"><Switch checked={!!p?.best} onChange={() => {}} />Bestseller</label><Checkbox checked onChange={() => {}} label="Visible on storefront" /></div>
        </div>
      </Modal>
      <Modal open={upsell} onClose={() => setUpsell(false)} title="Create upsell" footer={<><Button variant="ghost" onClick={() => setUpsell(false)}>Cancel</Button><Button onClick={() => (setUpsell(false), toast.push("Upsell saved"))}>Save upsell</Button></>}>
        <div className="space-y-4"><Field label="Select upsell product"><Select>{products.map((x) => <option key={x.id}>{x.name.slice(0, 50)}</option>)}</Select></Field>
          <div><p className="mb-2 text-[13px] font-semibold text-slate-700">Show on storefront</p><div className="space-y-2.5"><Checkbox checked onChange={() => {}} label="Category & collection pages" /><Checkbox checked={false} onChange={() => {}} label="Product detail / add-to-cart drawer" /><Checkbox checked onChange={() => {}} label="Checkout order summary" /></div></div>
          <Field label="Target tags" hint="Comma separated"><Input placeholder="Checkout, Samsung, iPhone…" /></Field></div>
      </Modal>
    </>
  );
}
