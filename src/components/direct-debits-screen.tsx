"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { ApiError, api } from "@/lib/client";
import { Button, EmptyState, ErrorState, PageHeader, SelectField, TextField } from "@/components/ui";
import { useToast } from "@/components/providers";

type Debit = { id: string; name: string; amount: string; nextDate: string; reference: string | null; accountName: string };

export function DirectDebitsScreen({
  items,
  accounts,
}: {
  items: Debit[];
  accounts: { id: string; name: string }[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState("");

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    try {
      await api("/api/direct-debits", {
        method: "POST",
        body: JSON.stringify({
          accountId: data.get("accountId"),
          name: data.get("name"),
          amount: data.get("amount"),
          nextDate: data.get("nextDate"),
          reference: data.get("reference") || undefined,
        }),
      });
      toast("Direct debit saved");
      event.currentTarget.reset();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not save the direct debit");
    }
  }

  async function cancel(id: string) {
    if (!window.confirm("Cancel this direct debit?")) return;
    await api(`/api/direct-debits/${id}`, { method: "DELETE" });
    toast("Direct debit cancelled");
    router.refresh();
  }

  return (
    <div>
      <PageHeader title="Direct debits" back="/home" />
      <div className="space-y-4 px-5">
        {error ? <ErrorState message={error} /> : null}
        {items.length === 0 ? <EmptyState title="No direct debits" body="Regular bills you set up will be listed here." /> : null}
        <ul className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0">
              <span>
                <span className="block text-sm font-medium">{item.name}</span>
                <span className="text-xs text-neutral-500">
                  {item.accountName} · next {formatDate(item.nextDate)}
                  {item.reference ? ` · ${item.reference}` : ""}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-semibold">{formatGBP(item.amount)}</span>
                <button type="button" className="text-xs font-semibold text-brand" onClick={() => cancel(item.id)}>
                  Cancel
                </button>
              </span>
            </li>
          ))}
        </ul>
        <form onSubmit={add} className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-line">
          <h2 className="font-semibold">New direct debit</h2>
          <SelectField label="Account" name="accountId" defaultValue={accounts[0]?.id}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </SelectField>
          <TextField label="Company" name="name" required />
          <TextField label="Amount" name="amount" inputMode="decimal" required />
          <TextField label="Next collection" name="nextDate" type="date" required />
          <TextField label="Reference" name="reference" maxLength={18} />
          <Button type="submit" className="w-full">
            Save direct debit
          </Button>
        </form>
      </div>
    </div>
  );
}
