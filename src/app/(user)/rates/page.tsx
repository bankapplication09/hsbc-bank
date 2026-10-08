"use client";

import { useMemo, useState } from "react";
import { formatGBP } from "@/lib/money";
import { PageHeader } from "@/components/ui";

const RATES = [
  { code: "EUR", name: "Euro", rate: 1.18 },
  { code: "USD", name: "US dollar", rate: 1.32 },
  { code: "AED", name: "UAE dirham", rate: 4.85 },
  { code: "INR", name: "Indian rupee", rate: 110.4 },
];

export default function RatesPage() {
  const [pounds, setPounds] = useState("100");
  const [code, setCode] = useState("EUR");
  const selected = RATES.find((rate) => rate.code === code) ?? RATES[0];
  const converted = useMemo(() => {
    const value = Number(pounds);
    if (!Number.isFinite(value) || value < 0) return null;
    return (value * selected.rate).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [pounds, selected]);

  return (
    <div>
      <PageHeader title="Rates" back="/home" />
      <div className="space-y-4 px-5">
        <p className="text-sm text-neutral-500">Indicative HSBC UK rates.</p>
        <section className="rounded-2xl bg-white p-4 ring-1 ring-line">
          <label className="block text-sm font-medium">
            Amount in pounds
            <input
              value={pounds}
              onChange={(event) => setPounds(event.target.value)}
              inputMode="decimal"
              className="mt-1 h-12 w-full rounded-lg border border-line px-3"
            />
          </label>
          <label className="mt-3 block text-sm font-medium">
            Currency
            <select value={code} onChange={(event) => setCode(event.target.value)} className="mt-1 h-12 w-full rounded-lg border border-line px-3">
              {RATES.map((rate) => (
                <option key={rate.code} value={rate.code}>
                  {rate.name}
                </option>
              ))}
            </select>
          </label>
          <p className="mt-4 text-sm text-neutral-500">{Number.isFinite(Number(pounds)) ? formatGBP(Number(pounds).toFixed(2)) : "£0.00"} converts to</p>
          <p className="text-3xl font-semibold tracking-tight">
            {converted ?? "—"} {selected.code}
          </p>
        </section>
        <ul className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          {RATES.map((rate) => (
            <li key={rate.code} className="flex items-center justify-between border-b border-line px-4 py-3 last:border-b-0">
              <span>
                <span className="block text-sm font-medium">{rate.code}</span>
                <span className="text-xs text-neutral-500">{rate.name}</span>
              </span>
              <span className="text-sm font-semibold">{rate.rate.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
