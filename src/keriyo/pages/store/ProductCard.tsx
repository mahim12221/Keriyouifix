import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Badge, Img, Rating, money, useToast } from "../../ui";
import { salePrice, type Product } from "../../data";
import { useCart } from "../../store/cart";

/** One product card for every grid. Image tile only — no outer border/box. */
export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const toast = useToast();
  const sold = p.stock === 0;
  return (
    <div className="group">
      <div className="relative">
        <Link to={`/product/${p.id}`} aria-label={p.name} className="block">
          <Img src={p.img} alt={p.name} className="aspect-square rounded-2xl" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {sold ? <Badge tone="dark">Sold out</Badge> : p.discount > 0 && <Badge tone="brand" className="bg-white/90 backdrop-blur">−{p.discount}%</Badge>}
          {p.isNew && !sold && <Badge tone="dark">New</Badge>}
        </div>
        {!sold && (
          <button
            aria-label={`Add ${p.name} to cart`}
            onClick={() => {
              add(p.id);
              toast.push("Added to cart");
            }}
            className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-white text-slate-900 shadow-lift transition-all duration-300 hover:bg-ink-900 hover:text-white sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 cursor-pointer"
          >
            <Plus className="size-5" />
          </button>
        )}
      </div>
      <Link to={`/product/${p.id}`} className="mt-3.5 block px-0.5">
        <p className="text-xs font-semibold text-slate-500">{p.sub}</p>
        <h3 className="mt-0.5 line-clamp-2 min-h-[2.6em] text-[14.5px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-700">{p.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="tnum text-[15px] font-extrabold">{money(salePrice(p))}</span>
            {p.discount > 0 && <span className="tnum text-xs text-slate-400 line-through">{money(p.price)}</span>}
          </div>
          <Rating value={p.rating} size={12} />
        </div>
      </Link>
    </div>
  );
}
