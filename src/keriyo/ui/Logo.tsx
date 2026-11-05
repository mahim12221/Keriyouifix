import { cn } from "@/utils/cn";

/** Keriyo emblem — redrawn from the production favicon.svg (stem + two wings + core). */
export function Emblem({
  size = 32,
  onDark = false,
  draw = false,
  className,
}: {
  size?: number;
  onDark?: boolean;
  draw?: boolean;
  className?: string;
}) {
  const stem = onDark ? "#f1f5f9" : "#0f172a";
  const wing = onDark ? "#e2e8f0" : "#334155";
  const core = onDark ? "#0b1220" : "#ffffff";
  return (
    <svg
      viewBox="0 0 60 84"
      width={size * 0.72}
      height={size}
      className={cn(draw && "logo-draw", className)}
      fill="none"
      aria-hidden
    >
      <rect x="0" y="0" width="11" height="68" rx="5.5" fill={stem} className={draw ? "fillin" : ""} stroke={stem} strokeWidth="0.5" />
      <path
        d="M22 34 L49.5 9 C51.8 6.5 56 8.2 56 11.5 L56 17.5 C56 19.8 54.8 22 53.2 23.5 L31 43 Z"
        fill="#06b6d4"
        stroke="#22d3ee"
        strokeWidth="0.5"
        className={draw ? "fillin" : ""}
      />
      <path
        d="M22 34 L53.2 64.5 C54.8 66 56 68.2 56 70.5 L56 76.5 C56 79.8 51.8 81.5 49.5 79 L22 52 Z"
        fill={wing}
        stroke={wing}
        strokeWidth="0.5"
        className={draw ? "fillin" : ""}
      />
      <circle cx="27" cy="42.5" r="5" fill="#22d3ee" stroke={core} strokeWidth="2" />
    </svg>
  );
}

export function Logo({
  onDark = false,
  size = 28,
  wordmark = true,
  tagline = false,
  className,
}: {
  onDark?: boolean;
  size?: number;
  wordmark?: boolean;
  tagline?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Emblem size={size} onDark={onDark} />
      {wordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn("font-extrabold tracking-[0.18em]", onDark ? "text-white" : "text-ink-900")}
            style={{ fontSize: size * 0.58 }}
          >
            KERIYO
          </span>
          {tagline && (
            <span className={cn("mt-1 text-[9px] font-semibold tracking-[0.22em]", onDark ? "text-slate-400" : "text-slate-500")}>
              SMART GADGETS &amp; GEAR
            </span>
          )}
        </span>
      )}
    </span>
  );
}
