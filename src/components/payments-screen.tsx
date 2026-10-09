"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { formatSortCode } from "@/lib/format";
import { demoStore } from "@/lib/demo-store";
import { ApiError, api } from "@/lib/client";
import { BankingPageIntro } from "./page-intro";
import { formatDate } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { Button, Card, EmptyState, ErrorState, PageHeader, SectionHeader, SelectField, TextField } from "./ui";
import { useToast } from "./providers";

type Account = { id: string; name: string; accountNumber: string; sortCode: string; availableBalance: string };
type Payee = { id: string; name: string; sortCode: string; accountNumber: string; accountNumberMasked?: string };
type RecentTxn = { id: string; description: string; amount: string; type: string; transactionDate: string };

export function PaymentsScreen({
  accounts,
  payees,
  hidden,
  recent = [],
}: {
  accounts: Account[];
  payees: Payee[];
  hidden: boolean;
  recent?: RecentTxn[];
}) {
  const params = useSearchParams();
  const initial = params.get("mode") === "receive" ? "receive" : "transfer";
  const [mode, setMode] = useState<"transfer" | "receive">(initial);
  const tabs = [
    ["transfer", "Transfer"],
    ["receive", "Receive"],
  ] as const;

  return (
    <div className="md:pt-2">
      <PageHeader title="Payments" />
      <div className="space-y-4 px-4 md:px-0">
        <BankingPageIntro
          title="Move money securely"
          description="Transfer between your savings accounts or share details to receive a payment."
          icon={ArrowLeftRight}
          imageSrc="/ui/hero-payments.svg"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`focus-ring shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                mode === id ? "bg-brand text-white" : "border border-line bg-surface text-charcoal hover:bg-brand-soft/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === "transfer" ? <TransferHub accounts={accounts} payees={payees} recent={recent} hidden={hidden} /> : null}
        {mode === "receive" ? <ReceiveDetails accounts={accounts} hidden={hidden} recent={recent} /> : null}
      </div>
    </div>
  );
}

function TransferHub({
  accounts,
  payees,
  recent,
  hidden,
}: {
  accounts: Account[];
  payees: Payee[];
  recent: RecentTxn[];
  hidden: boolean;
}) {
  const [kind, setKind] = useState<"own" | "payee" | "add-payee">("own");
  const kinds = [
    ["own", "Own accounts"],
    ["payee", "Saved payees"],
    ["add-payee", "Add payee"],
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {kinds.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setKind(id)}
            className={`focus-ring rounded-full px-3 py-1.5 text-xs font-medium ${
              kind === id ? "bg-charcoal text-white" : "bg-mist text-charcoal"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {kind === "own" ? <OwnAccountTransfer accounts={accounts} /> : null}
      {kind === "payee" ? <PayeeTransfer payees={payees} accounts={accounts} /> : null}
      {kind === "add-payee" ? <AddPayeeDemo /> : null}
      {recent.length > 0 ? (
        <Card padding="none">
          <div className="border-b border-line px-4 py-2">
            <SectionHeader title="Recent activity" description="Latest completed entries on your accounts." />
          </div>
          {recent.map((txn) => (
            <Link key={txn.id} href={`/transactions/${txn.id}`} className="flex justify-between border-b border-line px-4 py-3 text-sm last:border-b-0 hover:bg-mist/50">
              <span className="min-w-0 truncate pr-3">{txn.description}</span>
              <span className="shrink-0 font-medium tabular-nums">
                {hidden ? "£ ••••" : formatGBP(txn.amount)}
                <span className="block text-right text-xs font-normal text-muted">{formatDate(txn.transactionDate)}</span>
              </span>
            </Link>
          ))}
        </Card>
      ) : null}
    </div>
  );
}

function OwnAccountTransfer({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<"form" | "review">("form");
  const [from, setFrom] = useState(accounts[0]?.accountNumber ?? "");
  const [to, setTo] = useState(accounts[1]?.accountNumber ?? "");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (accounts.length < 2) {
    return (
      <EmptyState title="Need two accounts" body="Transfers between your own accounts require at least two savings accounts." />
    );
  }

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      await api("/api/transfers", {
        method: "POST",
        body: JSON.stringify({
          fromAccountNumber: from,
          toAccountNumber: to,
          amount,
          reference: reference || undefined,
        }),
      });
      toast("Transfer complete");
      router.push("/transactions");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Transfer failed");
      setStep("form");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Card className="space-y-3">
        {error ? <ErrorState message={error} /> : null}
        {step === "form" ? (
          <>
            <SelectField label="From account" value={from} onChange={(e) => setFrom(e.target.value)}>
              {accounts.map((account) => (
                <option key={account.id} value={account.accountNumber}>
                  {account.name} · {account.accountNumber}
                </option>
              ))}
            </SelectField>
            <SelectField label="To account" value={to} onChange={(e) => setTo(e.target.value)}>
              {accounts.map((account) => (
                <option key={account.id} value={account.accountNumber}>
                  {account.name} · {account.accountNumber}
                </option>
              ))}
            </SelectField>
            <TextField label="Amount (£)" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <TextField label="Reference" value={reference} onChange={(e) => setReference(e.target.value)} maxLength={18} />
            <TextField label="Payment date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
            <p className="text-xs text-muted">Same-day transfers between your accounts are usually available immediately after you confirm.</p>
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                if (!from || !to || from === to || !amount.trim()) {
                  setError("Choose two different accounts and enter an amount.");
                  return;
                }
                setError("");
                setStep("review");
              }}
            >
              Review transfer
            </Button>
          </>
        ) : (
          <>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">From</dt>
                <dd className="font-medium">{from}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">To</dt>
                <dd className="font-medium">{to}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Amount</dt>
                <dd className="font-semibold">£{amount}</dd>
              </div>
              {reference ? (
                <div className="flex justify-between">
                  <dt className="text-muted">Reference</dt>
                  <dd>{reference}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-muted">Date</dt>
                <dd>{formatDate(paymentDate)}</dd>
              </div>
            </dl>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary" onClick={() => setStep("form")}>
                Back
              </Button>
              <Button type="button" disabled={busy} onClick={() => void confirm()}>
                {busy ? "Sending…" : "Confirm"}
              </Button>
            </div>
          </>
        )}
      </Card>
    </>
  );
}

function PayeeTransfer({ payees, accounts }: { payees: Payee[]; accounts: Account[] }) {
  const drafts = demoStore.listPayeeDrafts();
  const all = [...payees, ...drafts.map((d) => ({ id: d.id, name: d.name, sortCode: d.sortCode, accountNumber: d.accountNumber }))];
  return (
    <div className="space-y-3">
      <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        Paying external payees may not be available on savings accounts — save payee details here or use Transfer for moves between your own accounts.
      </p>
      {all.length === 0 ? (
        <EmptyState title="No payees saved" body="Add a payee to store their details for faster payments." />
      ) : (
        <Card padding="none">
          {all.map((payee) => (
            <div key={payee.id} className="border-b border-line px-4 py-3 last:border-b-0">
              <p className="font-medium text-charcoal">{payee.name}</p>
              <p className="text-xs text-muted">
                {formatSortCode(payee.sortCode)} · {payee.accountNumber}
              </p>
            </div>
          ))}
        </Card>
      )}
      {accounts[0] ? (
        <Link href={`/payments?mode=transfer`}>
          <Button type="button" variant="secondary" className="w-full">
            Transfer between own accounts
          </Button>
        </Link>
      ) : null}
    </div>
  );
}

function AddPayeeDemo() {
  const toast = useToast();
  const [name, setName] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [saved, setSaved] = useState(demoStore.listPayeeDrafts());

  return (
    <Card className="space-y-3">
      <p className="text-xs text-muted">Saved on this device for your convenience.</p>
      <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextField label="Sort code" placeholder="00-00-00" value={sortCode} onChange={(e) => setSortCode(e.target.value)} required />
      <TextField label="Account number" inputMode="numeric" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
      <Button
        type="button"
        className="w-full"
        onClick={() => {
          if (!name.trim() || !sortCode.trim() || !accountNumber.trim()) return;
          demoStore.addPayeeDraft({ name: name.trim(), sortCode: sortCode.trim(), accountNumber: accountNumber.trim() });
          setSaved(demoStore.listPayeeDrafts());
          toast("Payee saved");
          setName("");
          setSortCode("");
          setAccountNumber("");
        }}
      >
        Save payee
      </Button>
      {saved.length > 0 ? (
        <ul className="text-sm text-muted">
          {saved.slice(0, 5).map((p) => (
            <li key={p.id}>
              {p.name} · {p.accountNumber}
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}

function ReceiveDetails({ accounts, hidden, recent }: { accounts: Account[]; hidden: boolean; recent: RecentTxn[] }) {
  const toast = useToast();
  const primary = accounts[0];
  const text = useMemo(() => {
    if (!primary) return "";
    return `Sort code ${formatSortCode(primary.sortCode)}\nAccount ${primary.accountNumber}\nName on account`;
  }, [primary]);
  if (!primary) return <EmptyState title="No account" body="Open a savings account to receive payments." />;
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-base font-semibold text-charcoal">Share these details</h2>
        <p className="mt-1 text-sm text-muted">Use these to receive a payment into your savings account.</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Sort code</dt>
            <dd className="font-medium">{hidden ? "••-••-••" : formatSortCode(primary.sortCode)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Account number</dt>
            <dd className="font-medium">{hidden ? "********" : primary.accountNumber}</dd>
          </div>
        </dl>
        <Button
          type="button"
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => {
            void navigator.clipboard.writeText(text);
            toast("Details copied");
          }}
        >
          Copy account details
        </Button>
      </Card>
      {recent.filter((t) => t.type === "CREDIT").length > 0 ? (
        <Card padding="none">
          <div className="border-b border-line px-4 py-2 text-xs font-semibold uppercase text-muted">Recent incoming</div>
          {recent
            .filter((t) => t.type === "CREDIT")
            .slice(0, 5)
            .map((txn) => (
              <Link key={txn.id} href={`/transactions/${txn.id}`} className="block border-b border-line px-4 py-3 text-sm last:border-b-0 hover:bg-mist/50">
                {txn.description} · {hidden ? "£ ••••" : formatGBP(txn.amount)}
              </Link>
            ))}
        </Card>
      ) : null}
      <Link href="/transactions?view=IN">
        <Button type="button" variant="ghost" className="w-full">
          View all incoming transactions
        </Button>
      </Link>
    </div>
  );
}
