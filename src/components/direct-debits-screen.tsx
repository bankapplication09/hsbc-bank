"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Repeat } from "lucide-react";
import { formatDate } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { billPayCategories } from "@/lib/explore-visuals";
import { ApiError, api } from "@/lib/client";
import { BankingPageIntro } from "@/components/page-intro";
import { MetricCard, MetricGrid } from "@/components/banking/metrics";
import { Button, EmptyState, ErrorState, PageHeader, SectionHeader, SelectField, TextField } from "@/components/ui";
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
  const [filter, setFilter] = useState("");

  const dueTotal = useMemo(() => items.reduce((s, i) => s + Number(i.amount), 0), [items]);
  const filtered = items.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase()));

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
    <div className="md:pt-2">
      <PageHeader title="Direct debits" back="/home" />
      <div className="space-y-4 px-4 pb-10 md:px-0">
        <BankingPageIntro
          title="Direct debits & bill pay"
          description="Active mandates, upcoming collection dates, and bill categories linked to your accounts."
          icon={Repeat}
          imageSrc="/ui/hero-payments.svg"
        />
        <MetricGrid>
          <MetricCard label="Active mandates" value={String(items.length)} />
          <MetricCard label="Next collections total" value={formatGBP(dueTotal.toFixed(2))} hint="Sum of listed amounts" tone="brand" />
          <MetricCard label="Accounts" value={String(accounts.length)} />
        </MetricGrid>
        {error ? <ErrorState message={error} /> : null}
        <TextField label="Search mandates" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Company name" />
        {filtered.length === 0 ? (
          <EmptyState title="No direct debits" body="Regular bills you set up will be listed here with next collection dates." />
        ) : (
          <ul className="panel overflow-hidden p-0">
            {filtered.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0">
                <span>
                  <span className="block text-sm font-medium text-charcoal">{item.name}</span>
                  <span className="text-xs text-muted">
                    {item.accountName} · next {formatDate(item.nextDate)}
                    {item.reference ? ` · ${item.reference}` : ""}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-sm font-semibold tabular-nums">{formatGBP(item.amount)}</span>
                  <button type="button" className="text-xs font-semibold text-brand" onClick={() => cancel(item.id)}>
                    Cancel
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <section className="panel p-4">
          <SectionHeader title="Bill categories" description="Set up a mandate for each biller." />
          <div className="grid gap-2 sm:grid-cols-3">
            {billPayCategories.map((cat) => (
              <span key={cat.id} className="rounded-md border border-line bg-mist/50 px-3 py-2 text-xs font-medium text-charcoal">
                {cat.label}
              </span>
            ))}
          </div>
          <Link href="/explore/bill-pay" className="mt-3 inline-block text-sm font-semibold text-brand">
            Bill pay overview
          </Link>
        </section>
        <form onSubmit={add} className="panel space-y-3 p-4">
          <h2 className="font-semibold text-charcoal">New direct debit</h2>
          <SelectField label="Account" name="accountId" defaultValue={accounts[0]?.id}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </SelectField>
          <TextField label="Company" name="name" required />
          <TextField label="Amount (£)" name="amount" inputMode="decimal" required />
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
