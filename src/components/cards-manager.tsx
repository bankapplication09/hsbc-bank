"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { formatDate } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { ApiError, api } from "@/lib/client";
import { BankingPageIntro } from "@/components/page-intro";
import { MetricCard, MetricGrid } from "@/components/banking/metrics";
import { Button, EmptyState, ErrorState, PageHeader, SectionHeader } from "@/components/ui";
import { HsbcLogo } from "@/components/logo";
import { useToast } from "@/components/providers";

type CardTxn = { id: string; title: string; amount: string; date: string; category: string };

export function CardsManager({
  cards,
  recent,
  hidden,
}: {
  cards: {
    id: string;
    name: string;
    cardLast4: string;
    cardFrozen: boolean;
    accountNumberMasked: string;
    contactlessEnabled: boolean;
    onlineEnabled: boolean;
    atmEnabled: boolean;
    dailyLimit: string;
  }[];
  recent: CardTxn[];
  hidden: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [tab, setTab] = useState<"overview" | "controls" | "activity">("overview");
  const card = cards[0];

  const monthSpend = useMemo(() => {
    const start = new Date();
    start.setDate(1);
    return recent.reduce((sum, txn) => sum + Number(txn.amount), 0);
  }, [recent]);

  const limitNum = Number(card?.dailyLimit ?? 500);
  const utilPct = limitNum > 0 ? Math.min(100, Math.round((monthSpend / limitNum) * 100)) : 0;

  async function toggle(id: string) {
    setBusy(id);
    setError("");
    try {
      await api(`/api/accounts/${id}/card`, { method: "POST", body: "{}" });
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not update the card");
    } finally {
      setBusy("");
    }
  }

  const tabs = [
    ["overview", "Overview"],
    ["controls", "Controls & limits"],
    ["activity", "Card activity"],
  ] as const;

  return (
    <div className="md:pt-2">
      <PageHeader title="Cards" back="/home" />
      <div className="space-y-4 px-4 pb-10 md:px-0">
        <BankingPageIntro
          title="Debit cards"
          description="View card artwork, spending summary, recent card transactions, and security controls."
          icon={CreditCard}
          imageSrc="/ui/hero-cards.svg"
        />
        {error ? <ErrorState message={error} /> : null}
        {cards.length === 0 ? (
          <EmptyState title="No cards" body="A debit card appears with a savings account." />
        ) : (
          <>
            <MetricGrid>
              <MetricCard label="Cards" value={String(cards.length)} />
              <MetricCard
                label="Spending (recent list)"
                value={hidden ? "£ ••••" : formatGBP(monthSpend.toFixed(2))}
                hint="From shown transactions"
              />
              <MetricCard label="Daily limit" value={hidden ? "£ ••••" : formatGBP(card.dailyLimit)} />
              <MetricCard label="Status" value={card.cardFrozen ? "Frozen" : "Active"} tone={card.cardFrozen ? "brand" : "default"} />
            </MetricGrid>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`focus-ring shrink-0 rounded-md px-4 py-2 text-sm font-medium ${
                    tab === id ? "bg-brand text-white" : "border border-line bg-surface text-charcoal"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === "overview" ? (
              <article className="overflow-hidden rounded-2xl bg-neutral-950 text-white shadow-md">
                <div className="h-1.5 bg-brand" />
                <div className="flex items-start justify-between p-5">
                  <div>
                    <p className="text-xs tracking-[0.16em] text-white/60">DEBIT · VISA</p>
                    <p className="mt-6 font-mono text-xl tracking-[0.25em] sm:text-2xl">•••• •••• •••• {card.cardLast4}</p>
                    <p className="mt-4 text-sm text-white/80">{card.name}</p>
                    <p className="text-xs text-white/50">Valid thru 09/28 (demo)</p>
                    <p className="mt-2 text-xs text-white/50">{card.accountNumberMasked}</p>
                  </div>
                  <HsbcLogo onDark size={64} />
                </div>
                <div className="bg-white px-5 py-4 text-neutral-950">
                  <p className="text-sm">{card.cardFrozen ? "This card is frozen — transactions will be declined." : "This card is active and ready to use."}</p>
                  <Button type="button" variant="secondary" className="mt-3 w-full" disabled={busy === card.id} onClick={() => toggle(card.id)}>
                    {card.cardFrozen ? "Unfreeze card" : "Freeze card"}
                  </Button>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-muted">Daily limit utilisation (illustrative)</p>
                    <div className="mt-2 h-2 rounded-full bg-mist">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${utilPct}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {hidden ? "Hidden" : `${formatGBP(monthSpend.toFixed(2))} of ${formatGBP(card.dailyLimit)}`}
                    </p>
                  </div>
                </div>
              </article>
            ) : null}
            {tab === "controls" ? (
              <form
                className="panel space-y-3 p-5 text-sm"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  setError("");
                  try {
                    await api(`/api/accounts/${card.id}/controls`, {
                      method: "PATCH",
                      body: JSON.stringify({
                        contactlessEnabled: data.get("contactless") === "on",
                        onlineEnabled: data.get("online") === "on",
                        atmEnabled: data.get("atm") === "on",
                        dailyLimit: data.get("dailyLimit"),
                      }),
                    });
                    toast("Card controls saved");
                    router.refresh();
                  } catch (cause) {
                    setError(cause instanceof ApiError ? cause.message : "Could not save card controls");
                  }
                }}
              >
                <SectionHeader title="Card controls" description="Changes apply to this debit card in the demo." />
                <label className="flex items-center justify-between">
                  Contactless
                  <input type="checkbox" name="contactless" defaultChecked={card.contactlessEnabled} />
                </label>
                <label className="flex items-center justify-between">
                  Online payments
                  <input type="checkbox" name="online" defaultChecked={card.onlineEnabled} />
                </label>
                <label className="flex items-center justify-between">
                  Cash withdrawals
                  <input type="checkbox" name="atm" defaultChecked={card.atmEnabled} />
                </label>
                <label className="block">
                  Daily limit (£)
                  <input name="dailyLimit" defaultValue={card.dailyLimit} inputMode="decimal" className="mt-1 h-11 w-full rounded-lg border border-line px-3" />
                </label>
                <Button type="submit" className="w-full">
                  Save controls
                </Button>
                <Link href="/explore/card-pin" className="block text-center text-sm font-semibold text-brand">
                  PIN guidance
                </Link>
              </form>
            ) : null}
            {tab === "activity" ? (
              <CardActivity recent={recent} hidden={hidden} />
            ) : null}
            <div className="grid gap-2 sm:grid-cols-2">
              <Link href="/statements">
                <Button type="button" variant="secondary" className="w-full">
                  Card statements
                </Button>
              </Link>
              <Link href="/explore/card-offers">
                <Button type="button" variant="secondary" className="w-full">
                  View offers
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CardActivity({ recent, hidden }: { recent: CardTxn[]; hidden: boolean }) {
  if (recent.length === 0) {
    return <EmptyState title="No card transactions" body="Debit entries on linked accounts appear here." />;
  }
  return (
    <div className="panel overflow-hidden p-0">
      {recent.map((txn) => (
        <Link key={txn.id} href={`/transactions/${txn.id}`} className="flex justify-between border-b border-line px-4 py-3 text-sm last:border-b-0 hover:bg-mist/40">
          <span>
            <span className="font-medium text-charcoal">{txn.title}</span>
            <span className="block text-xs text-muted">
              {txn.category} · {formatDate(txn.date)}
            </span>
          </span>
          <span className="font-semibold tabular-nums">{hidden ? "£ ••••" : formatGBP(txn.amount)}</span>
        </Link>
      ))}
    </div>
  );
}
