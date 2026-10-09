"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Target } from "lucide-react";
import { formatGBP } from "@/lib/money";
import { ApiError, api } from "@/lib/client";
import { BankingPageIntro } from "@/components/page-intro";
import { MetricCard, MetricGrid } from "@/components/banking/metrics";
import { Button, EmptyState, ErrorState, PageHeader, SelectField, TextField } from "@/components/ui";
import { useToast } from "@/components/providers";

type Goal = { id: string; name: string; targetAmount: string; savedAmount: string };

export function GoalsScreen({ goals, accounts }: { goals: Goal[]; accounts: { id: string; name: string }[] }) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState("");

  const totalTarget = goals.reduce((s, g) => s + Number(g.targetAmount), 0);
  const totalSaved = goals.reduce((s, g) => s + Number(g.savedAmount), 0);

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    try {
      await api("/api/goals", {
        method: "POST",
        body: JSON.stringify({ name: data.get("name"), targetAmount: data.get("targetAmount"), targetDate: data.get("targetDate") || undefined }),
      });
      toast("Goal created");
      event.currentTarget.reset();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not create the goal");
    }
  }

  async function add(event: React.FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    try {
      await api(`/api/goals/${id}/add`, {
        method: "POST",
        body: JSON.stringify({ fromAccountId: data.get("fromAccountId"), amount: data.get("amount") }),
      });
      toast("Money added to the goal");
      event.currentTarget.reset();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not add money");
    }
  }

  return (
    <div className="md:pt-2">
      <PageHeader title="Savings goals" back="/home" />
      <div className="space-y-4 px-4 pb-10 md:px-0">
        <BankingPageIntro
          title="Goals"
          description="Set a target amount and date, track progress, and move money from your accounts."
          icon={Target}
          imageSrc="/ui/hero-deposits.svg"
        />
        <MetricGrid>
          <MetricCard label="Active goals" value={String(goals.length)} />
          <MetricCard label="Total saved" value={formatGBP(totalSaved.toFixed(2))} tone="brand" />
          <MetricCard label="Combined target" value={formatGBP(totalTarget.toFixed(2))} />
          <MetricCard
            label="Overall progress"
            value={totalTarget === 0 ? "—" : `${Math.min(100, Math.round((totalSaved / totalTarget) * 100))}%`}
          />
        </MetricGrid>
        {error ? <ErrorState message={error} /> : null}
        {goals.length === 0 ? (
          <EmptyState title="No goals yet" body="Create a goal below — for example a holiday or emergency fund." />
        ) : null}
        {goals.map((goal) => {
          const saved = Number(goal.savedAmount);
          const target = Number(goal.targetAmount);
          const width = target === 0 ? 0 : Math.min(100, Math.round((saved / target) * 100));
          return (
            <section key={goal.id} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold text-charcoal">{goal.name}</h2>
                <p className="text-sm text-muted">
                  {formatGBP(goal.savedAmount)} / {formatGBP(goal.targetAmount)}
                </p>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${width}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted">{width}% of target reached</p>
              <form onSubmit={(event) => add(event, goal.id)} className="mt-4 grid grid-cols-2 gap-2">
                <SelectField label="From" name="fromAccountId" defaultValue={accounts[0]?.id}>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </SelectField>
                <TextField label="Amount" name="amount" inputMode="decimal" required />
                <Button type="submit" className="col-span-2">
                  Add money
                </Button>
              </form>
            </section>
          );
        })}
        <form onSubmit={create} className="panel space-y-3 p-4">
          <h2 className="font-semibold text-charcoal">New goal</h2>
          <TextField label="Name" name="name" placeholder="Holiday, car, emergency fund…" required />
          <TextField label="Target amount (£)" name="targetAmount" inputMode="decimal" required />
          <TextField label="Target date (optional)" name="targetDate" type="date" />
          <Button type="submit" variant="secondary" className="w-full">
            Create goal
          </Button>
        </form>
      </div>
    </div>
  );
}
