import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Headphones, Truck, RefreshCcw, Star, Zap, Smartphone, Gamepad2, Watch } from "lucide-react";
import { Button, Container, Img, Reveal, SectionHeading, money } from "../../ui";
import { getProduct, products, salePrice } from "../../data";
import { ProductCard } from "./ProductCard";

const hero = getProduct("edc-clicker-titanium")!;
const banner = getProduct("air-buds-pro")!;

export default function Home() {
  const fresh = products.filter((p) => p.isNew || p.id === "gan-65w").slice(0, 4);
  const best = products.filter((p) => p.best || p.rating >= 4.8).slice(0, 4);
  return (
    <>
      {/* HERO — same ink + glow as the splash so the intro hands off seamlessly */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_20%,rgba(6,182,212,0.16),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <Container className="relative grid items-center gap-12 pb-20 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-40">
          <div>
            <p className="hero-in inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-4 text-[13px] font-semibold text-slate-300" style={{ ["--d" as string]: "0ms" }}>
              <span className="grid size-5 place-items-center rounded-full bg-brand-500 text-ink-950"><Zap className="size-3" strokeWidth={3} /></span>
              Smart gadgets &amp; everyday EDC
            </p>
            <h1 className="hero-in mt-6 text-[44px] font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-[68px]" style={{ ["--d" as string]: "90ms" }}>
              Everyday <br className="hidden sm:block" />
              innovations<span className="text-brand-400">.</span>
            </h1>
            <p className="hero-in mt-6 max-w-lg text-lg leading-relaxed text-slate-300" style={{ ["--d" as string]: "180ms" }}>
              Precision mechanical clickers, tactile fidget toys, audio gear and everyday essentials — engineered for tactile satisfaction.
            </p>
            <div className="hero-in mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: "270ms" }}>
              <Link to="/collection"><Button variant="dark" size="lg">Explore collection <ArrowRight className="size-4" /></Button></Link>
              <Link to="/about"><Button size="lg" className="bg-white/10 text-white hover:bg-white/15">Our story</Button></Link>
            </div>
            <ul className="hero-in mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-slate-300" style={{ ["--d" as string]: "360ms" }}>
              {[
                [BadgeCheck, "100% genuine gear"],
                [Truck, "Doorstep delivery · COD"],
                [RefreshCcw, "7-day replacement"],
              ].map(([I, t]) => {
                const Icon = I as typeof BadgeCheck;
                return (
                  <li key={t as string} className="flex items-center gap-2"><Icon className="size-[18px] text-brand-400" />{t as string}</li>
                );
              })}
            </ul>
          </div>

          <div className="hero-in relative mx-auto w-full max-w-[520px]" style={{ ["--d" as string]: "200ms" }}>
            <Link to={`/product/${hero.id}`} className="group relative block overflow-hidden rounded-[28px] bg-tile shadow-pop">
              <Img src={hero.img} alt={hero.name} className="aspect-square" imgClass="p-4" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white/90 p-4 backdrop-blur-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Featured innovation</p>
                  <p className="mt-0.5 text-[15px] font-extrabold text-slate-900">{hero.name}</p>
                </div>
                <span className="tnum shrink-0 pl-3 text-base font-extrabold text-slate-900">{money(salePrice(hero))}</span>
              </div>
            </Link>
            <div className="anim-float absolute -left-4 top-10 hidden items-center gap-2.5 rounded-2xl bg-white py-2.5 pl-3 pr-4 shadow-lift sm:flex">
              <span className="grid size-8 place-items-center rounded-full bg-amber-50"><Star className="size-4 fill-amber-400 text-amber-400" /></span>
              <div className="leading-tight"><p className="text-sm font-extrabold text-slate-900">4.9 rating</p><p className="text-xs text-slate-500">38 reviews</p></div>
            </div>
          </div>
        </Container>
      </section>

      {/* CATEGORIES */}
      <Container className="-mt-8 relative z-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { n: "Phone Covers", i: Smartphone, c: "Phone Covers" },
            { n: "Headphones", i: Headphones, c: "Headphones" },
            { n: "EDC & Tactile", i: Zap, c: "EDC Tools & Tactile Gadgets" },
            { n: "Smart Gadgets", i: Watch, c: "Smart Gadgets" },
          ].map((c, i) => (
            <Reveal key={c.n} delay={i * 60}>
              <Link to={`/collection?cat=${encodeURIComponent(c.c)}`} className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-600 group-hover:text-white"><c.i className="size-5" /></span>
                <span className="flex-1 text-sm font-bold">{c.n}</span>
                <ArrowRight className="size-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-700" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* FRESH DROPS */}
      <Container className="pt-20">
        <Reveal>
          <SectionHeading eyebrow="Fresh drops" title="Latest arrivals" sub="Cutting-edge smart gadgets, satisfying EDC fidget toys and everyday gear." action={<Link to="/collection" className="group flex items-center gap-1.5 text-sm font-bold text-brand-700">Shop all <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></Link>} />
        </Reveal>
        <Grid>{fresh.map((p, i) => <Reveal key={p.id} delay={i * 70}><ProductCard p={p} /></Reveal>)}</Grid>
      </Container>

      {/* FEATURE BAND */}
      <Container className="pt-24">
        <Reveal>
          <div className="grid overflow-hidden rounded-[28px] bg-ink-950 text-white lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-400">Our philosophy</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">We curate tools that spark excitement.</h2>
              <p className="mt-4 max-w-md leading-relaxed text-slate-300">Every product is tested for durability, tactile response and build quality — so you only receive gear worth keeping.</p>
              <div className="mt-8 flex items-center gap-4">
                <Link to={`/product/${banner.id}`}><Button variant="dark">Shop {banner.sub.toLowerCase()}</Button></Link>
                <Link to="/about" className="text-sm font-bold text-slate-300 hover:text-white">Read our story</Link>
              </div>
            </div>
            <div className="relative min-h-[300px] bg-tile">
              <Img src={banner.img} alt={banner.name} className="absolute inset-0" imgClass="p-6" />
              <div className="absolute bottom-5 left-5 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-lift">{banner.name.split(" — ")[0]} · {money(salePrice(banner))}</div>
            </div>
          </div>
        </Reveal>
      </Container>

      {/* BEST SELLERS */}
      <Container className="pt-24">
        <Reveal><SectionHeading eyebrow="Community favourites" title="Best sellers" sub="Top-rated products chosen by customers for performance and tactile quality." /></Reveal>
        <Grid>{best.map((p, i) => <Reveal key={p.id} delay={i * 70}><ProductCard p={p} /></Reveal>)}</Grid>
      </Container>

      {/* TRUST */}
      <Container className="pt-24">
        <Reveal>
          <div className="grid gap-8 border-y border-line py-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
            {[
              { i: RefreshCcw, t: "Easy exchange policy", d: "7-day hassle-free replacement on every order." },
              { i: Truck, t: "Express all-BD delivery", d: "Fast dispatch to all 64 districts, with Cash on Delivery." },
              { i: Gamepad2, t: "Dedicated support", d: "Live chat, WhatsApp and hotline — we reply within minutes." },
            ].map((x) => (
              <div key={x.t} className="flex gap-4 md:px-8 md:first:pl-0">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700"><x.i className="size-5" /></span>
                <div><h3 className="font-extrabold">{x.t}</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">{x.d}</p></div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </>
  );
}
const Grid = ({ children }: { children: React.ReactNode }) => <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">{children}</div>;
export { Grid };
