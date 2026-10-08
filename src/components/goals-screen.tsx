"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatGBP } from "@/lib/money";
import { ApiError, api } from "@/lib/client";
import { Button, EmptyState, ErrorState, PageHeader, SelectField, TextField } from "@/components/ui";
import { useToast } from "@/components/providers";

type Goal = { id: string; name: string; targetAmount: string; savedAmount: string };

export function GoalsScreen({ goals, accounts }: { goals: Goal[]; accounts: { id: string; name: string }[] }) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState("");

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    try {
      await api("/api/goals", {
        method: "POST",
        body: JSON.stringify({ name: data.get("name"), targetAmount: data.get("targetAmount") }),
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
    <div>
      <PageHeader title="Savings goals" back="/home" />
      <div className="space-y-4 px-5">
        {error ? <ErrorState message={error} /> : null}
        {goals.length === 0 ? <EmptyState title="No goals yet" body="Set a target and move money towards it." /> : null}
        {goals.map((goal) => {
          const saved = Number(goal.savedAmount);
          const target = Number(goal.targetAmount);
          const width = target === 0 ? 0 : Math.min(100, Math.round((saved / target) * 100));
          return (
            <section key={goal.id} className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <div className="flex items-start justify-between">
                <h2 className="font-semibold">{goal.name}</h2>
                <p className="text-sm text-neutral-500">
                  {formatGBP(goal.savedAmount)} / {formatGBP(goal.targetAmount)}
                </p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
                <div className="h-full rounded-full bg-brand" style={{ width: `${width}%` }} />
              </div>
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
        <form onSubmit={create} className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-line">
          <h2 className="font-semibold">New goal</h2>
          <TextField label="Name" name="name" placeholder="Goal name" required />
          <TextField label="Target" name="targetAmount" inputMode="decimal" required />
          <Button type="submit" variant="secondary" className="w-full">
            Create goal
          </Button>
        </form>
      </div>
    </div>
  );
}
