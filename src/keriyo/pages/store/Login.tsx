import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button, Field, Input, Segmented, useToast } from "../../ui";
import { Logo } from "../../ui/Logo";

export default function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [forgot, setForgot] = useState(false);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => (setBusy(false), forgot ? (toast.push("Password updated"), setForgot(false)) : navigate("/profile")), 800);
  };
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-ink-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_20%,rgba(6,182,212,0.18),transparent_70%)]" />
        <Link to="/" className="relative"><Logo onDark size={30} /></Link>
        <div className="relative max-w-md">
          <p className="text-3xl font-extrabold leading-snug tracking-tight">“We don't just sell gadgets; we curate tools that spark excitement and bring everyday utility.”</p>
          <p className="mt-5 text-sm font-semibold text-slate-400">Mahim Afridi · Founder</p>
        </div>
        <p className="relative text-xs text-slate-500">© 2026 Keriyo · Dhaka, Bangladesh</p>
      </div>

      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link to="/" className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft className="size-4" />Back to store</Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <div className="lg:hidden mb-8"><Logo size={28} /></div>
          <h1 className="text-3xl font-extrabold tracking-tight">{forgot ? "Reset password" : mode === "in" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-slate-500">{forgot ? "We'll email you a 6-digit code to set a new password." : "Sign in to track orders and check out faster."}</p>

          {!forgot && <Segmented className="mt-7 w-full [&>button]:flex-1" value={mode} onChange={setMode} options={[{ value: "in", label: "Sign in" }, { value: "up", label: "Create account" }]} />}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "up" && !forgot && <Field label="Full name"><Input required placeholder="Your name" /></Field>}
            <Field label="Email address"><Input required type="email" placeholder="you@example.com" /></Field>
            {(mode === "up" || forgot) && (
              <Field label="6-digit email OTP code">
                <div className="flex gap-2"><Input required placeholder="123456" inputMode="numeric" maxLength={6} className="tnum tracking-[0.3em]" /><Button type="button" variant="secondary" onClick={() => (setSent(true), toast.push("Code sent to your email"))}>{sent ? "Resend" : "Send code"}</Button></div>
              </Field>
            )}
            <Field label={forgot ? "New password (min 8 characters)" : "Password"}>
              <div className="relative"><Input required type={show ? "text" : "password"} placeholder="••••••••" className="pr-10" /><button type="button" onClick={() => setShow((s) => !s)} aria-label="Toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer">{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
            </Field>
            {mode === "in" && !forgot && <div className="text-right"><button type="button" onClick={() => setForgot(true)} className="text-[13px] font-semibold text-brand-700 hover:underline cursor-pointer">Forgot password?</button></div>}
            <Button type="submit" size="lg" full loading={busy}>{forgot ? "Update password" : mode === "in" ? "Sign in" : "Create account"}</Button>
          </form>

          {forgot ? (
            <button onClick={() => setForgot(false)} className="mt-6 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">← Back to login</button>
          ) : (
            <>
              <div className="my-6 flex items-center gap-3 text-xs font-semibold text-slate-400"><span className="h-px flex-1 bg-line" />OR<span className="h-px flex-1 bg-line" /></div>
              <Button variant="secondary" size="lg" full onClick={() => navigate("/profile")}>
                <svg viewBox="0 0 24 24" className="size-5"><path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z" /><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2.1v2.8A11 11 0 0 0 12 23z" /><path fill="#FBBC05" d="M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.6-2.8z" /><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.6 2.8C6.6 7.400 9.100 5.400 12 5.400z" /></svg>
                Continue with Google
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
