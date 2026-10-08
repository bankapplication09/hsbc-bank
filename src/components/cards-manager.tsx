"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, api } from "@/lib/client";
import { Button, EmptyState, ErrorState, PageHeader } from "@/components/ui";
import { HsbcLogo } from "@/components/logo";
import { useToast } from "@/components/providers";

export function CardsManager({
  cards,
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
}) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

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

  return (
    <div>
      <PageHeader title="Cards" back="/home" />
      <div className="space-y-3 px-5">
        {error ? <ErrorState message={error} /> : null}
        {cards.length === 0 ? <EmptyState title="No cards" body="A debit card appears with a savings account." /> : null}
        {cards.map((card) => (
          <article key={card.id} className="overflow-hidden rounded-2xl bg-neutral-950 text-white">
            <div className="h-1.5 bg-brand" />
            <div className="flex items-start justify-between p-5">
              <div>
              <p className="text-xs tracking-[0.16em] text-white/60">DEBIT</p>
              <p className="mt-6 font-mono text-lg tracking-[0.2em]">•••• {card.cardLast4}</p>
              <p className="mt-4 text-sm text-white/70">{card.name}</p>
              <p className="text-xs text-white/50">{card.accountNumberMasked}</p>
              </div>
              <HsbcLogo onDark size={64} />
            </div>
            <div className="bg-white px-5 py-4 text-neutral-950">
              <p className="text-sm">{card.cardFrozen ? "This card is frozen." : "This card is active."}</p>
              <Button type="button" variant="secondary" className="mt-3 w-full" disabled={busy === card.id} onClick={() => toggle(card.id)}>
                {card.cardFrozen ? "Unfreeze card" : "Freeze card"}
              </Button>
              <form
                className="mt-4 space-y-2 text-sm"
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
                  Daily limit
                  <input name="dailyLimit" defaultValue={card.dailyLimit} inputMode="decimal" className="mt-1 h-11 w-full rounded-lg border border-line px-3" />
                </label>
                <Button type="submit" className="w-full">
                  Save controls
                </Button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
