import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { Check, Search, Star, X, ImageOff } from "lucide-react";
import { cn } from "@/utils/cn";
import { Emblem } from "./Logo";

/* ---------------------------------------------------------------- Button */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "brand" | "secondary" | "ghost" | "danger" | "dark";
  size?: "sm" | "md" | "lg";
  full?: boolean;
  loading?: boolean;
};
const btnVariant: Record<string, string> = {
  primary: "bg-ink-900 text-white hover:bg-ink-700 shadow-sm",
  dark: "bg-white text-ink-900 hover:bg-slate-100",
  brand: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary: "bg-white text-slate-800 border border-line hover:bg-stone-50 hover:border-stone-300",
  ghost: "text-slate-700 hover:bg-stone-200/60",
  danger: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50",
};
const btnSize: Record<string, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
};
export function Button({ variant = "primary", size = "md", full, loading, className, children, disabled, ...p }: BtnProps) {
  return (
    <button
      {...p}
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center justify-center whitespace-nowrap rounded-[var(--radius-control)] font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        btnVariant[variant],
        btnSize[size],
        full && "w-full",
        className,
      )}
    >
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
export function IconButton({ className, children, label, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...p}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-current transition-colors hover:bg-black/5 active:scale-95 cursor-pointer",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* ----------------------------------------------------------------- Badge */
const tones = {
  neutral: "bg-stone-100 text-stone-700",
  brand: "bg-brand-50 text-brand-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
  info: "bg-sky-50 text-sky-700",
  violet: "bg-violet-50 text-violet-700",
  dark: "bg-ink-900 text-white",
};
export type Tone = keyof typeof tones;
export function Badge({ tone = "neutral", children, dot, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-semibold leading-5", tones[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
export const statusTone: Record<string, Tone> = {
  "Order Placed": "neutral",
  Confirmed: "info",
  Packaging: "violet",
  "In Courier": "warning",
  "Out for delivery": "brand",
  Delivered: "success",
  Cancelled: "danger",
  Returned: "danger",
  Pending: "warning",
  Verified: "success",
  Rejected: "danger",
  Paid: "success",
  COD: "neutral",
  Contacted: "info",
  Recovered: "success",
  Lost: "danger",
  Active: "success",
  Delivered_sms: "success",
  Failed: "danger",
  Sent: "success",
};
export const StatusBadge = ({ status }: { status: string }) => (
  <Badge tone={statusTone[status] ?? "neutral"} dot>
    {status}
  </Badge>
);

/* ----------------------------------------------------------------- Forms */
export function Field({ label, hint, children, className }: { label?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      {label && <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">{label}</span>}
      {children}
      {hint && <span className="mt-1.5 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}
const control =
  "w-full rounded-[var(--radius-control)] border border-stone-300/80 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-[border-color,box-shadow] duration-150 hover:border-stone-400 focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:bg-stone-50";
export function Input({ className, icon, ...p }: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  if (icon)
    return (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
        <input {...p} className={cn(control, "h-10 pl-9", className)} />
      </div>
    );
  return <input {...p} className={cn(control, "h-10", className)} />;
}
export function Select({ className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...p} className={cn(control, "h-10 cursor-pointer appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748b%22 stroke-width=%222.2%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9", className)}>
      {children}
    </select>
  );
}
export function Textarea({ className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={cn(control, "min-h-24 py-2.5", className)} />;
}
export function SearchInput({ className, ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <Input {...p} icon={<Search className="size-4" />} className={className} />;
}
export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 cursor-pointer", checked ? "bg-brand-600" : "bg-stone-300")}
    >
      <span className={cn("absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200", checked && "translate-x-4")} />
    </button>
  );
}
export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-700">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn("grid size-[18px] place-items-center rounded-[5px] border transition-colors", checked ? "border-brand-600 bg-brand-600 text-white" : "border-stone-300 bg-white")}
      >
        {checked && <Check className="size-3" strokeWidth={3.5} />}
      </button>
      {label}
    </label>
  );
}

/* ------------------------------------------------------ Segmented / Tabs */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div className={cn("inline-flex rounded-[var(--radius-control)] bg-stone-200/60 p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-[8px] font-semibold transition-all duration-200 cursor-pointer",
            size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3.5 text-[13px]",
            value === o.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { value: T; label: ReactNode; count?: number }[];
  className?: string;
}) {
  return (
    <div className={cn("no-scrollbar flex gap-6 overflow-x-auto border-b border-line", className)}>
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={cn(
            "relative flex shrink-0 items-center gap-2 pb-3 text-sm font-semibold transition-colors cursor-pointer",
            value === t.value ? "text-slate-900" : "text-slate-500 hover:text-slate-800",
          )}
        >
          {t.label}
          {t.count !== undefined && <span className="rounded-full bg-stone-100 px-1.5 text-[11px] text-slate-600">{t.count}</span>}
          <span className={cn("absolute inset-x-0 -bottom-px h-0.5 origin-left rounded bg-brand-600 transition-transform duration-300", value === t.value ? "scale-x-100" : "scale-x-0")} />
        </button>
      ))}
    </div>
  );
}
export function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full border px-4 text-[13px] font-semibold transition-all duration-200 cursor-pointer",
        active ? "border-ink-900 bg-ink-900 text-white" : "border-stone-300/80 bg-white text-slate-700 hover:border-stone-400",
      )}
    >
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- Layout */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
/** A flat surface. Use sparingly — most content sits directly on the page. */
export function Surface({ className, children, pad = true }: { className?: string; children: ReactNode; pad?: boolean }) {
  return <div className={cn("rounded-[var(--radius-card)] border border-line bg-white shadow-card", pad && "p-5", className)}>{children}</div>;
}
export function SectionHeading({ eyebrow, title, sub, action, className }: { eyebrow?: string; title: string; sub?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-7 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-xl">
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">{eyebrow}</p>}
        <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[30px]">{title}</h2>
        {sub && <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
export function PageHeader({ title, sub, actions, crumb }: { title: string; sub?: string; actions?: ReactNode; crumb?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {crumb && <p className="mb-1 text-xs font-semibold text-slate-500">{crumb}</p>}
        <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 sm:text-2xl">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-sm text-slate-500">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
export function Stat({ label, value, delta, hint, icon }: { label: string; value: string; delta?: string; hint?: string; icon?: ReactNode }) {
  const up = delta?.startsWith("+");
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-500">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 flex items-baseline gap-2">
        <span className="tnum text-2xl font-extrabold tracking-tight text-slate-900">{value}</span>
        {delta && <span className={cn("text-xs font-bold", up ? "text-emerald-600" : "text-rose-600")}>{delta}</span>}
      </div>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
export function EmptyState({ icon, title, sub, action }: { icon?: ReactNode; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-stone-100 text-slate-500">{icon}</div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {sub && <p className="mt-1.5 max-w-sm text-sm text-slate-500">{sub}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function Avatar({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span
      className={cn("inline-grid shrink-0 place-items-center rounded-full font-bold text-white", className)}
      style={{ width: size, height: size, fontSize: size * 0.38, background: `hsl(${hue} 38% 38%)` }}
    >
      {initials}
    </span>
  );
}
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}
export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-slate-700">
      <Star className="fill-amber-400 text-amber-400" style={{ width: size, height: size }} />
      {value.toFixed(1)}
      {count !== undefined && <span className="font-medium text-slate-500">({count})</span>}
    </span>
  );
}
export const money = (n: number) => "৳" + Math.round(n).toLocaleString("en-US");

/* ----------------------------------------------------------- Product img */
export function Img({ src, alt, className, imgClass }: { src?: string; alt: string; className?: string; imgClass?: string }) {
  const [bad, setBad] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-tile", className)}>
      {!src || bad ? (
        <div className="absolute inset-0 grid place-items-center text-stone-300">
          <Emblem size={42} onDark={false} className="opacity-30" />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setBad(true)}
          className={cn("zoom-img absolute inset-0 size-full object-contain mix-blend-multiply", imgClass)}
        />
      )}
    </div>
  );
}
export { ImageOff };

/* ------------------------------------------------------- Table helpers */
export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("thin-scroll overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  );
}
export const Th = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <th className={cn("whitespace-nowrap border-b border-line px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500", className)}>{children}</th>
);
export const Td = ({ children, className, ...p }: { children?: ReactNode; className?: string } & React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td {...p} className={cn("border-b border-line/70 px-4 py-3 align-middle text-slate-700", className)}>
    {children}
  </td>
);
export const Tr = ({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) => (
  <tr onClick={onClick} className={cn("transition-colors hover:bg-stone-50/80", onClick && "cursor-pointer", className)}>
    {children}
  </tr>
);

/* --------------------------------------------------------- Overlay: Modal / Drawer */
function useLock(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
}
export function Modal({
  open,
  onClose,
  title,
  sub,
  children,
  footer,
  width = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  sub?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  useLock(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-end sm:place-items-center">
      <div className="anim-fade absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={cn("anim-scale relative flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-pop sm:rounded-2xl", width)} role="dialog" aria-modal>
        {title && (
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
            <div>
              <h3 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h3>
              {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
            </div>
            <IconButton label="Close" onClick={onClose} className="-mr-2 -mt-1 size-9 text-slate-500">
              <X className="size-5" />
            </IconButton>
          </div>
        )}
        <div className="thin-scroll flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-stone-50/60 px-6 py-3.5 sm:rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  );
}
export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  children,
  footer,
  width = "max-w-md",
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  side?: "left" | "right";
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  useLock(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80]">
      <div className="anim-fade absolute inset-0 bg-ink-950/45" onClick={onClose} />
      <aside
        className={cn("absolute inset-y-0 flex w-full flex-col bg-white shadow-pop", width, side === "right" ? "right-0 anim-drawer-r" : "left-0 anim-drawer-l")}
        role="dialog"
        aria-modal
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="text-base font-extrabold tracking-tight text-slate-900">{title}</div>
          <IconButton label="Close" onClick={onClose} className="-mr-2 size-9 text-slate-500">
            <X className="size-5" />
          </IconButton>
        </div>
        <div className="thin-scroll flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-line bg-white p-5">{footer}</div>}
      </aside>
    </div>
  );
}

/* ---------------------------------------------------------------- Toast */
type ToastCtx = { push: (msg: string) => void };
const ToastContext = createContext<ToastCtx>({ push: () => {} });
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);
  const push = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, msg }]);
    setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 2600);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[120] flex flex-col items-center gap-2 px-4">
        {items.map((i) => (
          <div key={i.id} className="anim-rise pointer-events-auto flex items-center gap-2.5 rounded-full bg-ink-900 py-2.5 pl-3 pr-5 text-sm font-semibold text-white shadow-pop">
            <span className="grid size-5 place-items-center rounded-full bg-brand-500 text-ink-950">
              <Check className="size-3" strokeWidth={3.5} />
            </span>
            {i.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* --------------------------------------------------------------- Reveal */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = Tag as "div";
  return (
    <T ref={ref} className={cn("reveal", className)} style={{ ["--d" as string]: `${delay}ms` }}>
      {children}
    </T>
  );
}

/** Simple dropdown popover */
export function Popover({ trigger, children, align = "right", width = "w-72", up }: { trigger: (o: boolean, toggle: () => void) => ReactNode; children: (close: () => void) => ReactNode; align?: "left" | "right"; width?: string; up?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", h);
    window.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", h);
      window.removeEventListener("keydown", k);
    };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      {trigger(open, () => setOpen((o) => !o))}
      {open && (
        <div className={cn("anim-scale absolute z-50 rounded-xl border border-line bg-white text-slate-800 shadow-lift", up ? "bottom-full mb-2" : "top-full mt-2", width, align === "right" ? (up ? "right-0 origin-bottom-right" : "right-0 origin-top-right") : up ? "left-0 origin-bottom-left" : "left-0 origin-top-left")}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}
