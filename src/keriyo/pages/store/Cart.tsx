import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Lock } from "lucide-react";
import { Button, Container, EmptyState, Img, money } from "../../ui";
import { getProduct, salePrice } from "../../data";
import { useCart } from "../../store/cart";
import { Qty } from "../../layout/StoreLayout";

export default function Cart() {
  const { lines, setQty, remove, subtotal, clear } = useCart();
  const navigate = useNavigate();
  return (
    <Container className="pb-8 pt-24 sm:pt-28">
      <div className="mb-8 flex items-end justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your cart</h1>
        {lines.length > 0 && <button onClick={clear} className="text-sm font-semibold text-slate-500 hover:text-rose-600 cursor-pointer">Clear all</button>}
      </div>
      {lines.length === 0 ? (
        <EmptyState icon={<ShoppingBag className="size-6" />} title="Your cart is empty" sub="Mechanical clickers, EDC gear and tech accessories are waiting." action={<Link to="/collection"><Button size="lg">Browse products</Button></Link>} />
      ) : (
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px]">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((l) => {
              const p = getProduct(l.id)!;
              return (
                <li key={l.id} className="flex gap-4 py-6 sm:gap-6">
                  <Link to={`/product/${p.id}`}><Img src={p.img} alt={p.name} className="size-24 rounded-2xl sm:size-28" /></Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div>
                        <Link to={`/product/${p.id}`} className="line-clamp-2 font-bold leading-snug hover:text-brand-700">{p.name}</Link>
                        <p className="mt-1 text-sm text-slate-500">{l.color ?? l.option ?? p.sub}</p>
                      </div>
                      <span className="tnum hidden font-extrabold sm:block">{money(salePrice(p) * l.qty)}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <Qty value={l.qty} onChange={(n) => setQty(l.id, n)} />
                      <span className="tnum font-extrabold sm:hidden">{money(salePrice(p) * l.qty)}</span>
                      <button onClick={() => remove(l.id)} className="hidden items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-rose-600 sm:flex cursor-pointer"><Trash2 className="size-4" />Remove</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <aside className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-line lg:sticky lg:top-24">
            <h2 className="text-lg font-extrabold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="tnum font-bold">{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Delivery</dt><dd className="text-slate-500">Calculated at checkout</dd></div>
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5"><span className="font-bold">Total</span><span className="tnum text-2xl font-extrabold">{money(subtotal)}</span></div>
            <Button size="lg" full className="mt-6" onClick={() => navigate("/place-order")}>Continue to checkout</Button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500"><Lock className="size-3.5" />No account needed · Cash on delivery available</p>
          </aside>
        </div>
      )}
    </Container>
  );
}
