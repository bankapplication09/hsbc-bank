"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftRight,
  Coffee,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Home,
  Receipt,
  Repeat,
  ShoppingBag,
  Smartphone,
  Train,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { formatDateShort, humanise } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { StatusBadge } from "./ui";

const icons: Record<string, LucideIcon> = {
  Groceries: ShoppingBag,
  Salary: Wallet,
  "Eating out": Coffee,
  Bills: Receipt,
  Rent: Home,
  Subscriptions: Smartphone,
  Shopping: ShoppingBag,
  Transport: Train,
  Entertainment: Smartphone,
  Transfer: ArrowLeftRight,
  Refund: Repeat,
  Cash: Wallet,
  Adjustment: Receipt,
  Reversal: Repeat,
};

export function CurrencyAmount({
  amount,
  type,
  hidden,
  size = "sm",
}: {
  amount: string;
  type?: "CREDIT" | "DEBIT";
  hidden?: boolean;
  size?: "sm" | "lg" | "xl";
}) {
  const text = hidden
    ? "£ ••••••"
    : type === "DEBIT"
      ? `-${formatGBP(amount)}`
      : type === "CREDIT"
        ? `+${formatGBP(amount)}`
        : formatGBP(amount);
  return (
    <span
      className={
        size === "xl"
          ? "text-4xl font-semibold tracking-tight text-neutral-950"
          : size === "lg"
            ? "text-2xl font-semibold tracking-tight"
            : type === "CREDIT"
              ? "text-sm font-semibold text-emerald-700"
              : "text-sm font-semibold text-neutral-950"
      }
    >
      {text}
    </span>
  );
}

export function BalanceCard({
  name,
  amount,
  current,
  masked,
  status,
  hidden,
  onToggle,
  href,
}: {
  name: string;
  amount: string;
  current: string;
  masked: string;
  status: string;
  hidden: boolean;
  onToggle: () => void;
  href: string;
}) {
  return (
    <section className="rounded-2xl border border-line bg-white p-5 shadow-[0_8px_24px_rgba(16,16,16,0.04)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-500">{name.toUpperCase()}</p>
          <p className="mt-1 text-xs text-neutral-500">{humanise(status)}</p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="press grid h-10 w-10 place-items-center rounded-full bg-neutral-100 text-neutral-700"
          aria-label={hidden ? "Show balance" : "Hide balance"}
        >
          {hidden ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      <div className="mt-4">
        <CurrencyAmount amount={amount} hidden={hidden} size="xl" />
        <p className="mt-1 text-sm text-neutral-500">Available balance</p>
      </div>
      <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-neutral-400">Current balance</p>
          <p className="mt-0.5 text-sm font-medium">{hidden ? "£ ••••••" : formatGBP(current)}</p>
          <p className="mt-2 font-mono text-sm tracking-wide text-neutral-700">{masked}</p>
        </div>
        <Link href={href} className="text-sm font-semibold text-brand">
          View account
        </Link>
      </div>
    </section>
  );
}

export function QuickActions() {
  const items = [
    { href: "/payments?mode=transfer", label: "Transfer", icon: ArrowLeftRight },
    { href: "/payments?mode=receive", label: "Receive", icon: Wallet },
    { href: "/cards", label: "Cards", icon: CreditCard },
    { href: "/statements", label: "Statements", icon: FileText },
  ];
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className="press flex flex-col items-center gap-2 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand shadow-sm ring-1 ring-line">
            <item.icon size={18} />
          </span>
          <span className="text-[11px] font-medium text-neutral-700">{item.label}</span>
        </Link>
      ))}
    </div>
  );
}

export function TransactionItem({
  id,
  title,
  category,
  date,
  amount,
  type,
  status,
  hidden,
}: {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  type: "CREDIT" | "DEBIT";
  status: string;
  hidden?: boolean;
}) {
  const Icon = icons[category] ?? Receipt;
  return (
    <Link href={`/transactions/${id}`} className="press flex items-center gap-3 px-4 py-3 hover:bg-neutral-50">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-700">
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        <span className="mt-0.5 block text-xs text-neutral-500">
          {formatDateShort(date)} · {category}
        </span>
      </span>
      <span className="text-right">
        <CurrencyAmount amount={amount} type={type} hidden={hidden} />
        <span className="mt-1 block">
          <StatusBadge status={status} />
        </span>
      </span>
    </Link>
  );
}

export function TransactionFilters({ accounts }: { accounts: { id: string; name: string }[] }) {
  const router = useRouter();
  const params = useSearchParams();
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "ALL") next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.push(`?${next.toString()}`);
  }
  const view = params.get("view") ?? "ALL";
  const views = [
    ["ALL", "All"],
    ["IN", "Incoming"],
    ["OUT", "Outgoing"],
    ["PENDING", "Pending"],
    ["COMPLETED", "Completed"],
    ["REVERSED", "Reversed"],
  ] as const;

  return (
    <div className="space-y-3">
      <input
        defaultValue={params.get("q") ?? ""}
        placeholder="Search transactions"
        aria-label="Search transactions"
        className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand"
        onKeyDown={(event) => {
          if (event.key === "Enter") setParam("q", event.currentTarget.value.trim());
        }}
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {views.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setParam("view", value)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${view === value ? "bg-neutral-950 text-white" : "bg-white text-neutral-600 ring-1 ring-line"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select
          aria-label="Account"
          defaultValue={params.get("accountId") ?? ""}
          onChange={(event) => setParam("accountId", event.target.value)}
          className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
        >
          <option value="">All accounts</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Category"
          defaultValue={params.get("category") ?? ""}
          onChange={(event) => setParam("category", event.target.value)}
          className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <input
          type="date"
          aria-label="From date"
          defaultValue={params.get("from") ?? ""}
          onChange={(event) => setParam("from", event.target.value)}
          className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
        />
        <input
          type="date"
          aria-label="To date"
          defaultValue={params.get("to") ?? ""}
          onChange={(event) => setParam("to", event.target.value)}
          className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
        />
        <input
          inputMode="decimal"
          placeholder="Min amount"
          aria-label="Minimum amount"
          defaultValue={params.get("min") ?? ""}
          onBlur={(event) => setParam("min", event.target.value.trim())}
          className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
        />
        <input
          inputMode="decimal"
          placeholder="Max amount"
          aria-label="Maximum amount"
          defaultValue={params.get("max") ?? ""}
          onBlur={(event) => setParam("max", event.target.value.trim())}
          className="h-10 rounded-lg border border-line bg-white px-2 text-sm"
        />
      </div>
    </div>
  );
}
