import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, ChevronLeft, ChevronRight, RefreshCcw, Star, Truck, Wallet, X, ZoomIn } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar, Badge, Button, Container, EmptyState, Img, Rating, Reveal, Tabs, Textarea, money, useToast } from "../../ui";
import { Progress } from "../../ui/charts";
import { getProduct, products, salePrice } from "../../data";
import { useCart } from "../../store/cart";
import { Qty } from "../../layout/StoreLayout";
import { ProductCard } from "./ProductCard";

// Gallery "shots" — demo crops of the product image; production uses product.images[]
const crops = ["", "scale-[1.6] origin-[30%_40%]", "scale-[1.9] origin-[75%_65%]", "-scale-x-100"];

const reviews = [
  { n: "Sadia Rahman", r: 5, t: "Build quality is excellent. Arrived in two days with proper packaging.", d: "2 weeks ago" },
  { n: "Arif Chowdhury", r: 5, t: "The tactile feel is incredible and it's genuinely quiet. Worth it.", d: "1 month ago" },
  { n: "Mehedi Hasan", r: 4, t: "Great product. Colour is slightly different from the photos but I love it.", d: "1 month ago" },
];

export default function Product() {
  const { id } = useParams();
  const p = getProduct(id);
  const navigate = useNavigate();
  const { add } = useCart();
  const toast = useToast();
  const [shot, setShot] = useState(0);
  const [light, setLight] = useState(false);
  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("desc");
  const [stars, setStars] = useState(5);
  useEffect(() => {
    setShot(0);
    setQty(1);
    setColor(0);
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!p)
    return (
      <Container className="pt-40"><EmptyState title="Product not found" sub="The product you're looking for might have been moved or updated in our catalog." action={<Link to="/collection"><Button>Explore catalog</Button></Link>} /></Container>
    );
  const sold = p.stock === 0;
  const low = p.stock > 0 && p.stock <= 5;
  const related = products.filter((x) => x.id !== p.id && (x.category === p.category || x.best)).slice(0, 4);

  return (
    <>
      <Container className="pb-8 pt-24 sm:pt-28">
        <nav className="mb-6 flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
          <Link to="/" className="hover:text-slate-900">Home</Link><ChevronRight className="size-3.5" />
          <Link to={`/collection?cat=${encodeURIComponent(p.category)}`} className="hover:text-slate-900">{p.category}</Link><ChevronRight className="size-3.5" />
          <span className="truncate text-slate-900">{p.sub}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <button onClick={() => setLight(true)} className="group relative block w-full cursor-zoom-in overflow-hidden rounded-3xl bg-tile">
              <div className="aspect-square">
                <Img key={shot} src={p.img} alt={p.name} className="anim-fade size-full" imgClass={cn("p-4 transition-transform duration-700", crops[shot])} />
              </div>
              <span className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 opacity-0 shadow-lift backdrop-blur transition-opacity group-hover:opacity-100"><ZoomIn className="size-[18px]" /></span>
            </button>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {crops.map((c, i) => (
                <button key={i} onClick={() => setShot(i)} aria-label={`Photo ${i + 1}`} className={cn("overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-page transition-all cursor-pointer", shot === i ? "ring-ink-900" : "ring-transparent opacity-70 hover:opacity-100")}>
                  <div className="aspect-square overflow-hidden bg-tile"><Img src={p.img} alt="" className="size-full" imgClass={cn("p-2", c)} /></div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to={`/collection?cat=${encodeURIComponent(p.category)}`} className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">{p.category}</Link>
              {sold ? <Badge tone="danger">Out of stock</Badge> : low ? <Badge tone="warning">Only {p.stock} left</Badge> : <Badge tone="success" dot>In stock</Badge>}
            </div>
            <h1 className="mt-3 text-[28px] font-extrabold leading-tight tracking-tight sm:text-4xl">{p.name}</h1>
            <div className="mt-3"><Rating value={p.rating} count={p.reviews} size={16} /></div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="tnum text-3xl font-extrabold">{money(salePrice(p))}</span>
              {p.discount > 0 && (<><span className="tnum text-lg text-slate-400 line-through">{money(p.price)}</span><Badge tone="brand">Save {p.discount}%</Badge></>)}
            </div>
            <p className="mt-5 leading-relaxed text-slate-600">{p.blurb}</p>

            {p.colors && p.colors.length > 1 && (
              <div className="mt-7">
                <p className="mb-2.5 text-sm font-bold">Colour <span className="ml-1 font-medium text-slate-500">{p.colors[color].name}</span></p>
                <div className="flex gap-2.5">
                  {p.colors.map((c, i) => (
                    <button key={c.name} onClick={() => setColor(i)} aria-label={c.name} className={cn("size-9 rounded-full ring-2 ring-offset-2 transition-all cursor-pointer", color === i ? "ring-ink-900" : "ring-transparent hover:ring-stone-300")} style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.1)" }} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 flex items-center gap-3">
              <Qty size="md" value={qty} onChange={setQty} />
              <p className="text-sm text-slate-500">Total <span className="tnum font-extrabold text-slate-900">{money(salePrice(p) * qty)}</span></p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Button size="lg" variant="secondary" disabled={sold} onClick={() => (add(p.id, qty, { color: p.colors?.[color]?.name }), toast.push("Added to cart"))}>Add to cart</Button>
              <Button size="lg" onClick={() => navigate(`/checkout/${p.id}`)}>{sold ? "Pre-order now" : "Buy now"}</Button>
            </div>
            <p className="mt-3 text-center text-[13px] text-slate-500 sm:text-left">১-পেজ এক্সপ্রেস চেকআউট · কোনো পাসওয়ার্ড লাগবে না · ক্যাশ অন ডেলিভারি</p>

            <ul className="mt-8 grid gap-3 border-t border-line pt-6 sm:grid-cols-3">
              {[[BadgeCheck, "100% genuine"], [Wallet, "Cash on delivery"], [RefreshCcw, "7-day replacement"]].map(([I, t]) => {
                const Icon = I as typeof Truck;
                return <li key={t as string} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"><Icon className="size-[18px] text-brand-700" />{t as string}</li>;
              })}
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 max-w-4xl">
          <Tabs value={tab} onChange={setTab} tabs={[{ value: "desc", label: "Description" }, { value: "specs", label: "Specifications" }, { value: "rev", label: "Reviews", count: reviews.length }]} />
          <div key={tab} className="anim-fade pt-8">
            {tab === "desc" && <p className="max-w-2xl leading-[1.8] text-slate-600">{p.blurb} Built for daily use and backed by Keriyo's 7-day replacement warranty, with fast delivery across Bangladesh. Every unit is inspected before dispatch so it arrives exactly as described.</p>}
            {tab === "specs" && (
              <dl className="max-w-xl divide-y divide-line">
                {p.specs.map(([k, v]) => (<div key={k} className="flex justify-between gap-6 py-3 text-sm"><dt className="text-slate-500">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>))}
              </dl>
            )}
            {tab === "rev" && (
              <div className="grid gap-12 md:grid-cols-[220px_1fr]">
                <div>
                  <p className="text-5xl font-extrabold tracking-tight">{p.rating.toFixed(1)}</p>
                  <div className="mt-1 flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className="size-4 fill-amber-400 text-amber-400" />)}</div>
                  <p className="mt-1 text-sm text-slate-500">{p.reviews} reviews</p>
                  <div className="mt-5 space-y-2">{[5, 4, 3, 2, 1].map((s, i) => (<div key={s} className="flex items-center gap-2 text-xs font-semibold text-slate-500"><span className="w-2">{s}</span><div className="flex-1"><Progress value={[78, 16, 4, 1, 1][i]} tone="warning" /></div></div>))}</div>
                </div>
                <div>
                  <ul className="divide-y divide-line">
                    {reviews.map((r) => (
                      <li key={r.n} className="py-5 first:pt-0">
                        <div className="flex items-center gap-3"><Avatar name={r.n} size={36} /><div><p className="text-sm font-bold">{r.n}</p><p className="text-xs text-slate-500">{r.d}</p></div><div className="ml-auto"><Rating value={r.r} size={13} /></div></div>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">{r.t}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 rounded-2xl bg-stone-100/70 p-5">
                    <p className="mb-3 text-sm font-extrabold">Write a review</p>
                    <div className="mb-3 flex gap-1">{[1, 2, 3, 4, 5].map((i) => (<button key={i} onClick={() => setStars(i)} aria-label={`${i} stars`} className="cursor-pointer"><Star className={cn("size-6 transition-colors", i <= stars ? "fill-amber-400 text-amber-400" : "text-stone-300")} /></button>))}</div>
                    <Textarea placeholder="Share your feedback on build quality, tactile feel, sound or dispatch speed…" />
                    <Button className="mt-3" onClick={() => toast.push("Review published")}>Publish review</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>

      <Container className="pt-16">
        <Reveal><h2 className="mb-7 text-2xl font-extrabold tracking-tight">You may also like</h2></Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
      </Container>

      {/* Mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1"><p className="tnum text-lg font-extrabold leading-none">{money(salePrice(p))}</p><p className="mt-1 truncate text-xs text-slate-500">{p.name}</p></div>
          <Button variant="secondary" disabled={sold} onClick={() => (add(p.id, qty), toast.push("Added to cart"))}>Add</Button>
          <Button onClick={() => navigate(`/checkout/${p.id}`)}>{sold ? "Pre-order" : "Buy now"}</Button>
        </div>
      </div>

      {light && (
        <div className="anim-fade fixed inset-0 z-[100] grid place-items-center bg-ink-950/95 p-4" onClick={() => setLight(false)}>
          <button aria-label="Close" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"><X className="size-5" /></button>
          <button aria-label="Previous" onClick={(e) => (e.stopPropagation(), setShot((s) => (s + 3) % 4))} className="absolute left-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"><ChevronLeft className="size-5" /></button>
          <button aria-label="Next" onClick={(e) => (e.stopPropagation(), setShot((s) => (s + 1) % 4))} className="absolute right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"><ChevronRight className="size-5" /></button>
          <div className="anim-scale aspect-square w-full max-w-[min(80vh,720px)] overflow-hidden rounded-2xl bg-tile" onClick={(e) => e.stopPropagation()}>
            <Img src={p.img} alt={p.name} className="size-full" imgClass={cn("p-4", crops[shot])} />
          </div>
        </div>
      )}
    </>
  );
}
