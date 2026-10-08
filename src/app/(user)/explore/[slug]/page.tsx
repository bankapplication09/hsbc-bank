"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { findService } from "@/lib/services";
import { Button, EmptyState, PageHeader } from "@/components/ui";

function monthlyRepayment(principal: number, annualRate: number, months: number) {
  const monthly = annualRate / 100 / 12;
  if (monthly === 0) return principal / months;
  const factor = (1 + monthly) ** months;
  return (principal * monthly * factor) / (factor - 1);
}

export default function ExplorePage() {
  const params = useParams<{ slug: string }>();
  const item = findService(params.slug);
  const [amount, setAmount] = useState("5000");
  const [months, setMonths] = useState("36");
  const repayment = useMemo(() => {
    const principal = Number(amount);
    const term = Number(months);
    if (!Number.isFinite(principal) || principal <= 0 || !Number.isFinite(term) || term <= 0) return null;
    return monthlyRepayment(principal, 6.9, term).toLocaleString("en-GB", { style: "currency", currency: "GBP" });
  }, [amount, months]);

  if (!item) {
    return (
      <div>
        <PageHeader title="Not found" back="/home" />
        <div className="px-5">
          <EmptyState title="That service is not listed" body="Go back to home and choose another icon." />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={item.label} back="/home" />
      <div className="space-y-4 px-5">
        <p className="text-sm leading-6 text-neutral-600">{item.summary}</p>
        {item.facts.length > 0 ? (
          <dl className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
            {item.facts.map((fact) => (
              <div key={fact.label} className="flex items-center justify-between border-b border-line px-4 py-3 last:border-b-0">
                <dt className="text-sm text-neutral-500">{fact.label}</dt>
                <dd className="text-sm font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {item.calculator ? (
          <form className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-line" onSubmit={(event) => event.preventDefault()}>
            <label className="block text-sm font-medium">
              Amount
              <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" className="mt-1 h-12 w-full rounded-lg border border-line px-3" />
            </label>
            <label className="block text-sm font-medium">
              Months
              <input value={months} onChange={(event) => setMonths(event.target.value)} inputMode="numeric" className="mt-1 h-12 w-full rounded-lg border border-line px-3" />
            </label>
            <p className="text-sm text-neutral-500">Estimated monthly repayment at 6.9% APR</p>
            <p className="text-2xl font-semibold">{repayment ?? "—"}</p>
          </form>
        ) : null}
        {item.action ? (
          <Link href={item.action.href}>
            <Button type="button" className="w-full">
              {item.action.label}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
