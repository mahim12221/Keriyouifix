import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Bell, ExternalLink, LogOut, Menu, Search, Store, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar, Badge, IconButton, Popover } from "../ui";
import { Logo } from "../ui/Logo";
import type { LucideIcon } from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon; badge?: string };
export type NavGroup = { label?: string; items: NavItem[] };

function SideNav({ groups, onNav, role }: { groups: NavGroup[]; onNav?: () => void; role: string }) {
  return (
    <div className="flex h-full flex-col bg-ink-950 text-slate-300">
      <div className="flex h-14 shrink-0 items-center justify-between px-5">
        <Logo onDark size={24} />
        <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-300">{role}</span>
      </div>
      <nav className="thin-scroll flex-1 overflow-y-auto px-3 pb-6 pt-2">
        {groups.map((g, i) => (
          <div key={i} className={cn(i > 0 && "mt-5")}>
            {g.label && <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{g.label}</p>}
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it.to}>
                  <NavLink
                    to={it.to}
                    onClick={onNav}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex h-9 items-center gap-3 rounded-lg px-3 text-[13.5px] font-semibold transition-colors",
                        isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-100",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className={cn("absolute -left-3 top-2 h-5 w-[3px] rounded-r bg-brand-400 transition-all duration-300", isActive ? "opacity-100" : "scale-y-0 opacity-0")} />
                        <it.icon className={cn("size-[17px] shrink-0", isActive ? "text-brand-300" : "text-slate-500 group-hover:text-slate-300")} />
                        <span className="flex-1 truncate">{it.label}</span>
                        {it.badge && <span className="rounded-full bg-brand-500 px-1.5 text-[10px] font-extrabold leading-4 text-ink-950">{it.badge}</span>}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link to="/" className="flex h-9 items-center gap-3 rounded-lg px-3 text-[13px] font-semibold text-slate-400 hover:bg-white/5 hover:text-white"><Store className="size-[17px]" />Back to storefront<ExternalLink className="ml-auto size-3.5 opacity-60" /></Link>
      </div>
    </div>
  );
}

export function PanelLayout({ groups, role, user, children }: { groups: NavGroup[]; role: "Admin" | "Staff"; user: { name: string; sub: string }; children: ReactNode }) {
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const current = groups.flatMap((g) => g.items).find((i) => pathname.startsWith(i.to));
  return (
    <div className="min-h-dvh bg-page">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] lg:block"><SideNav groups={groups} role={role} /></aside>
      {menu && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="anim-fade absolute inset-0 bg-ink-950/50" onClick={() => setMenu(false)} />
          <aside className="anim-drawer-l absolute inset-y-0 left-0 w-[280px] max-w-[85vw] shadow-pop">
            <SideNav groups={groups} role={role} onNav={() => setMenu(false)} />
            <button aria-label="Close menu" onClick={() => setMenu(false)} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer"><X className="size-4" /></button>
          </aside>
        </div>
      )}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line bg-page/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <IconButton label="Menu" className="-ml-2 lg:hidden" onClick={() => setMenu(true)}><Menu className="size-5" /></IconButton>
          <div className="hidden items-center gap-2 text-sm font-semibold text-slate-500 sm:flex">{role} <span className="text-slate-300">/</span> <span className="text-slate-900">{current?.label ?? "Overview"}</span></div>
          <div className="ml-auto flex items-center gap-1.5">
            <button className="hidden h-9 w-64 items-center gap-2 rounded-lg border border-stone-300/70 bg-white px-3 text-sm text-slate-400 transition-colors hover:border-stone-400 md:flex cursor-pointer" onClick={() => navigate(groups[0].items[0].to)}><Search className="size-4" />Search orders, phones, SKUs…</button>
            <Popover width="w-80" trigger={(_, t) => <IconButton label="Notifications" onClick={t}><Bell className="size-5 text-slate-600" /><span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-rose-500 ring-2 ring-page" /></IconButton>}>
              {() => (
                <div className="p-2">
                  <p className="px-3 py-2 text-sm font-extrabold">Alerts</p>
                  {[["New web order KR-10482", "2 min ago"], ["bKash TrxID awaiting review", "14 min ago"], role === "Admin" ? ["Staff access request: Al-Amin", "2 h ago"] : ["Order KR-10480 assigned to you", "1 h ago"]].map(([t, w]) => (
                    <div key={t} className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-stone-50"><span className="mt-1.5 size-2 rounded-full bg-brand-500" /><div><p className="text-[13px] font-semibold">{t}</p><p className="text-xs text-slate-500">{w}</p></div></div>
                  ))}
                </div>
              )}
            </Popover>
            <Popover width="w-56" trigger={(_, t) => <button onClick={t} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-stone-200/60 cursor-pointer"><Avatar name={user.name} size={30} /><span className="hidden text-left leading-tight sm:block"><span className="block text-[13px] font-bold">{user.name}</span><span className="block text-[11px] text-slate-500">{user.sub}</span></span></button>}>
              {(close) => (
                <div className="p-1.5 text-sm">
                  <Link to="/" onClick={close} className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium hover:bg-stone-100"><Store className="size-4" />Storefront</Link>
                  <Link to={role === "Admin" ? "/staff/dashboard" : "/admin/dashboard"} onClick={close} className="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium hover:bg-stone-100"><ExternalLink className="size-4" />Switch to {role === "Admin" ? "staff" : "admin"} panel</Link>
                  <button onClick={() => navigate(role === "Admin" ? "/admin-login" : "/staff-login")} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"><LogOut className="size-4" />Sign out</button>
                </div>
              )}
            </Popover>
          </div>
        </header>
        <main key={pathname} className="page-enter mx-auto max-w-[1360px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
export { Badge };
