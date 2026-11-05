import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { Badge, Button, Chip, Container, Field, Input, Modal, Segmented, Stat, Surface, Switch, Tabs, Table, Td, Th, Tr, StatusBadge, useToast, Checkbox, Select } from "../ui";
import { pages } from "../data/pages";

const audit: [string, string, string, "High" | "Medium" | "Low"][] = [
  ["Sci-fi visual language", "Near-black navy with neon-cyan glow, radial gradient backdrops, “metallic-card” and “neon-btn” classes on almost every surface. Reads as a gaming skin, not a trustworthy shop.", "Warm light storefront; ink-navy reserved for brand moments (hero, footer, sidebar). Cyan used once per view as the accent.", "High"],
  ["Typography", "Prata serif + Outfit + monospace uppercase 11px tracked labels mixed together. Dozens of arbitrary sizes (text-[11px], [13px], xs…). Slate-400 on near-black fails contrast at small sizes.", "One family (Manrope + Hind Siliguri for Bangla), a 6-step scale, AA contrast (brand-700 for text on white).", "High"],
  ["Box-in-box containers", "Mobile category tree nests rounded box → bordered box → bordered list. Product cards carry border + padding + inner image border. Admin pages wrap every section in a bordered card.", "Product grids are image tiles with text on the page. Surfaces are used only where grouping helps; stats share a single surface with dividers.", "High"],
  ["Splash & loading", "A 550 ms full-screen “INITIALIZING KERIYO GEAR…” blur overlay on every full load, then a second “LOADING GADGETS & GEAR…” Suspense loader. Two disconnected loading moments in a row.", "One branded intro (≈2.3 s, once per session, click to skip) in the same ink as the hero; the logo flies into the navbar. Skeletons replace spinners in-page.", "High"],
  ["Animation overload", "~40 keyframes: laser sweep, radar ring, border rotate, text glow, luxuryDrop, dynamicIsland*, cinematic* — overlapping vocabularies, no shared easing.", "6 keyframes, one easing curve, transform/opacity only, enter-only page transitions (≈300 ms), reduced-motion respected.", "Medium"],
  ["Admin information architecture", "~25 sections in one 716 KB chunk. Steadfast tooling appears in three places and phone/fraud inspection in three more. Emoji used as icons. Bangla and English headings mixed within one page.", "7 grouped sidebar sections; Couriers and Fraud each consolidated into one tabbed page. Lucide icons only. Shared PageHeader / Surface / Table / Drawer patterns.", "High"],
  ["Duplicate checkout implementations", "PlaceOrder (cart) and DirectProductCheckout (40 KB, express) are separate forms with different layouts and emoji decorations.", "One Checkout component serving both routes; numbered sections, sticky summary, shared OTP dialog.", "Medium"],
  ["Catalog presentation", "The featured product ships with /placeholder.png; only 4 live products. Empty states say “Catalog is being prepared”.", "Image fallback with the emblem; designed empty / sold-out / low-stock states; tile background tuned for transparent photos.", "Medium"],
  ["Mobile ergonomics", "Dense uppercase micro-labels, small tap targets, floating chat + AI + support entry points competing.", "44 px min controls, drawers for menu/filters/cart, one support launcher with two modes, sticky buy bar on product pages.", "Medium"],
];

const keep = ["Cyan + ink brand colours and the emblem", "Cash-on-delivery-first, Bangla checkout copy", "1-page express checkout + OTP verification", "Live chat + Keriyo AI split entry", "bKash / Nagad TrxID flow and Steadfast integration", "Notification centre (OTP / orders)"];
const drop = ["Neon glows, laser/radar/border-rotate effects", "Fullscreen blocking loader on every load", "Emoji as UI icons", "Monospace uppercase micro-headings", "Triple Steadfast / fraud screens", "Bordered card around every section"];

const motion = [
  ["Splash → hero", "Emblem strokes draw 0.9 s → wordmark rises → logo FLIPs (transform only) into the navbar slot while the overlay (same ink as the hero) dissolves and hero copy staggers in at 90 ms steps. Once per session; click to skip."],
  ["Page enter", "Opacity + 14 px rise, 320 ms, no exit animation — navigation is never delayed."],
  ["Scroll reveal", "IntersectionObserver adds a class once; 16 px rise, 600 ms, 60–70 ms stagger inside grids."],
  ["Hover", "Image zoom 1.045× over 700 ms; quick-add button slides up; links change colour only. No layout-shifting hovers."],
  ["Overlays", "Drawers slide 380 ms, dialogs scale from 0.97 over 280 ms, scrim fades 300 ms. All share --ease-out-soft."],
  ["Feedback", "Cart badge pops on change, toasts rise, charts draw in, progress bars scale from origin-left."],
];

const code = `/* 1. Copy tokens: src/index.css  (@theme block + keyframes) */
/* 2. Copy folder:   src/keriyo/ui     → src/components/ui
                     src/keriyo/layout → src/components/layout
                     src/keriyo/pages  → src/pages  (store / admin / staff)
   3. npm i lucide-react  (react-router-dom already in the project)
   4. Replace data imports with your API calls, e.g.
        products   → GET  /api/product/list
        categories → GET  /api/category/list
        orders     → GET  /api/order/list
        cart       → /api/cart/{get,add,update,clear}`;

export default function Hub() {
  const [tab, setTab] = useState("audit");
  const [group, setGroup] = useState("All");
  const [modal, setModal] = useState(false);
  const [sw, setSw] = useState(true);
  const [seg, setSeg] = useState("a");
  const [chk, setChk] = useState(true);
  const toast = useToast();
  const groups = ["All", ...new Set(pages.map((p) => p.group))];
  return (
    <div className="min-h-dvh bg-page">
      <header className="sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between"><Link to="/"><Logo size={26} /></Link><div className="flex items-center gap-2"><Badge tone="brand">Redesign demo</Badge><Link to="/"><Button size="sm">Open storefront <ArrowRight className="size-4" /></Button></Link></div></Container>
      </header>

      <section className="bg-ink-950 text-white">
        <Container className="py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-400">Keriyo · UI/UX audit & redesign</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">One calm, premium system for the store, the admin and the staff panel.</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">{pages.length} redesigned pages, one component kit, one motion language. The demo is fully separate from production — everything below is clickable.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link to="/"><Button variant="dark" size="lg">Storefront</Button></Link><Link to="/admin-login"><Button size="lg" className="bg-white/10 text-white hover:bg-white/15">Admin</Button></Link><Link to="/staff-login"><Button size="lg" className="bg-white/10 text-white hover:bg-white/15">Staff</Button></Link></div>
        </Container>
      </section>

      <Container className="py-10">
        <Tabs value={tab} onChange={setTab} tabs={[{ value: "audit", label: "1 · Audit" }, { value: "system", label: "2 · Design system" }, { value: "map", label: "3 · Page mapping", count: pages.length }, { value: "motion", label: "4 · Motion" }, { value: "integrate", label: "5 · Integration" }]} />
        <div key={tab} className="anim-fade pt-8">
          {tab === "audit" && (
            <div className="space-y-10">
              <p className="max-w-3xl rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"><b>How this was inspected.</b> The live site is a client-rendered SPA on Render. I read the served HTML, CSS and every lazy-loaded JS chunk (routes, component structure, class names, copy, API endpoints) and pulled the public catalog and category APIs. Authenticated screens (account, orders, admin, staff) could not be viewed rendered — their layout was inferred from source and is rebuilt from scratch rather than assumed.</p>
              <ul className="divide-y divide-line">
                {audit.map(([t, p, f, s]) => (
                  <li key={t} className="grid gap-4 py-6 md:grid-cols-[220px_1fr_1fr]"><div><p className="font-extrabold">{t}</p><Badge tone={s === "High" ? "danger" : s === "Medium" ? "warning" : "neutral"} className="mt-2">{s} impact</Badge></div><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-rose-600">Problem</p><p className="text-sm leading-relaxed text-slate-600">{p}</p></div><div><p className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-700">Fix in redesign</p><p className="text-sm leading-relaxed text-slate-600">{f}</p></div></li>
                ))}
              </ul>
              <div className="grid gap-8 md:grid-cols-2">
                <div><h3 className="mb-3 flex items-center gap-2 font-extrabold"><Check className="size-5 text-emerald-600" />Retained</h3><ul className="space-y-2 text-sm text-slate-700">{keep.map((k) => <li key={k} className="flex gap-2.5"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-500" />{k}</li>)}</ul></div>
                <div><h3 className="mb-3 flex items-center gap-2 font-extrabold"><X className="size-5 text-rose-600" />Removed / simplified</h3><ul className="space-y-2 text-sm text-slate-700">{drop.map((k) => <li key={k} className="flex gap-2.5"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-rose-500" />{k}</li>)}</ul></div>
              </div>
            </div>
          )}

          {tab === "system" && (
            <div className="space-y-12">
              <section><h2 className="mb-4 text-xl font-extrabold">Colour</h2>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 lg:grid-cols-9">{[["ink-950", "#0b1220"], ["ink-900", "#0f172a"], ["ink-700", "#2a3449"], ["brand-700", "#0e7490"], ["brand-600", "#0891b2"], ["brand-500", "#06b6d4"], ["brand-100", "#cffafe"], ["page", "#f7f7f5"], ["tile", "#ecebe9"]].map(([n, h]) => <div key={n}><div className="aspect-[4/3] rounded-xl ring-1 ring-black/5" style={{ background: h }} /><p className="mt-2 text-xs font-bold">{n}</p><p className="tnum text-[11px] text-slate-500">{h}</p></div>)}</div>
                <p className="mt-3 text-sm text-slate-500">Status colours: emerald (success), amber (warning), rose (danger), sky (info), violet (processing). Always paired with a label, never colour-only.</p></section>
              <section><h2 className="mb-4 text-xl font-extrabold">Typography — Manrope / Hind Siliguri</h2>
                <div className="space-y-3"><p className="text-5xl font-extrabold tracking-tight">Display 48 / 800</p><p className="text-3xl font-extrabold tracking-tight">Heading 30 / 800</p><p className="text-xl font-extrabold">Title 20 / 800</p><p className="text-[15px] text-slate-600">Body 15 / 500 — Precision mechanical clickers and everyday essentials.</p><p className="text-[13px] font-semibold text-slate-500">Caption 13 / 600 · অর্ডার সম্পন্ন করুন</p><p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-700">Eyebrow 12 / 700 — used once per section</p></div></section>
              <section><h2 className="mb-4 text-xl font-extrabold">Buttons & badges</h2>
                <div className="flex flex-wrap items-center gap-3"><Button>Primary</Button><Button variant="brand">Brand</Button><Button variant="secondary">Secondary</Button><Button variant="ghost">Ghost</Button><Button variant="danger">Danger</Button><Button loading>Loading</Button><Button disabled>Disabled</Button></div>
                <div className="mt-4 flex flex-wrap items-center gap-3"><Button size="sm">Small 32</Button><Button size="md">Medium 40</Button><Button size="lg">Large 48</Button></div>
                <div className="mt-5 flex flex-wrap gap-2">{["Order Placed", "Confirmed", "Packaging", "In Courier", "Out for delivery", "Delivered", "Cancelled"].map((s) => <StatusBadge key={s} status={s} />)}<Badge tone="brand">Brand</Badge><Badge tone="dark">New</Badge></div></section>
              <section><h2 className="mb-4 text-xl font-extrabold">Form controls</h2>
                <div className="grid max-w-3xl gap-4 sm:grid-cols-2"><Field label="Text input" hint="Helper text sits below"><Input placeholder="01XXXXXXXXX" /></Field><Field label="Select"><Select><option>Steadfast</option><option>Pathao</option></Select></Field></div>
                <div className="mt-5 flex flex-wrap items-center gap-8"><label className="flex items-center gap-3 text-sm font-semibold"><Switch checked={sw} onChange={setSw} />Switch</label><Checkbox checked={chk} onChange={setChk} label="Checkbox" /><Segmented value={seg} onChange={setSeg} options={[{ value: "a", label: "7D" }, { value: "b", label: "30D" }, { value: "c", label: "90D" }]} /><Chip active>Chip</Chip><Chip>Chip</Chip></div></section>
              <section><h2 className="mb-4 text-xl font-extrabold">Surfaces, stats, table, overlays</h2>
                <Surface pad={false} className="grid max-w-3xl grid-cols-3 [&>*]:p-5"><Stat label="Orders" value="24" delta="+12%" /><Stat label="Sales" value="৳98,450" delta="+8%" /><Stat label="Customers" value="1,284" /></Surface>
                <Surface pad={false} className="mt-4 max-w-3xl"><Table><thead><tr><Th>Order</Th><Th>Customer</Th><Th>Status</Th></tr></thead><tbody><Tr><Td className="font-bold text-slate-900">KR-10482</Td><Td>Tanvir Ahmed</Td><Td><StatusBadge status="Confirmed" /></Td></Tr><Tr><Td className="font-bold text-slate-900">KR-10479</Td><Td>Sadia Rahman</Td><Td><StatusBadge status="In Courier" /></Td></Tr></tbody></Table></Surface>
                <div className="mt-5 flex gap-3"><Button variant="secondary" onClick={() => setModal(true)}>Open dialog</Button><Button variant="secondary" onClick={() => toast.push("Toast notification")}>Show toast</Button></div></section>
              <section><h2 className="mb-3 text-xl font-extrabold">Spacing, radius, elevation</h2><ul className="space-y-1.5 text-sm text-slate-600"><li>• 4-pt grid · page gutters 16 / 24 / 32 · section rhythm 80–96 px (store), 24 px (panels)</li><li>• Controls 10 px radius, 40 px high · cards 16 px · tiles 16–28 px · pills fully rounded</li><li>• Shadows: card (hairline), lift (hover / popover), pop (dialog / drawer). Borders only where grouping needs it.</li></ul></section>
            </div>
          )}

          {tab === "map" && (
            <div>
              <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">{groups.map((g) => <Chip key={g} active={group === g} onClick={() => setGroup(g)}>{g}</Chip>)}</div>
              <Surface pad={false}><Table><thead><tr><Th>Existing (production)</Th><Th>Redesigned demo</Th><Th>What changed</Th><Th>Source</Th></tr></thead><tbody>
                {pages.filter((p) => group === "All" || p.group === group).map((p) => <Tr key={p.to + p.name}><Td><code className="rounded bg-stone-100 px-1.5 py-0.5 text-xs">{p.old}</code></Td><Td><Link to={p.to} className="inline-flex items-center gap-1 font-bold text-brand-700 hover:underline">{p.name}<ArrowRight className="size-3.5" /></Link></Td><Td className="text-[13px]">{p.note}</Td><Td><code className="text-xs text-slate-500">{p.file}</code></Td></Tr>)}
              </tbody></Table></Surface>
            </div>
          )}

          {tab === "motion" && (
            <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {motion.map(([t, d]) => <div key={t}><h3 className="font-extrabold">{t}</h3><p className="mt-1.5 text-sm leading-relaxed text-slate-600">{d}</p></div>)}
              <div className="md:col-span-2"><Button variant="secondary" onClick={() => { sessionStorage.removeItem("k-splash"); window.location.hash = "#/"; window.location.reload(); }}>Replay splash → hero hand-off</Button><p className="mt-3 text-sm text-slate-500">Performance rules: animate only transform and opacity; no blur or box-shadow animations; hero art loads lazily; charts are plain SVG; <code>prefers-reduced-motion</code> removes the splash and all transitions.</p></div>
            </div>
          )}

          {tab === "integrate" && (
            <div className="max-w-3xl space-y-8">
              <div><h3 className="mb-2 font-extrabold">Integration steps</h3><pre className="thin-scroll overflow-x-auto rounded-xl bg-ink-950 p-5 text-[13px] leading-relaxed text-slate-200">{code}</pre></div>
              <ol className="space-y-5 text-sm leading-relaxed text-slate-600">
                {[["Migrate in layers.", "Tokens + ui kit first (no visual change on its own), then StoreLayout, then page by page. Keep old and new routes side by side behind a feature flag (e.g. /v2) until each page is signed off."], ["Swap data, not UI.", "Pages read from src/keriyo/data. Replace each import with your existing hooks / context (ShopContext, axios calls). Types in data/index.ts mirror the Mongoose fields seen in /api/product/list."], ["Keep business logic where it is.", "OTP, MFS reconciliation, Steadfast booking, fraud checks and SMS are UI-only here. Wire the same handlers to the same endpoints (/api/order/*, /api/staff/*, /api/chat/*)."], ["Code-split the panels.", "Wrap Admin / Staff shells in React.lazy; split each admin section into its own chunk (the production AdminPortal is a single 716 KB file)."], ["Splash.", "Mount <Splash/> beside <Routes/>, give the navbar logo wrapper id=\"brand-logo-target\" and keep the .hero-in classes on hero content. Delete the old fullscreen loader."], ["Fonts.", "Replace Prata/Outfit with Manrope + Hind Siliguri (preconnect already in index.html). Self-host for production."], ["Images.", "Replace sample photos with Cloudinary URLs; add width/quality transforms and keep the tile background + mix-blend-multiply for white-background shots."]].map(([h, t], i) => <li key={h} className="flex gap-4"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink-900 text-xs font-extrabold text-white">{i + 1}</span><p><b className="text-slate-900">{h}</b> {t}</p></li>)}
              </ol>
              <p className="rounded-xl bg-stone-100/70 p-4 text-sm text-slate-600">Sample content: product photos for Air Buds, Smartwatch, Charger, Fidget Set and the Titanium Clicker are AI-generated placeholders; names, prices and categories for the four live products come from the public catalog. Orders, customers and staff are fictional.</p>
            </div>
          )}
        </div>
      </Container>
      <Modal open={modal} onClose={() => setModal(false)} title="Dialog" sub="Scale-in 280 ms, scrim fade, Esc to close" footer={<><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button onClick={() => setModal(false)}>Confirm</Button></>}><p className="text-sm text-slate-600">Dialogs become bottom sheets on mobile and keep a sticky footer for primary actions.</p></Modal>
    </div>
  );
}
