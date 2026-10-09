"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { firstName, formatDate, formatTodayLong, greeting } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { ApiError, api } from "@/lib/client";
import { BalanceCard, QuickActions, TransactionItem } from "./bank";
import { HomeServices } from "./home-services";
import { Button, Dialog, EmptyState, ErrorState, SectionHeader, SecureSessionBadge, TextField } from "./ui";

type Account = {
  id: string;
  name: string;
  accountType: string;
  availableBalance: string;
  currentBalance: string;
  accountNumberMasked: string;
  status: string;
};

type Txn = {
  id: string;
  description: string;
  merchant: string | null;
  category: string;
  transactionDate: string;
  amount: string;
  type: "CREDIT" | "DEBIT";
  status: string;
};

export function HomeScreen({
  fullName,
  hideBalances,
  notifyTransactions,
  notifyStatements,
  accounts,
  transactions,
  monthSpent,
  nextDebit,
}: {
  fullName: string;
  hideBalances: boolean;
  notifyTransactions: boolean;
  notifyStatements: boolean;
  accounts: Account[];
  transactions: Txn[];
  monthSpent: string;
  nextDebit: { name: string; amount: string; nextDate: string } | null;
}) {
  const router = useRouter();
  const [hidden, setHidden] = useState(hideBalances);
  const [askPin, setAskPin] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [busy, setBusy] = useState(false);
  const primary = accounts.find((account) => account.accountType === "SAVINGS") ?? accounts[0];

  async function hide() {
    setHidden(true);
    await api("/api/settings", {
      method: "PATCH",
      body: JSON.stringify({ hideBalances: true, notifyTransactions, notifyStatements }),
    }).catch(() => setHidden(false));
    router.refresh();
  }

  function toggle() {
    if (hidden) {
      setPin("");
      setPinError("");
      setAskPin(true);
      return;
    }
    void hide();
  }

  async function reveal(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setPinError("");
    try {
      await api("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({ hideBalances: false, notifyTransactions, notifyStatements, pin }),
      });
      setHidden(false);
      setAskPin(false);
      router.refresh();
    } catch (cause) {
      setPinError(cause instanceof ApiError ? cause.message : "Could not show the balance");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rise px-4 pt-5 md:px-0 md:pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3 pr-12 md:pr-0">
        <div>
          <p className="text-sm text-muted">{greeting()}</p>
          <h1 className="text-2xl font-semibold tracking-tight text-charcoal md:text-3xl">{firstName(fullName)}</h1>
          <p className="mt-1 text-sm text-muted">{formatTodayLong()}</p>
        </div>
        <div className="md:hidden">
          <SecureSessionBadge />
        </div>
      </div>

      <section className="mt-6">
        {primary ? (
          <BalanceCard
            name={primary.name}
            amount={primary.availableBalance}
            current={primary.currentBalance}
            masked={primary.accountNumberMasked}
            status={primary.status}
            hidden={hidden}
            onToggle={toggle}
            href={`/accounts/${primary.id}`}
          />
        ) : (
          <EmptyState title="No account yet" body="An account will appear here once it is opened." />
        )}
      </section>

      {accounts.length > 1 ? (
        <div className="mt-3 grid gap-2">
          {accounts
            .filter((account) => account.id !== primary?.id)
            .map((account) => (
              <Link
                key={account.id}
                href={`/accounts/${account.id}`}
                className="panel flex items-center justify-between px-4 py-3 transition-colors hover:bg-brand-soft/40"
              >
                <span>
                  <span className="block text-sm font-medium text-charcoal">{account.name}</span>
                  <span className="text-xs text-muted">{account.accountNumberMasked}</span>
                </span>
                <span className="text-sm font-semibold tabular-nums">{hidden ? "£ ••••••" : formatGBP(account.availableBalance)}</span>
              </Link>
            ))}
        </div>
      ) : null}

      <section className="mt-8">
        <SectionHeader title="Quick actions" description="Everyday banking tasks" />
        <QuickActions />
      </section>

      <HomeServices />

      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link href="/insights" className="panel p-4 transition-colors hover:bg-brand-soft/30">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Spent this month</p>
          <p className="mt-2 text-xl font-semibold tabular-nums text-charcoal">{hidden ? "£ ••••••" : formatGBP(monthSpent)}</p>
        </Link>
        <Link href="/direct-debits" className="panel p-4 transition-colors hover:bg-brand-soft/30">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Next direct debit</p>
          <p className="mt-2 truncate text-sm font-semibold text-charcoal">{nextDebit ? nextDebit.name : "None set"}</p>
          <p className="mt-1 text-xs text-muted">
            {nextDebit ? `${hidden ? "£ ••••••" : formatGBP(nextDebit.amount)} · ${formatDate(nextDebit.nextDate)}` : "Add a bill"}
          </p>
        </Link>
      </div>

      <section className="mt-10">
        <SectionHeader
          title="Recent transactions"
          action={
            <Link href="/transactions" className="text-sm font-semibold text-brand hover:underline">
              See all
            </Link>
          }
        />
        <div className="panel overflow-hidden p-0">
          {transactions.length === 0 ? (
            <EmptyState title="No transactions yet" body="Payments and credits will show up here." />
          ) : (
            transactions.map((txn) => (
              <TransactionItem
                key={txn.id}
                id={txn.id}
                title={txn.merchant || txn.description}
                category={txn.category}
                date={txn.transactionDate}
                amount={txn.amount}
                type={txn.type}
                status={txn.status}
                hidden={hidden}
              />
            ))
          )}
        </div>
      </section>

      <Dialog open={askPin} title="4-digit password" onClose={() => setAskPin(false)}>
        <form onSubmit={reveal} className="space-y-3">
          <p className="text-sm text-muted">Enter your 4-digit password to show the balance.</p>
          {pinError ? <ErrorState message={pinError} /> : null}
          <TextField
            label="Password"
            name="pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            minLength={4}
            maxLength={4}
            pattern="[0-9]{4}"
            placeholder="••••"
            value={pin}
            onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
            required
          />
          <Button type="submit" className="w-full" disabled={busy || pin.length !== 4}>
            {busy ? "Checking…" : "Show balance"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
