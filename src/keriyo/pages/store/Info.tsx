import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Clock, Mail, MapPin, MessageCircle, Phone, Truck, ShieldCheck, Globe } from "lucide-react";
import { Button, Container, Field, Input, Reveal, Textarea, useToast } from "../../ui";
import { Emblem } from "../../ui/Logo";

function PageIntro({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_0%,rgba(6,182,212,0.16),transparent_70%)]" />
      <Container className="relative pb-16 pt-32 sm:pb-20 sm:pt-40">
        <p className="anim-rise text-xs font-bold uppercase tracking-[0.16em] text-brand-400">{eyebrow}</p>
        <h1 className="anim-rise mt-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl" style={{ animationDelay: "70ms" }}>{title}</h1>
        <p className="anim-rise mt-4 max-w-xl text-lg text-slate-300" style={{ animationDelay: "140ms" }}>{sub}</p>
      </Container>
    </section>
  );
}

export function About() {
  return (
    <>
      <PageIntro eyebrow="Keriyo tech story" title="The story behind everyday innovations." sub="Smart gadgets, EDC fidget gear and tech essentials — curated with care." />
      <Container className="grid gap-12 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal>
          <div className="relative aspect-[4/5] max-w-md overflow-hidden rounded-3xl bg-ink-900 p-10 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_30%_20%,rgba(6,182,212,0.25),transparent_70%)]" />
            <Emblem size={52} onDark className="relative" />
            <div className="absolute inset-x-10 bottom-10">
              <p className="text-xl font-bold leading-snug">“We don't just sell gadgets; we curate tools, fidget toys, and devices that spark excitement, enhance productivity, and bring everyday utility.”</p>
              <p className="mt-5 text-sm font-semibold text-slate-400">Mahim Afridi · Founder</p>
            </div>
          </div>
        </Reveal>
        <div className="space-y-10 self-center">
          <Reveal><p className="text-lg leading-relaxed text-slate-600">Every product in the Keriyo collection is rigorously tested for durability, tactile responsiveness and build perfection — so you receive only the finest gear.</p></Reveal>
          {[
            { i: BadgeCheck, t: "Original build & tech integrity", d: "Precision-machined metal EDC toys, tested magnetic mechanisms and authentic certified electronic components built to last." },
            { i: Truck, t: "Fast direct dispatch", d: "Swift order processing with nationwide doorstep delivery and seamless Cash on Delivery support across all 64 districts." },
            { i: ShieldCheck, t: "7-day customer peace of mind", d: "A transparent replacement guarantee and technical support backed by a direct hotline and WhatsApp." },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 80}>
              <div className="flex gap-5"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700"><x.i className="size-6" /></span><div><h3 className="text-lg font-extrabold">{x.t}</h3><p className="mt-1.5 leading-relaxed text-slate-600">{x.d}</p></div></div>
            </Reveal>
          ))}
          <Reveal><Link to="/contact"><Button variant="secondary" size="lg">Connect with Mahim Afridi</Button></Link></Reveal>
        </div>
      </Container>
    </>
  );
}

export function Contact() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <>
      <PageIntro eyebrow="Contact" title="We're always here to help." sub="Have a question about gadgets, EDC gear or your order? Reach us any way you like." />
      <Container className="grid gap-16 py-20 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-9">
          <ul className="space-y-6">
            {[
              [Phone, "Direct phone", "01880172859 · 01742111888"],
              [Mail, "Official email", "contact@keriyo.com"],
              [MapPin, "Headquarters", "Dhaka, Bangladesh"],
              [Clock, "Operational hours", "Saturday – Thursday · 9:00 AM – 10:00 PM (GMT+6)"],
            ].map(([I, k, v]) => { const Icon = I as typeof Phone; return (
              <li key={k as string} className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700"><Icon className="size-5" /></span><div><p className="text-sm font-semibold text-slate-500">{k as string}</p><p className="mt-0.5 font-bold">{v as string}</p></div></li>
            ); })}
          </ul>
          <div className="flex flex-wrap gap-3"><Button size="lg" className="bg-[#25D366] text-white hover:bg-[#1fb857]"><MessageCircle className="size-[18px]" />WhatsApp chat</Button><Button size="lg" variant="secondary"><Globe className="size-[18px]" />Facebook</Button></div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setBusy(true); setTimeout(() => { setBusy(false); toast.push("Message sent — we'll reply soon"); }, 700); }} className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-line sm:p-8">
          <h2 className="text-xl font-extrabold">Send us a message</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Name"><Input required placeholder="Your name" /></Field><Field label="Phone / email"><Input required placeholder="01XXXXXXXXX" /></Field><Field label="Message" className="sm:col-span-2"><Textarea required placeholder="How can we help?" className="min-h-32" /></Field></div>
          <Button type="submit" size="lg" className="mt-6" loading={busy}>Send message</Button>
        </form>
      </Container>
    </>
  );
}

const sections = [
  ["1. Information we collect", "We collect the details you provide when ordering — name, phone number, delivery address and optional email — along with basic device information needed to prevent fraud and deliver accurately."],
  ["2. How we use your data", "Processing, packing and dispatching your gadget and tech orders. Providing shipping notifications and courier tracking updates via SMS or email. Responding to support inquiries by phone or WhatsApp. Improving site performance and catalog browsing."],
  ["3. Payment & security", "We support secure Cash on Delivery (COD) alongside certified payment gateways. We never store or log your sensitive credit card credentials or banking PINs on our servers."],
  ["4. Questions & support", "Contact us at contact@keriyo.com or call 01880172859 and we'll gladly help."],
];
export function Privacy() {
  const [active, setActive] = useState(0);
  return (
    <>
      <PageIntro eyebrow="Legal" title="Privacy policy" sub="How we handle and protect your personal information at Keriyo." />
      <Container className="grid gap-12 py-16 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block"><ul className="sticky top-24 space-y-1 border-l border-line">{sections.map(([t], i) => (<li key={t}><a href={`#s${i}`} onClick={() => setActive(i)} className={`-ml-px block border-l-2 py-1.5 pl-4 text-sm font-semibold transition-colors ${active === i ? "border-brand-600 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-900"}`}>{t}</a></li>))}</ul></nav>
        <article className="max-w-2xl">
          <p className="mb-10 text-sm text-slate-500">Effective 2025–2026 · Last updated for Keriyo</p>
          {sections.map(([t, d], i) => (<section key={t} id={`s${i}`} className="mb-10 scroll-mt-24"><h2 className="text-xl font-extrabold tracking-tight">{t}</h2><p className="mt-3 leading-[1.8] text-slate-600">{d}</p></section>))}
        </article>
      </Container>
    </>
  );
}
