import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Globe,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  User,
  X,
  ArrowRight,
  Truck,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Logo } from "../ui/Logo";
import { Badge, Button, Container, Drawer, IconButton, Img, Popover, Tabs, money } from "../ui";
import { categories, getProduct, products, salePrice, type Cat } from "../data";
import { useCart } from "../store/cart";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/collection", label: "Collection" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

/* ------------------------------------------------------------- Header */
function Header() {
  const { pathname } = useLocation();
  const { count, setOpen } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const isHome = pathname === "/";
  const dark = isHome && !scrolled;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => setMenu(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          dark ? "border-b border-transparent bg-transparent text-white" : "border-b border-line bg-white/85 text-slate-900 backdrop-blur-xl",
        )}
      >
        <Container className="flex h-16 items-center gap-6">
          <button className="-ml-2 inline-flex size-10 items-center justify-center rounded-full hover:bg-black/5 lg:hidden cursor-pointer" aria-label="Menu" onClick={() => setMenu(true)}>
            <Menu className="size-5" />
          </button>
          <Link to="/" className="shrink-0" aria-label="Keriyo home">
            <span id="brand-logo-target" className="inline-flex transition-opacity duration-300">
              <Logo onDark={dark} size={28} />
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {nav.map((n) =>
              n.label === "Collection" ? (
                <div key={n.to} className="group relative">
                  <NavLink to={n.to} className={({ isActive }) => navCls(isActive, dark)}>
                    {n.label}
                    <ChevronDown className="size-3.5 opacity-60 transition-transform group-hover:rotate-180" />
                  </NavLink>
                  <MegaMenu />
                </div>
              ) : (
                <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => navCls(isActive, dark)}>
                  {n.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={() => setSearch(true)}
              className={cn(
                "hidden h-10 items-center gap-2.5 rounded-full border pl-3.5 pr-2 text-sm transition-colors md:flex cursor-pointer",
                dark ? "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10" : "border-stone-300/70 bg-stone-100/60 text-slate-500 hover:bg-stone-100",
              )}
            >
              <Search className="size-4" />
              <span className="w-36 text-left">Search gadgets…</span>
              <kbd className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold", dark ? "bg-white/10" : "bg-white text-slate-500 shadow-sm")}>⌘K</kbd>
            </button>
            <IconButton label="Search" onClick={() => setSearch(true)} className="md:hidden">
              <Search className="size-5" />
            </IconButton>
            <NotificationsMenu />
            <AccountMenu />
            <IconButton label="Cart" onClick={() => setOpen(true)}>
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span key={count} className="anim-scale absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-extrabold leading-[18px] text-ink-950">
                  {count}
                </span>
              )}
            </IconButton>
          </div>
        </Container>
      </header>

      <SearchOverlay open={search} onClose={() => setSearch(false)} onGo={(to) => (setSearch(false), navigate(to))} />
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </>
  );
}
const navCls = (active: boolean, dark: boolean) =>
  cn(
    "relative inline-flex h-9 items-center gap-1 rounded-full px-3.5 text-sm font-semibold transition-colors",
    dark ? (active ? "bg-white/10 text-white" : "text-slate-300 hover:text-white") : active ? "bg-stone-100 text-slate-900" : "text-slate-600 hover:text-slate-900",
  );

function MegaMenu() {
  return (
    <div className="invisible absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      <div className="grid grid-cols-3 gap-x-8 gap-y-6 rounded-2xl border border-line bg-white p-6 text-slate-800 shadow-lift">
        {categories.map((c) => (
          <div key={c.name}>
            <Link to={`/collection?cat=${encodeURIComponent(c.name)}`} className="text-sm font-extrabold text-slate-900 hover:text-brand-700">
              {c.name}
            </Link>
            <ul className="mt-2 space-y-1">
              {c.children?.map((s) => (
                <li key={s.name}>
                  <Link to={`/collection?cat=${encodeURIComponent(c.name)}&sub=${encodeURIComponent(s.name)}`} className="text-[13px] text-slate-500 transition-colors hover:text-brand-700">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Link to="/collection" className="group/c flex items-end text-sm font-bold text-brand-700">
          View everything
          <ArrowRight className="ml-1.5 size-4 transition-transform group-hover/c:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

function SearchOverlay({ open, onClose, onGo }: { open: boolean; onClose: () => void; onGo: (to: string) => void }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    if (!open) return;
    setQ("");
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  const results = useMemo(() => (q.trim() ? products.filter((p) => (p.name + p.category + p.sub).toLowerCase().includes(q.toLowerCase())) : products.filter((p) => p.best)), [q]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90]">
      <div className="anim-fade absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="anim-scale relative mx-auto mt-[8vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl bg-white shadow-pop">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="size-5 text-slate-400" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gadgets, cases, fidget toys…" className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-slate-400" />
          <button onClick={onClose} className="rounded-md bg-stone-100 px-2 py-1 text-[11px] font-bold text-slate-500 cursor-pointer">ESC</button>
        </div>
        <div className="thin-scroll max-h-[55vh] overflow-y-auto p-2">
          <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-slate-400">{q ? `${results.length} results` : "Popular right now"}</p>
          {results.map((p) => (
            <button key={p.id} onClick={() => onGo(`/product/${p.id}`)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-stone-100 cursor-pointer">
              <Img src={p.img} alt="" className="size-12 shrink-0 rounded-lg" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">{p.name}</span>
                <span className="text-xs text-slate-500">{p.sub}</span>
              </span>
              <span className="tnum text-sm font-bold">{money(salePrice(p))}</span>
            </button>
          ))}
          {results.length === 0 && <p className="px-3 py-10 text-center text-sm text-slate-500">No gadgets match “{q}”.</p>}
        </div>
      </div>
    </div>
  );
}

function NotificationsMenu() {
  const [tab, setTab] = useState<"all" | "otp" | "orders">("all");
  const items = [
    { k: "otp", icon: <Phone className="size-4" />, t: "OTP Verification", d: "Your code is 4821. It expires in 5 minutes.", time: "Just now", unread: true },
    { k: "orders", icon: <Package className="size-4" />, t: "Order Confirmed", d: "KR-10482 is confirmed and being packed.", time: "12 min", unread: true },
    { k: "orders", icon: <Truck className="size-4" />, t: "Dispatched", d: "KR-10479 is with Steadfast. Tap to track.", time: "Yesterday" },
  ].filter((i) => tab === "all" || i.k === tab);
  return (
    <Popover
      width="w-[340px] max-w-[calc(100vw-1.5rem)]"
      trigger={(_, toggle) => (
        <IconButton label="Notifications" onClick={toggle}>
          <Bell className="size-5" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand-500 ring-2 ring-white/80" />
        </IconButton>
      )}
    >
      {() => (
        <div>
          <div className="flex items-center justify-between px-4 pt-3.5">
            <h4 className="text-sm font-extrabold">Notifications</h4>
            <button className="text-xs font-semibold text-brand-700 cursor-pointer">Mark all read</button>
          </div>
          <Tabs className="mt-2 gap-4 px-4" value={tab} onChange={setTab} tabs={[{ value: "all", label: "All" }, { value: "otp", label: "OTP" }, { value: "orders", label: "Orders" }]} />
          <ul className="max-h-80 overflow-y-auto p-1.5">
            {items.map((n, i) => (
              <li key={i} className="flex gap-3 rounded-lg p-2.5 hover:bg-stone-50">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">{n.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-bold">{n.t}</p>
                    <span className="shrink-0 text-[11px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{n.d}</p>
                </div>
                {n.unread && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Popover>
  );
}

function AccountMenu() {
  const navigate = useNavigate();
  return (
    <Popover
      width="w-60"
      trigger={(_, toggle) => (
        <IconButton label="Account" onClick={toggle} className="hidden sm:inline-flex">
          <User className="size-5" />
        </IconButton>
      )}
    >
      {(close) => (
        <div className="p-1.5 text-sm">
          <div className="px-3 pb-2 pt-2.5">
            <p className="font-extrabold">Tanvir Ahmed</p>
            <p className="text-xs text-slate-500">tanvir@example.com</p>
          </div>
          <div className="my-1 h-px bg-line" />
          {[
            { to: "/orders", icon: <Package className="size-4" />, label: "My orders" },
            { to: "/profile", icon: <User className="size-4" />, label: "My profile" },
          ].map((i) => (
            <Link key={i.to} to={i.to} onClick={close} className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-stone-100">
              {i.icon}
              {i.label}
            </Link>
          ))}
          <button onClick={() => (close(), navigate("/login"))} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-rose-600 hover:bg-rose-50 cursor-pointer">
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      )}
    </Popover>
  );
}

function CatTree({ cats, depth = 0, onPick }: { cats: Cat[]; depth?: number; onPick: (path: string[]) => void }) {
  return (
    <ul>
      {cats.map((c) => <CatNode key={c.name} c={c} depth={depth} onPick={onPick} />)}
    </ul>
  );
}
function CatNode({ c, depth, onPick }: { c: Cat; depth: number; onPick: (p: string[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <div className="flex items-center" style={{ paddingLeft: depth * 14 }}>
        <button onClick={() => onPick([c.name])} className="flex-1 py-2.5 text-left text-[15px] font-semibold text-slate-800 cursor-pointer">{c.name}</button>
        {c.children && (
          <button aria-label="Expand" onClick={() => setOpen((o) => !o)} className="grid size-9 place-items-center text-slate-400 cursor-pointer">
            <ChevronRight className={cn("size-4 transition-transform", open && "rotate-90")} />
          </button>
        )}
      </div>
      {open && c.children && <CatTree cats={c.children} depth={depth + 1} onPick={onPick} />}
    </li>
  );
}
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <Drawer open={open} onClose={onClose} side="left" width="max-w-[320px]" title={<Logo size={24} />}>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-2">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} onClick={onClose} className={({ isActive }) => cn("rounded-lg px-3 py-2.5 text-center text-sm font-bold", isActive ? "bg-ink-900 text-white" : "bg-stone-100 text-slate-700")}>
              {n.label}
            </NavLink>
          ))}
        </div>
        <p className="mb-1 mt-7 text-xs font-bold uppercase tracking-wider text-slate-400">Shop categories</p>
        <CatTree cats={categories} onPick={(p) => (onClose(), navigate(`/collection?cat=${encodeURIComponent(p[0])}`))} />
        <div className="mt-6 flex flex-col gap-2 border-t border-line pt-5 text-sm font-semibold text-slate-700">
          <Link to="/orders" onClick={onClose}>My orders</Link>
          <Link to="/profile" onClick={onClose}>My profile</Link>
          <Link to="/login" onClick={onClose}>Sign in</Link>
        </div>
      </div>
    </Drawer>
  );
}

/* --------------------------------------------------------- Cart drawer */
function CartDrawer() {
  const { open, setOpen, lines, setQty, remove, subtotal } = useCart();
  const navigate = useNavigate();
  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      title={
        <span className="flex items-center gap-2">
          Your cart <Badge tone="neutral">{lines.reduce((a, l) => a + l.qty, 0)}</Badge>
        </span>
      }
      footer={
        lines.length > 0 && (
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="tnum text-lg font-extrabold">{money(subtotal)}</span>
            </div>
            <p className="mb-4 text-xs text-slate-500">Delivery is calculated at checkout.</p>
            <Button size="lg" full onClick={() => (setOpen(false), navigate("/place-order"))}>
              Continue to checkout
            </Button>
            <Button variant="ghost" full className="mt-1" onClick={() => (setOpen(false), navigate("/cart"))}>
              View full cart
            </Button>
          </div>
        )
      }
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-8 py-20 text-center">
          <div className="mb-4 grid size-14 place-items-center rounded-full bg-stone-100"><ShoppingBag className="size-6 text-slate-500" /></div>
          <p className="font-extrabold">Your cart is empty</p>
          <p className="mt-1 text-sm text-slate-500">Mechanical clickers, EDC gear and tech accessories are waiting.</p>
          <Button className="mt-5" onClick={() => (setOpen(false), navigate("/collection"))}>Browse products</Button>
        </div>
      ) : (
        <ul className="divide-y divide-line px-5">
          {lines.map((l) => {
            const p = getProduct(l.id)!;
            return (
              <li key={l.id} className="flex gap-4 py-4">
                <Img src={p.img} alt={p.name} className="size-20 shrink-0 rounded-xl" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <Link to={`/product/${p.id}`} onClick={() => setOpen(false)} className="line-clamp-2 text-sm font-bold leading-snug hover:text-brand-700">{p.name}</Link>
                    <button aria-label="Remove" onClick={() => remove(l.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer"><Trash2 className="size-4" /></button>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{l.color ?? l.option ?? p.sub}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <Qty value={l.qty} onChange={(n) => setQty(l.id, n)} />
                    <span className="tnum text-sm font-extrabold">{money(salePrice(p) * l.qty)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Drawer>
  );
}
export function Qty({ value, onChange, size = "sm" }: { value: number; onChange: (n: number) => void; size?: "sm" | "md" }) {
  const b = size === "sm" ? "size-8" : "size-10";
  return (
    <div className="inline-flex items-center rounded-full border border-stone-300/80 bg-white">
      <button aria-label="Decrease" disabled={value <= 1} onClick={() => onChange(value - 1)} className={cn(b, "grid place-items-center rounded-full text-slate-600 transition-colors hover:bg-stone-100 disabled:opacity-30 cursor-pointer")}><Minus className="size-3.5" /></button>
      <span className="tnum w-7 text-center text-sm font-bold">{value}</span>
      <button aria-label="Increase" onClick={() => onChange(value + 1)} className={cn(b, "grid place-items-center rounded-full text-slate-600 transition-colors hover:bg-stone-100 cursor-pointer")}><Plus className="size-3.5" /></button>
    </div>
  );
}

/* --------------------------------------------------------------- Footer */
function Footer() {
  return (
    <footer className="mt-24 bg-ink-950 text-slate-300">
      <Container className="grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo onDark size={30} tagline />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">Precision EDC gear, smart gadgets and everyday tech — 100% authentic, delivered fast across all 64 districts.</p>
          <div className="mt-6 flex gap-2">
            <a href="#" className="grid size-10 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10" aria-label="Facebook"><Globe className="size-[18px]" /></a>
            <a href="#" className="grid size-10 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10" aria-label="WhatsApp"><MessageCircle className="size-[18px]" /></a>
            <a href="#" className="grid size-10 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/10" aria-label="Email"><Mail className="size-[18px]" /></a>
          </div>
        </div>
        <FooterCol title="Explore" links={[["Home", "/"], ["All collections", "/collection"], ["Our story", "/about"], ["Contact", "/contact"]]} className="md:col-span-2" />
        <FooterCol title="Policies" links={[["Privacy policy", "/privacy-policy"], ["Brand assets", "/brand-assets"], ["Staff portal", "/staff-login"]]} className="md:col-span-2" />
        <div className="md:col-span-4">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white">Customer care</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-brand-400" /><span>01880172859<br />01742111888</span></li>
            <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-brand-400" />contact@keriyo.com</li>
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" />Dhaka, Bangladesh</li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>© 2026 KERIYO. All rights reserved. Created &amp; operated by Mahim Afridi.</p>
          <p>Fast delivery across all 64 districts</p>
        </Container>
      </div>
    </footer>
  );
}
function FooterCol({ title, links, className }: { title: string; links: [string, string][]; className?: string }) {
  return (
    <div className={className}>
      <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white">{title}</h4>
      <ul className="space-y-2.5 text-sm">
        {links.map(([l, to]) => (
          <li key={l}><Link to={to} className="text-slate-400 transition-colors hover:text-white">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main key={useLocation().pathname} className="page-enter flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
export { X };
