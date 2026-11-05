import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, Bot, Headset, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Emblem } from "../ui/Logo";

type Msg = { from: "me" | "bot"; text: string };
const suggestions = ["Which EDC toy is best for focus?", "How does COD work?", "Do you replace faulty items?"];
const answers: Record<string, string> = {
  default: "Happy to help! Tell me what you're looking for — a gadget, a case for your phone, or a fidget toy — and I'll point you to the right product.",
  edc: "For focus, the Cyberpunk EDC Clicker Titanium is our favourite — a quiet magnetic slider that's satisfying to use at a desk.",
  cod: "Cash on Delivery is available nationwide. Place your order, verify the OTP, and pay the rider when you receive the parcel.",
  replace: "Yes — every product has a 7-day replacement guarantee for manufacturing defects. Contact support with your order ID.",
};
const pick = (t: string) => (/edc|focus|toy|fidget/i.test(t) ? answers.edc : /cod|cash/i.test(t) ? answers.cod : /replac|faulty|warranty/i.test(t) ? answers.replace : answers.default);

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<null | "ai" | "human">(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const lifted = pathname.startsWith("/product/") || pathname.startsWith("/place-order") || pathname.startsWith("/checkout");

  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "end" }), [msgs, typing]);
  const choose = (m: "ai" | "human") => {
    setMode(m);
    setMsgs([{ from: "bot", text: m === "ai" ? "Welcome to Keriyo AI! Ask me about gadgets, EDC picks or delivery." : "You're connected to Keriyo Support. An agent will reply shortly — how can we help?" }]);
  };
  const send = (t = text) => {
    if (!t.trim() || typing) return;
    setMsgs((m) => [...m, { from: "me", text: t }]);
    setText("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", text: mode === "ai" ? pick(t) : "Thanks — we've noted that. An agent will join in a moment." }]);
    }, 900);
  };

  return (
    <div className={cn("fixed right-4 z-[60] transition-[bottom] duration-300 sm:right-6", lifted ? "bottom-24 lg:bottom-6" : "bottom-5 sm:bottom-6")}>
      {open && (
        <div className="anim-scale absolute bottom-16 right-0 flex h-[min(540px,calc(100dvh-8rem))] w-[calc(100vw-2rem)] max-w-[370px] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-pop">
          <div className="flex items-center gap-3 bg-ink-950 px-4 py-3.5 text-white">
            {mode && (
              <button onClick={() => setMode(null)} aria-label="Back" className="-ml-1 grid size-8 place-items-center rounded-full hover:bg-white/10 cursor-pointer"><ArrowLeft className="size-4" /></button>
            )}
            <span className="grid size-9 place-items-center rounded-full bg-white/10"><Emblem size={18} onDark /></span>
            <div className="flex-1">
              <p className="text-sm font-extrabold leading-tight">{mode === "ai" ? "Keriyo AI" : "Keriyo Support"}</p>
              <p className="flex items-center gap-1.5 text-xs text-slate-400"><span className="size-1.5 rounded-full bg-emerald-400" />{mode === "ai" ? "Instant answers, 24/7" : "Usually replies in minutes"}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="grid size-8 place-items-center rounded-full hover:bg-white/10 cursor-pointer"><X className="size-4" /></button>
          </div>

          {!mode ? (
            <div className="flex-1 bg-stone-50 p-4">
              <p className="mb-1 text-base font-extrabold">How can we help?</p>
              <p className="mb-4 text-sm text-slate-500">Choose the fastest way to get an answer.</p>
              {[
                { m: "human" as const, icon: <Headset className="size-5" />, t: "Live human support", d: "Orders, warranty & shipping", tag: "NEW" },
                { m: "ai" as const, icon: <Sparkles className="size-5" />, t: "Keriyo AI", d: "Gadget guides & instant FAQs" },
              ].map((o) => (
                <button key={o.m} onClick={() => choose(o.m)} className="mb-3 flex w-full items-center gap-3.5 rounded-xl border border-line bg-white p-3.5 text-left transition-all hover:border-brand-500/50 hover:shadow-lift cursor-pointer">
                  <span className="grid size-10 place-items-center rounded-full bg-brand-50 text-brand-700">{o.icon}</span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-sm font-bold">{o.t}{o.tag && <span className="rounded-full bg-brand-600 px-1.5 py-px text-[10px] font-extrabold text-white">{o.tag}</span>}</span>
                    <span className="text-xs text-slate-500">{o.d}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="thin-scroll flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4">
                {msgs.map((m, i) => (
                  <div key={i} className={cn("anim-rise flex", m.from === "me" && "justify-end")}>
                    <p className={cn("max-w-[84%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed", m.from === "me" ? "rounded-br-md bg-ink-900 text-white" : "rounded-bl-md border border-line bg-white text-slate-800")}>{m.text}</p>
                  </div>
                ))}
                {mode === "ai" && msgs.length === 1 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => send(s)} className="rounded-full border border-brand-500/30 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50 cursor-pointer">{s}</button>
                    ))}
                  </div>
                )}
                {typing && (
                  <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3">
                    {[0, 1, 2].map((i) => <span key={i} className="size-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                )}
                <div ref={end} />
              </div>
              <form onSubmit={(e) => (e.preventDefault(), send())} className="flex items-center gap-2 border-t border-line bg-white p-3">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === "ai" ? "Ask about gadgets…" : "Type a message…"} className="h-10 flex-1 rounded-full bg-stone-100 px-4 text-sm outline-none focus:ring-2 focus:ring-brand-500/30" />
                <button type="submit" disabled={!text.trim()} aria-label="Send" className="grid size-10 place-items-center rounded-full bg-brand-600 text-white transition-all hover:bg-brand-700 active:scale-95 disabled:opacity-40 cursor-pointer"><Send className="size-4" /></button>
              </form>
            </>
          )}
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-label="Support chat" className="group flex h-12 items-center gap-2 rounded-full bg-ink-900 pl-4 pr-4 text-sm font-bold text-white shadow-lift transition-all hover:bg-ink-700 active:scale-95 cursor-pointer sm:pr-5">
        {open ? <X className="size-5" /> : mode === "ai" ? <Bot className="size-5" /> : <MessageCircle className="size-5" />}
        <span className="hidden sm:inline">{open ? "Close" : "Support"}</span>
      </button>
    </div>
  );
}
