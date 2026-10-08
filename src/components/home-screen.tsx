"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { firstName, formatDate, greeting } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { ApiError, api } from "@/lib/client";
import { BalanceCard, TransactionItem } from "./bank";
import { HomeServices } from "./home-services";
import { Button, Dialog, EmptyState, ErrorState, TextField } from "./ui";
import { Wordmark } from "./shells";

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
    <div className="rise px-5 pt-5">
      <div className="flex items-center justify-between pr-12">
        <Wordmark />
      </div>
      <p className="mt-6 text-sm text-neutral-500">{greeting()}</p>
      <h1 className="text-2xl font-semibold tracking-tight">{firstName(fullName)}</h1>
      <div className="mt-5">
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
      </div>
      {accounts.length > 1 ? (
        <div className="mt-3 grid gap-2">
          {accounts
            .filter((account) => account.id !== primary?.id)
            .map((account) => (
              <Link key={account.id} href={`/accounts/${account.id}`} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
                <span>
                  <span className="block text-sm font-medium">{account.name}</span>
                  <span className="text-xs text-neutral-500">{account.accountNumberMasked}</span>
                </span>
                <span className="text-sm font-semibold">{hidden ? "£ ••••••" : formatGBP(account.availableBalance)}</span>
              </Link>
            ))}
        </div>
      ) : null}
      <HomeServices />
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Link href="/insights" className="rounded-2xl bg-white p-4 ring-1 ring-line">
          <p className="text-xs text-neutral-500">Spent this month</p>
          <p className="mt-1 text-lg font-semibold">{hidden ? "£ ••••••" : formatGBP(monthSpent)}</p>
        </Link>
        <Link href="/direct-debits" className="rounded-2xl bg-white p-4 ring-1 ring-line">
          <p className="text-xs text-neutral-500">Next direct debit</p>
          <p className="mt-1 truncate text-sm font-semibold">{nextDebit ? nextDebit.name : "None set"}</p>
          <p className="text-xs text-neutral-500">
            {nextDebit ? `${hidden ? "£ ••••••" : formatGBP(nextDebit.amount)} · ${formatDate(nextDebit.nextDate)}` : "Add a bill"}
          </p>
        </Link>
      </div>
      <section className="mt-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent transactions</h2>
          <Link href="/transactions" className="text-sm font-semibold text-brand">
            See all
          </Link>
        </div>
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
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
          <p className="text-sm text-neutral-500">Enter your 4-digit password to show the balance.</p>
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
