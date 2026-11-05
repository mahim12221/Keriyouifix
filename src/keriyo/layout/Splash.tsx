import { useEffect, useRef, useState } from "react";
import { Emblem } from "../ui/Logo";

/**
 * Branded intro that hands off to the home hero.
 *
 * 1. Splash uses the SAME ink colour + glow as the hero, so there is no "page change".
 * 2. Emblem draws in (0.9s) → wordmark fades up.
 * 3. At ~1.5s the logo FLIPs (transform only) into the navbar logo slot (#brand-logo-target)
 *    while the overlay dissolves and the hero content staggers in.
 * Total ≈ 2.3s, GPU-only properties, skippable with a click, once per session.
 */
export function Splash({ onDone }: { onDone: () => void }) {
  const root = document.documentElement;
  const wrap = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const [fly, setFly] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    root.dataset.intro = "playing";
    const t = setTimeout(go, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function go() {
    if (started.current) return;
    started.current = true;
    const el = logo.current;
    const target = document.getElementById("brand-logo-target");
    if (el && target) {
      const a = el.getBoundingClientRect();
      const b = target.getBoundingClientRect();
      const s = b.width / a.width;
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      el.style.transition = "transform 0.85s cubic-bezier(0.65, 0, 0.2, 1)";
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${s})`;
    }
    root.dataset.intro = "fly";
    setFly(true);
    setTimeout(() => {
      root.dataset.intro = "ready";
    }, 700);
    setTimeout(() => {
      onDone();
    }, 1050);
  }

  return (
    <div
      ref={wrap}
      onClick={go}
      className="fixed inset-0 z-[200] cursor-pointer"
      style={{ pointerEvents: fly ? "none" : "auto" }}
      role="status"
      aria-label="Loading Keriyo"
    >
      {/* Same ink + glow as the hero, dissolves on hand-off */}
      <div
        className="absolute inset-0 bg-ink-950 transition-opacity duration-[800ms] ease-out"
        style={{ opacity: fly ? 0 : 1 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_20%,rgba(6,182,212,0.16),transparent_70%)]" />
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center">
          <div ref={logo} className="will-change-transform">
            <div className="flex items-center" style={{ gap: 66 * (10 / 28) }}>
              <Emblem size={66} onDark draw />
              <span
                className="font-extrabold tracking-[0.18em] text-white"
                style={{ fontSize: 66 * 0.58, animation: "k-rise 0.7s 0.55s cubic-bezier(0.22,0.8,0.24,1) both" }}
              >
                KERIYO
              </span>
            </div>
          </div>
          <p
            className="mt-5 text-[11px] font-semibold tracking-[0.3em] text-slate-400 transition-opacity duration-300"
            style={{ opacity: fly ? 0 : 1, animation: fly ? undefined : "k-fade 0.8s 1s ease-out both" }}
          >
            SMART GADGETS &amp; GEAR
          </p>
        </div>
      </div>
    </div>
  );
}
