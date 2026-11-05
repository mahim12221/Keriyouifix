import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button, Field, Input, Segmented, Select, Textarea } from "../../ui";
import { Logo } from "../../ui/Logo";

function Shell({ role, title, sub, children }: { role: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-ink-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_20%,rgba(6,182,212,0.18),transparent_70%)]" />
        <Logo onDark size={30} className="relative" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-brand-300"><ShieldCheck className="size-3.5" />{role} access</span>
          <h2 className="mt-5 max-w-sm text-4xl font-extrabold leading-tight tracking-tight">Run Keriyo with clarity.</h2>
          <p className="mt-3 max-w-sm text-slate-400">Orders, payments, couriers and fraud checks — in one calm workspace.</p>
        </div>
        <p className="relative text-xs text-slate-500">Secure member authentication & management portal</p>
      </div>
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft className="size-4" />Back to storefront</Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div className="mb-8 lg:hidden"><Logo size={28} /></div>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AdminLogin() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  return (
    <Shell role="Admin" title="Admin console" sub="Sign in to the executive management portal.">
      <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setBusy(true); setTimeout(() => navigate("/admin/dashboard"), 700); }}>
        <Field label="Admin email"><Input type="email" defaultValue="admin@keriyo.com" /></Field>
        <Field label="Admin password"><div className="relative"><Input type={show ? "text" : "password"} defaultValue="password" className="pr-10" /><button type="button" onClick={() => setShow((s) => !s)} aria-label="Toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></Field>
        <Button type="submit" size="lg" full loading={busy}>Sign in to admin console</Button>
      </form>
      <Link to="/staff-login" className="mt-6 text-sm font-semibold text-brand-700 hover:underline">Staff member? Go to staff portal →</Link>
    </Shell>
  );
}

export function StaffLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "req">("in");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  if (sent)
    return (
      <Shell role="Staff" title="Request submitted" sub="Your staff account request has been sent to Admin.">
        <div className="anim-rise mt-8 rounded-2xl bg-emerald-50 p-6 text-sm leading-relaxed text-emerald-900"><CheckCircle2 className="mb-3 size-7 text-emerald-600" />Admin has received an email notification and in-app alert. You'll be able to sign in once Admin approves your request.</div>
        <Button className="mt-6" variant="secondary" onClick={() => (setSent(false), setMode("in"))}>Back to sign in</Button>
      </Shell>
    );
  return (
    <Shell role="Staff" title="Keriyo staff portal" sub="Secure member authentication & management portal.">
      <Segmented className="mt-7 w-full [&>button]:flex-1" value={mode} onChange={setMode} options={[{ value: "in", label: "Staff sign in" }, { value: "req", label: "Request access" }]} />
      <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setBusy(true); setTimeout(() => { setBusy(false); mode === "in" ? navigate("/staff/dashboard") : setSent(true); }, 700); }}>
        {mode === "req" && <Field label="Full name *"><Input required placeholder="e.g. Al-Amin Chowdhury" /></Field>}
        <Field label={mode === "in" ? "Work email address" : "Work email *"}><Input required type="email" placeholder="staff@keriyo.com" defaultValue={mode === "in" ? "rafi@keriyo.com" : ""} /></Field>
        {mode === "req" && <Field label="Phone number *"><Input required placeholder="01711223344" /></Field>}
        <Field label={mode === "in" ? "Password" : "Password *"}><Input required type="password" placeholder="••••••••" defaultValue={mode === "in" ? "password" : ""} /></Field>
        {mode === "req" && (<><Field label="Requested role"><Select><option>Sales Executive</option><option>Courier Support Agent</option><option>Product Content Staff</option><option>Manager</option></Select></Field><Field label="Note for admin (optional)"><Textarea placeholder="Briefly state your role or reason for access…" /></Field></>)}
        <Button type="submit" size="lg" full loading={busy}>{mode === "in" ? "Sign in to staff workspace" : "Submit access request"}</Button>
      </form>
    </Shell>
  );
}
