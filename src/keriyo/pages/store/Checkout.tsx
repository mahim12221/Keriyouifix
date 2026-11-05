import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, Check, ChevronLeft, Copy, ShieldCheck, Truck, Wallet } from "lucide-react";
import { cn } from "@/utils/cn";
import { Badge, Button, Container, Field, Img, Input, Modal, Select, money, useToast } from "../../ui";
import { getProduct, salePrice } from "../../data";
import { useCart } from "../../store/cart";
import { Qty } from "../../layout/StoreLayout";

const divisions: Record<string, string[]> = {
  ঢাকা: ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "টাঙ্গাইল"],
  চট্টগ্রাম: ["চট্টগ্রাম", "কক্সবাজার", "কুমিল্লা"],
  রাজশাহী: ["রাজশাহী", "বগুড়া", "পাবনা"],
  খুলনা: ["খুলনা", "যশোর", "কুষ্টিয়া"],
  সিলেট: ["সিলেট", "মৌলভীবাজার"],
  বরিশাল: ["বরিশাল", "ভোলা"],
  রংপুর: ["রংপুর", "দিনাজপুর"],
  ময়মনসিংহ: ["ময়মনসিংহ", "জামালপুর"],
};
type Pay = "cod" | "bkash" | "nagad";

/** Handles both /place-order (cart) and /checkout/:productId (express). Bangla copy preserved from production. */
export default function Checkout() {
  const { productId } = useParams();
  const { lines, subtotal, clear } = useCart();
  const express = !!productId;
  const [xQty, setXQty] = useState(1);
  const toast = useToast();

  const items = express
    ? [{ p: getProduct(productId)!, qty: xQty }].filter((i) => i.p)
    : lines.map((l) => ({ p: getProduct(l.id)!, qty: l.qty }));
  const itemsTotal = express ? (items[0] ? salePrice(items[0].p) * xQty : 0) : subtotal;

  const [div, setDiv] = useState("ঢাকা");
  const [pay, setPay] = useState<Pay>("cod");
  const [otp, setOtp] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const delivery = div === "ঢাকা" ? 80 : 130;
  const total = itemsTotal + delivery;
  const advance = pay === "cod" ? 0 : delivery;
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => (setBusy(false), setOtp(true)), 700);
  };

  if (done)
    return (
      <Container className="pb-8 pt-32">
        <div className="anim-rise mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 grid size-20 place-items-center rounded-full bg-emerald-50">
            <svg viewBox="0 0 24 24" className="size-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "k-draw 0.6s 0.2s ease-out forwards" }} /></svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">অর্ডার সম্পন্ন হয়েছে!</h1>
          <p className="mt-2 text-slate-600">Thank you, Tanvir. Your order <b className="text-slate-900">KR-10483</b> is confirmed. We'll call you before delivery.</p>
          <div className="mt-8 rounded-2xl bg-stone-100/70 p-5 text-left text-sm">
            <div className="flex justify-between py-1"><span className="text-slate-500">Total</span><b className="tnum">{money(total)}</b></div>
            <div className="flex justify-between py-1"><span className="text-slate-500">Payable on delivery</span><b className="tnum">{money(total - advance)}</b></div>
            <div className="flex justify-between py-1"><span className="text-slate-500">Courier</span><b>Steadfast</b></div>
          </div>
          <div className="mt-8 flex justify-center gap-3"><Link to="/orders"><Button size="lg">Track my order</Button></Link><Link to="/collection"><Button size="lg" variant="secondary">Keep shopping</Button></Link></div>
        </div>
      </Container>
    );

  return (
    <Container className="pb-8 pt-24 sm:pt-28">
      <button onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"><ChevronLeft className="size-4" />Back</button>
      <div className="mb-10">
        <Badge tone="brand">{express ? "Express checkout" : "1-page checkout"}</Badge>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">অর্ডার সম্পন্ন করুন</h1>
        <p className="mt-2 text-slate-600">অ্যাকাউন্ট খোলার দরকার নেই — তথ্য দিয়ে সরাসরি অর্ডার করুন।</p>
      </div>

      <form onSubmit={submit} className="grid items-start gap-12 lg:grid-cols-[1fr_400px]">
        <div className="space-y-12">
          <Section n={1} title="ডেলিভারি তথ্য" sub="Delivery details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="পূর্ণ নাম"><Input required placeholder="তানভীর আহমেদ" /></Field>
              <Field label="মোবাইল নম্বর"><Input required inputMode="tel" placeholder="01XXXXXXXXX" /></Field>
              <Field label="বিভাগ"><Select value={div} onChange={(e) => setDiv(e.target.value)}>{Object.keys(divisions).map((d) => <option key={d}>{d}</option>)}</Select></Field>
              <Field label="জেলা"><Select>{divisions[div].map((d) => <option key={d}>{d}</option>)}</Select></Field>
              <Field label="সম্পূর্ণ ঠিকানা" className="sm:col-span-2"><Input required placeholder="বাসা ১২/এ, রোড ৪, সেক্টর ৭, উত্তরা" /></Field>
              <Field label="ইমেইল (ঐচ্ছিক)"><Input type="email" placeholder="example@gmail.com" /></Field>
              <Field label="অর্ডার নোট (ঐচ্ছিক)"><Input placeholder="ডেলিভারির আগে কল দিবেন" /></Field>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-stone-100/70 px-4 py-3 text-sm"><Truck className="size-[18px] text-brand-700" /><span className="text-slate-600">কুরিয়ার: <b className="text-slate-900">স্টিডফাস্ট</b></span><span className="tnum ml-auto font-bold">{money(delivery)}</span></div>
          </Section>

          <Section n={2} title="পেমেন্ট পদ্ধতি" sub="Payment method">
            <div className="grid gap-3 sm:grid-cols-3">
              {([["cod", "ক্যাশ অন ডেলিভারি", "পণ্য হাতে পেয়ে মূল্য দিন"], ["bkash", "বিকাশ", "Personal · Send Money"], ["nagad", "নগদ", "Personal · Send Money"]] as [Pay, string, string][]).map(([k, t, d]) => (
                <button type="button" key={k} onClick={() => setPay(k)} className={cn("relative rounded-xl border p-4 text-left transition-all cursor-pointer", pay === k ? "border-ink-900 bg-white ring-1 ring-ink-900" : "border-stone-300/80 bg-white hover:border-stone-400")}>
                  <span className="flex items-center justify-between"><span className="font-bold">{t}</span><span className={cn("grid size-5 place-items-center rounded-full border transition-colors", pay === k ? "border-ink-900 bg-ink-900 text-white" : "border-stone-300")}>{pay === k && <Check className="size-3" strokeWidth={3.5} />}</span></span>
                  <span className="mt-1 block text-xs text-slate-500">{d}</span>
                </button>
              ))}
            </div>
            {pay !== "cod" && (
              <div className="anim-rise mt-5 rounded-xl bg-stone-100/70 p-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{pay === "bkash" ? "বিকাশ" : "নগদ"} (Personal) নম্বরে পাঠান</span>
                  <button type="button" onClick={() => toast.push("Number copied")} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-bold shadow-sm cursor-pointer"><span className="tnum">01880172859</span><Copy className="size-3.5 text-slate-400" /></button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="টাকার পরিমাণ" hint={`সর্বোচ্চ ${money(total)}`}><Input defaultValue={advance} inputMode="numeric" /></Field>
                  <Field label="যে নম্বর থেকে পাঠিয়েছেন"><Input placeholder="01XXXXXXXXX" /></Field>
                  <Field label="TrxID" hint="না পাঠালে খালি রাখুন" className="sm:col-span-2"><Input placeholder="e.g. 9J3K8L2P1X" className="uppercase" /></Field>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-slate-500">এডমিন স্টেটমেন্ট মিলে গেলে পেমেন্ট অনুমোদিত হবে। ভুল বা ডামি TrxID দিলে অর্ডার বাতিল হতে পারে।</p>
              </div>
            )}
          </Section>
        </div>

        {/* Summary */}
        <aside className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-line lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold">সর্বমোট</h2>
          <ul className="mt-4 divide-y divide-line">
            {items.map(({ p, qty }) => (
              <li key={p.id} className="flex gap-3 py-3">
                <Img src={p.img} alt="" className="size-16 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-bold leading-snug">{p.name}</p><div className="mt-1.5 flex items-center justify-between">{express ? <Qty value={xQty} onChange={setXQty} /> : <span className="text-xs text-slate-500">Qty {qty}</span>}<span className="tnum text-sm font-bold">{money(salePrice(p) * qty)}</span></div></div>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-2.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">পণ্যের মূল্য</dt><dd className="tnum font-semibold">{money(itemsTotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">ডেলিভারি চার্জ</dt><dd className="tnum font-semibold">{money(delivery)}</dd></div>
            {advance > 0 && <div className="flex justify-between"><dt className="text-slate-500">অগ্রিম পরিশোধ (যাচাই অপেক্ষমাণ)</dt><dd className="tnum font-semibold text-amber-700">−{money(advance)}</dd></div>}
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4"><span className="font-bold">ডেলিভারিতে প্রদেয়</span><span className="tnum text-2xl font-extrabold">{money(total - advance)}</span></div>
          <Button type="submit" size="lg" full className="mt-6" loading={busy} disabled={items.length === 0}>{busy ? "প্রসেস হচ্ছে…" : "অর্ডার নিশ্চিত করুন"}</Button>
          <ul className="mt-5 space-y-2 text-xs text-slate-500">
            <li className="flex items-center gap-2"><Wallet className="size-3.5 text-brand-700" />ক্যাশ অন ডেলিভারি</li>
            <li className="flex items-center gap-2"><BadgeCheck className="size-3.5 text-brand-700" />৭ দিনের রিপ্লেসমেন্ট</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-brand-700" />আপনার তথ্য সম্পূর্ণ সুরক্ষিত</li>
          </ul>
        </aside>
      </form>

      <OtpModal open={otp} onClose={() => setOtp(false)} onVerified={() => (setOtp(false), setDone(true), !express && clear())} />
    </Container>
  );
}

function Section({ n, title, sub, children }: { n: number; title: string; sub: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-full bg-ink-900 text-sm font-extrabold text-white">{n}</span>
        <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
        <span className="text-sm text-slate-400">{sub}</span>
      </div>
      {children}
    </section>
  );
}

export function OtpModal({ open, onClose, onVerified }: { open: boolean; onClose: () => void; onVerified: () => void }) {
  const [v, setV] = useState(["", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    if (open) setV(["", "", "", ""]);
  }, [open]);
  const set = (i: number, c: string) => {
    const d = c.replace(/\D/g, "").slice(-1);
    const n = [...v];
    n[i] = d;
    setV(n);
    if (d && i < 3) refs.current[i + 1]?.focus();
  };
  return (
    <Modal open={open} onClose={onClose} title="মোবাইল ওটিপি যাচাই" sub="ফেক অর্ডার প্রতিরোধে ৪ ডিজিটের কোডটি দিন" width="max-w-sm" footer={<><Button variant="ghost" onClick={onClose}>বাতিল</Button><Button disabled={v.join("").length < 4} onClick={onVerified}>যাচাই করুন</Button></>}>
      <p className="mb-5 text-sm text-slate-600">কোড পাঠানো হয়েছে <b className="text-slate-900">017••••3344</b> নম্বরে। <span className="text-slate-400">(Demo: any 4 digits)</span></p>
      <div className="flex justify-center gap-3">
        {v.map((d, i) => (
          <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} onChange={(e) => set(i, e.target.value)} onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()} inputMode="numeric" autoFocus={i === 0} className={cn("size-14 rounded-xl border bg-white text-center text-2xl font-extrabold outline-none transition-all focus:border-brand-600 focus:ring-4 focus:ring-brand-500/15", d ? "border-ink-900" : "border-stone-300")} />
        ))}
      </div>
    </Modal>
  );
}
