"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  Bell,
  CircleHelp,
  FileText,
  Home,
  Landmark,
  PieChart,
  PiggyBank,
  Repeat,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { clsx } from "clsx";
import { api } from "@/lib/client";
import { HsbcLogo } from "./logo";

const userLinks = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/accounts", label: "Accounts", icon: Landmark },
  { href: "/payments", label: "Payments", icon: ArrowLeftRight },
  { href: "/transactions", label: "Transactions", icon: ScrollText },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const desktopExtra = [
  { href: "/insights", label: "Insights", icon: PieChart },
  { href: "/direct-debits", label: "Direct debits", icon: Repeat },
  { href: "/goals", label: "Goals", icon: PiggyBank },
  { href: "/statements", label: "Statements", icon: FileText },
  { href: "/help", label: "Help", icon: CircleHelp },
  { href: "/settings", label: "Settings", icon: Settings },
];

function active(pathname: string, href: string) {
  return href === "/home" ? pathname === "/home" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Wordmark({ large = false, onDark = false }: { large?: boolean; onDark?: boolean }) {
  return <HsbcLogo onDark={onDark} size={large ? 112 : 80} />;
}

export function UserShell({
  name,
  unread,
  children,
}: {
  name: string;
  unread: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await api("/api/auth/logout", { method: "POST", body: "{}" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-mist text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-white px-4 py-6 md:flex">
        <Wordmark />
        <p className="mt-6 truncate px-2 text-sm text-neutral-500">{name}</p>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {[...userLinks, ...desktopExtra].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                active(pathname, item.href) ? "bg-red-50 text-brand" : "text-neutral-700 hover:bg-neutral-50",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <button type="button" onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700">
          <LogOut size={18} />
          Log off
        </button>
      </aside>
      <div className="md:pl-60">
        <div className="mx-auto min-h-dvh w-full max-w-3xl pb-24 md:pb-10">{children}</div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {userLinks.map((item) => {
            const on = active(pathname, item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} className={clsx("flex flex-col items-center gap-1 py-2 text-[10px] font-medium", on ? "text-brand" : "text-neutral-500")}>
                  <span className={clsx("h-0.5 w-6 rounded-full", on ? "bg-brand" : "bg-transparent")} />
                  <item.icon size={18} />
                  {item.label}
                  {item.href === "/profile" && unread > 0 ? <span className="sr-only">{unread} unread notifications</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <Link
        href="/notifications"
        className="fixed right-4 top-4 z-40 grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm ring-1 ring-line md:right-[max(1rem,calc(50%-24rem))]"
        aria-label={unread ? `${unread} unread notifications` : "Notifications"}
      >
        <Bell size={18} />
        {unread > 0 ? (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </Link>
    </div>
  );
}

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/audit-logs", label: "Audit log", icon: ScrollText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ name, children }: { name: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await api("/api/auth/logout", { method: "POST", body: "{}" });
    router.replace("/login");
    router.refresh();
  }
  return (
    <div className="min-h-dvh bg-mist text-ink md:flex">
      <aside className="border-b border-line bg-neutral-950 text-white md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col md:border-b-0 md:px-4 md:py-6">
        <div className="flex items-center justify-between px-4 py-4 md:block md:px-0">
          <Wordmark onDark />
          <p className="mt-2 hidden text-xs text-neutral-400 md:block">Staff · {name}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:mt-6 md:flex-col md:px-0">
          {adminLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                active(pathname, item.href) ? "bg-white text-neutral-950" : "text-neutral-300 hover:bg-white/10",
              )}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
          <button type="button" onClick={logout} className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm text-neutral-300 md:mt-auto">
            <LogOut size={16} />
            Log off
          </button>
        </nav>
      </aside>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:ml-60 md:px-8">{children}</div>
    </div>
  );
}
