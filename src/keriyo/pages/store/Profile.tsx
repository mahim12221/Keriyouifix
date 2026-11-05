import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, LogOut, Mail, MapPin, Phone, Shield } from "lucide-react";
import { Avatar, Button, Container, Field, Input, Textarea, useToast } from "../../ui";
import { useCart } from "../../store/cart";

export default function Profile() {
  const { count } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  return (
    <Container className="max-w-5xl pb-8 pt-24 sm:pt-28">
      <div className="flex flex-wrap items-center gap-5">
        <div className="group relative">
          <Avatar name="Tanvir Ahmed" size={84} />
          <button aria-label="Change profile picture" onClick={() => toast.push("Upload dialog opens here")} className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-white shadow-lift ring-1 ring-line hover:bg-stone-50 cursor-pointer"><Camera className="size-4" /></button>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Tanvir Ahmed</h1>
          <p className="text-slate-500">Member since January 2026</p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/login")}><LogOut className="size-4" />Log out</Button>
      </div>

      <dl className="mt-10 grid grid-cols-3 divide-x divide-line border-y border-line py-5 text-center sm:text-left">
        {[["Orders placed", "4"], ["Items in cart", String(count)], ["Total logins", "12"]].map(([k, v]) => (
          <div key={k} className="px-4 sm:px-6 first:pl-0"><dt className="text-[13px] font-semibold text-slate-500">{k}</dt><dd className="tnum mt-1 text-3xl font-extrabold">{v}</dd></div>
        ))}
      </dl>

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_300px]">
        <div className="space-y-12">
          <section>
            <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-extrabold tracking-tight">Personal information</h2>{!edit ? <Button size="sm" variant="secondary" onClick={() => setEdit(true)}>Edit</Button> : <div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => setEdit(false)}>Cancel</Button><Button size="sm" onClick={() => (setEdit(false), toast.push("Profile saved"))}>Save</Button></div>}</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name"><Input disabled={!edit} defaultValue="Tanvir Ahmed" /></Field>
              <Field label="Phone number"><Input disabled={!edit} defaultValue="01711223344" /></Field>
              <Field label="Email"><Input disabled defaultValue="tanvir@example.com" /></Field>
              <Field label="Default delivery address" className="sm:col-span-2"><Textarea disabled={!edit} defaultValue="House 12/A, Road 4, Sector 7, Uttara, Dhaka" className="min-h-20" /></Field>
            </div>
          </section>
          <section>
            <h2 className="mb-5 text-xl font-extrabold tracking-tight">Security</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Current password"><Input type="password" placeholder="••••••••" /></Field>
              <Field label="New password" hint="Minimum 8 characters"><Input type="password" placeholder="••••••••" /></Field>
            </div>
            <Button className="mt-4" variant="secondary" onClick={() => toast.push("Password updated")}><Shield className="size-4" />Update password</Button>
          </section>
        </div>

        <aside className="h-fit rounded-2xl bg-stone-100/70 p-6">
          <h3 className="font-extrabold">Need help with an order?</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">Support answers within minutes for tracking, returns and gadget questions.</p>
          <ul className="mt-5 space-y-3 text-sm font-semibold">
            <li className="flex items-center gap-2.5"><Phone className="size-4 text-brand-700" />01880172859</li>
            <li className="flex items-center gap-2.5"><Mail className="size-4 text-brand-700" />contact@keriyo.com</li>
            <li className="flex items-center gap-2.5"><MapPin className="size-4 text-brand-700" />Dhaka, Bangladesh</li>
          </ul>
          <Link to="/orders"><Button className="mt-6" full>View order history</Button></Link>
        </aside>
      </div>
    </Container>
  );
}
