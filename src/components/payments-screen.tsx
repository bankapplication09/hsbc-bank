"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatSortCode } from "@/lib/format";
import { ApiError, api } from "@/lib/client";
import { Button, ErrorState, PageHeader, TextField } from "./ui";
import { useToast } from "./providers";

type Account = { id: string; name: string; accountNumber: string; sortCode: string; availableBalance: string };

export function PaymentsScreen({ accounts, hidden }: { accounts: Account[]; hidden: boolean }) {
  const params = useSearchParams();
  const initial = params.get("mode") === "receive" ? "receive" : "transfer";
  const [mode, setMode] = useState<"transfer" | "receive">(initial);
  const tabs = [
    ["transfer", "Transfer"],
    ["receive", "Receive"],
  ] as const;

  return (
    <div>
      <PageHeader title="Payments" />
      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${mode === id ? "bg-neutral-950 text-white" : "bg-white ring-1 ring-line"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {mode === "transfer" ? <TransferForm /> : null}
        {mode === "receive" ? <ReceiveDetails accounts={accounts} hidden={hidden} /> : null}
      </div>
    </div>
  );
}

function TransferForm() {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api("/api/transfers", {
        method: "POST",
        body: JSON.stringify({
          fromAccountNumber: data.get("fromAccountNumber"),
          toAccountNumber: data.get("toAccountNumber"),
          amount: data.get("amount"),
          reference: data.get("reference") || undefined,
        }),
      });
      toast("Transfer complete");
      router.push("/home");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Transfer failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-line">
      {error ? <ErrorState message={error} /> : null}
      <TextField label="From account number" name="fromAccountNumber" inputMode="numeric" minLength={8} maxLength={8} placeholder="8 digits" required />
      <TextField label="To account number" name="toAccountNumber" inputMode="numeric" minLength={8} maxLength={8} placeholder="8 digits" required />
      <TextField label="Amount" name="amount" inputMode="decimal" placeholder="0.00" required />
      <TextField label="Reference" name="reference" maxLength={18} />
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Moving…" : "Confirm transfer"}
      </Button>
    </form>
  );
}

function ReceiveDetails({ accounts, hidden }: { accounts: Account[]; hidden: boolean }) {
  const toast = useToast();
  const primary = accounts[0];
  const text = useMemo(() => {
    if (!primary) return "";
    return `Sort code ${formatSortCode(primary.sortCode)}\nAccount ${primary.accountNumber}\nName on account`;
  }, [primary]);
  if (!primary) return null;
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-line">
      <h2 className="text-base font-semibold">Share these details</h2>
      <p className="mt-1 text-sm text-neutral-500">Share these details to receive a payment into this account.</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-neutral-500">Sort code</dt>
          <dd className="font-medium">{hidden ? "••-••-••" : formatSortCode(primary.sortCode)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-500">Account number</dt>
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
        Copy details
      </Button>
    </section>
  );
}
