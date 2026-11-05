import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button, Container, Reveal, SectionHeading, useToast } from "../../ui";

const emblem = (stem: string, wing: string, core: string) =>
  `<rect width="11" height="68" rx="5.5" fill="${stem}"/><path d="M22 34 L49.5 9 C51.8 6.5 56 8.2 56 11.5 L56 17.5 C56 19.8 54.8 22 53.2 23.5 L31 43 Z" fill="#06b6d4"/><path d="M22 34 L53.2 64.5 C54.8 66 56 68.2 56 70.5 L56 76.5 C56 79.8 51.8 81.5 49.5 79 L22 52 Z" fill="${wing}"/><circle cx="27" cy="42.5" r="5" fill="#22d3ee" stroke="${core}" stroke-width="2"/>`;
const text = (x: number, y: number, size: number, fill: string, anchor = "start", ls = 0.18) =>
  `<text x="${x}" y="${y}" font-family="Manrope, Arial, sans-serif" font-weight="800" font-size="${size}" letter-spacing="${size * ls}" text-anchor="${anchor}" fill="${fill}">KERIYO</text>`;

type Asset = { id: string; name: string; bg: string; w: number; h: number; svg: string };
const assets: Asset[] = [
  { id: "h-dark", name: "Horizontal · dark background", bg: "#0b1220", w: 360, h: 120, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120"><rect width="360" height="120" fill="#0b1220"/><g transform="translate(40 17) scale(0.9)">${emblem("#f1f5f9", "#e2e8f0", "#0b1220")}</g>${text(122, 72, 40, "#fff")}</svg>` },
  { id: "h-light", name: "Horizontal · light background", bg: "#ffffff", w: 360, h: 120, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120"><rect width="360" height="120" fill="#fff"/><g transform="translate(40 17) scale(0.9)">${emblem("#0f172a", "#334155", "#fff")}</g>${text(122, 72, 40, "#0f172a")}</svg>` },
  { id: "v", name: "Vertical stacked", bg: "#f7f7f5", w: 200, h: 200, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f7f7f5"/><g transform="translate(78 28) scale(0.95)">${emblem("#0f172a", "#334155", "#f7f7f5")}</g>${text(100, 150, 24, "#0f172a", "middle")}<text x="100" y="172" font-family="Manrope, Arial" font-weight="700" font-size="8" letter-spacing="2.4" text-anchor="middle" fill="#64748b">SMART GADGETS &amp; GEAR</text></svg>` },
  { id: "seal", name: "Round packaging seal", bg: "#ecebe9", w: 200, h: 200, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="#0b1220"/><circle cx="100" cy="100" r="82" fill="none" stroke="#06b6d4" stroke-width="1.5"/><g transform="translate(78 44) scale(0.85)">${emblem("#f1f5f9", "#e2e8f0", "#0b1220")}</g>${text(100, 148, 18, "#fff", "middle")}</svg>` },
  { id: "strip", name: "Tamper box seal strip", bg: "#ecebe9", w: 360, h: 70, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 70"><rect width="360" height="70" rx="6" fill="#06b6d4"/>${[0, 1, 2].map((i) => `<g transform="translate(${28 + i * 118} 14) scale(0.5)">${emblem("#0b1220", "#0b1220", "#06b6d4")}</g>${text(60 + i * 118, 42, 14, "#0b1220")}`).join("")}</svg>` },
  { id: "badge", name: "Die-cut badge sticker", bg: "#ecebe9", w: 200, h: 200, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect x="14" y="14" width="172" height="172" rx="44" fill="#0f172a" stroke="#0891b2" stroke-width="3"/><g transform="translate(70 40) scale(1.1)">${emblem("#f1f5f9", "#e2e8f0", "#0f172a")}</g></svg>` },
  { id: "box-f", name: "Retail box · front", bg: "#ecebe9", w: 200, h: 260, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect width="200" height="260" rx="10" fill="#0b1220"/><rect x="0" y="206" width="200" height="54" fill="#06b6d4"/><g transform="translate(72 52) scale(1.05)">${emblem("#f1f5f9", "#e2e8f0", "#0b1220")}</g>${text(100, 168, 22, "#fff", "middle")}<text x="100" y="238" font-family="Manrope, Arial" font-weight="800" font-size="10" letter-spacing="3" text-anchor="middle" fill="#0b1220">100% GENUINE GEAR</text></svg>` },
  { id: "box-b", name: "Retail box · back & warranty", bg: "#ecebe9", w: 200, h: 260, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260"><rect width="200" height="260" rx="10" fill="#f7f7f5" stroke="#e7e5e4"/><g transform="translate(20 20) scale(0.4)">${emblem("#0f172a", "#334155", "#f7f7f5")}</g>${text(60, 46, 14, "#0f172a")}${["7-DAY REPLACEMENT WARRANTY", "Inspected before dispatch", "Hotline 01880172859", "contact@keriyo.com"].map((t, i) => `<text x="20" y="${100 + i * 28}" font-family="Manrope, Arial" font-weight="${i ? 500 : 800}" font-size="${i ? 10 : 9.5}" fill="${i ? "#475569" : "#0891b2"}">${t}</text>`).join("")}</svg>` },
];

const colors = [["Ink 950", "#0b1220"], ["Ink 900", "#0f172a"], ["Brand 600", "#0891b2"], ["Brand 500", "#06b6d4"], ["Brand 400", "#22d3ee"], ["Tile", "#ecebe9"], ["Page", "#f7f7f5"]];

export default function BrandAssets() {
  const toast = useToast();
  const [copied, setCopied] = useState("");
  const dl = (a: Asset) => {
    const url = URL.createObjectURL(new Blob([a.svg], { type: "image/svg+xml" }));
    const l = document.createElement("a");
    l.href = url;
    l.download = `keriyo-${a.id}.svg`;
    l.click();
    URL.revokeObjectURL(url);
    toast.push("SVG downloaded");
  };
  const cp = (a: Asset) => {
    navigator.clipboard?.writeText(a.svg).catch(() => {});
    setCopied(a.id);
    toast.push("SVG code copied");
    setTimeout(() => setCopied(""), 1600);
  };
  return (
    <Container className="pb-8 pt-24 sm:pt-28">
      <SectionHeading eyebrow="Brand & packaging kit" title="Official brand assets" sub="Vector logos, stickers and packaging covers. 100% scalable — download or copy the raw SVG." />
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a, i) => (
          <Reveal key={a.id} delay={(i % 3) * 70}>
            <div className="group">
              <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl p-6 ring-1 ring-line transition-shadow group-hover:shadow-lift" style={{ background: a.bg === "#ffffff" ? "#fff" : a.bg === "#0b1220" ? "#070d18" : "#ecebe9" }}>
                <div className="max-h-full max-w-full transition-transform duration-500 group-hover:scale-[1.03]" style={{ width: Math.min(a.w, 260), aspectRatio: `${a.w}/${a.h}` }} dangerouslySetInnerHTML={{ __html: a.svg.replace("<svg ", '<svg style="width:100%;height:100%;border-radius:8px" ') }} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <p className="text-sm font-bold">{a.name}</p>
                <div className="flex gap-1.5"><Button size="sm" variant="secondary" onClick={() => dl(a)} aria-label="Download SVG"><Download className="size-3.5" />SVG</Button><Button size="sm" variant="secondary" onClick={() => cp(a)} aria-label="Copy SVG">{copied === a.id ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}</Button></div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-20 grid gap-14 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Colour</h2>
          <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-7">
            {colors.map(([n, h]) => (<button key={h} onClick={() => (navigator.clipboard?.writeText(h), toast.push(`${h} copied`))} className="text-left cursor-pointer"><span className="block aspect-square rounded-xl ring-1 ring-black/5 transition-transform hover:scale-105" style={{ background: h }} /><span className="mt-2 block text-[11px] font-bold leading-tight">{n}</span><span className="tnum text-[11px] text-slate-500">{h}</span></button>))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Typography</h2>
          <p className="mt-5 text-5xl font-extrabold tracking-tight">Aa Manrope</p>
          <p className="mt-2 text-sm text-slate-500">Display & UI · 500 / 600 / 700 / 800. Bangla set in Hind Siliguri — <span className="text-base text-slate-900">অর্ডার সম্পন্ন করুন</span></p>
        </div>
      </div>
    </Container>
  );
}
