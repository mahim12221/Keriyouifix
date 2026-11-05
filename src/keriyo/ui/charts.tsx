import { useId, useState } from "react";
import { cn } from "@/utils/cn";

/** Lightweight SVG charts — no chart library, no layout thrash. */

export function AreaChart({ data, height = 220, color = "#0891b2", format = (n: number) => String(n), labels }: { data: number[]; height?: number; color?: string; format?: (n: number) => string; labels?: string[] }) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = height;
  const pad = { t: 14, b: 22, l: 4, r: 4 };
  const max = Math.max(...data) * 1.12 || 1;
  const x = (i: number) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const pts = data.map((v, i) => [x(i), y(v)] as const);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  // smooth curve
  const smooth = pts.reduce((acc, p, i, a) => {
    if (i === 0) return `M${p[0]} ${p[1]}`;
    const prev = a[i - 1];
    const cx = (prev[0] + p[0]) / 2;
    return acc + ` C${cx} ${prev[1]}, ${cx} ${p[1]}, ${p[0]} ${p[1]}`;
  }, "");
  const area = `${smooth} L${x(data.length - 1)} ${H - pad.b} L${x(0)} ${H - pad.b} Z`;
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} preserveAspectRatio="none" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={pad.t + g * (H - pad.t - pad.b)} y2={pad.t + g * (H - pad.t - pad.b)} stroke="#e7e5e4" strokeDasharray="3 5" />
        ))}
        <path d={area} fill={`url(#${id})`} />
        <path d={smooth || line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <rect key={i} x={p[0] - (W / data.length) / 2} y={0} width={W / data.length} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
        ))}
        {hover !== null && (
          <>
            <line x1={pts[hover][0]} x2={pts[hover][0]} y1={pad.t} y2={H - pad.b} stroke={color} strokeOpacity="0.3" />
            <circle cx={pts[hover][0]} cy={pts[hover][1]} r="4.5" fill="#fff" stroke={color} strokeWidth="2.2" />
          </>
        )}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lift" style={{ left: `${(pts[hover][0] / W) * 100}%` }}>
          {labels?.[hover] && <span className="mr-1.5 text-slate-400">{labels[hover]}</span>}
          {format(data[hover])}
        </div>
      )}
      {labels && (
        <div className="mt-1 flex justify-between text-[11px] font-medium text-slate-400">
          <span>{labels[0]}</span>
          <span>{labels[Math.floor(labels.length / 2)]}</span>
          <span>{labels[labels.length - 1]}</span>
        </div>
      )}
    </div>
  );
}

export function BarChart({ data, labels, height = 140, color = "#0891b2", highlight }: { data: number[]; labels?: string[]; height?: number; color?: string; highlight?: number }) {
  const max = Math.max(...data) || 1;
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="group relative flex h-full flex-1 items-end">
            <div
              className="w-full origin-bottom rounded-t-[5px] transition-opacity duration-200 group-hover:opacity-100"
              style={{ height: `${Math.max(4, (v / max) * 100)}%`, background: color, opacity: highlight === i ? 1 : 0.72 }}
            />
            <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-ink-900 px-1.5 py-0.5 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">{v}</span>
          </div>
        ))}
      </div>
      {labels && (
        <div className="mt-1.5 flex gap-1.5 text-center text-[11px] font-medium text-slate-400">
          {labels.map((l, i) => (
            <span key={i} className="flex-1">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Donut({ parts, size = 148, center }: { parts: { label: string; value: number; color: string }[]; size?: number; center?: { big: string; small: string } }) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  const r = 52;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f0ee" strokeWidth="14" />
        {parts.map((p) => {
          const len = (p.value / total) * C;
          const el = <circle key={p.label} cx="70" cy="70" r={r} fill="none" stroke={p.color} strokeWidth="14" strokeDasharray={`${Math.max(0, len - 2)} ${C}`} strokeDashoffset={-acc} strokeLinecap="butt" />;
          acc += len;
          return el;
        })}
      </svg>
      {center && (
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-xl font-extrabold leading-none text-slate-900">{center.big}</div>
            <div className="mt-1 text-[11px] font-semibold text-slate-500">{center.small}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Heatmap({ weeks = 26 }: { weeks?: number }) {
  // deterministic pseudo-random sample
  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    const trend = 0.3 + (i / (weeks * 7)) * 0.7;
    return v * trend;
  });
  const shade = (v: number) => (v < 0.12 ? "bg-stone-100" : v < 0.3 ? "bg-brand-100" : v < 0.5 ? "bg-brand-300" : v < 0.7 ? "bg-brand-500" : "bg-brand-700");
  return (
    <div className="thin-scroll overflow-x-auto pb-1">
      <div className="grid grid-flow-col grid-rows-7 gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks}, 14px)` }}>
        {cells.map((v, i) => (
          <div key={i} className={cn("size-[14px] rounded-[3px]", shade(v))} />
        ))}
      </div>
    </div>
  );
}

export function Progress({ value, tone = "brand" }: { value: number; tone?: "brand" | "success" | "warning" | "danger" }) {
  const c = { brand: "bg-brand-600", success: "bg-emerald-500", warning: "bg-amber-500", danger: "bg-rose-500" }[tone];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
      <div className={cn("h-full origin-left rounded-full", c)} style={{ width: `${Math.min(100, value)}%`, animation: "k-bar 0.9s var(--ease-out-soft) both" }} />
    </div>
  );
}
