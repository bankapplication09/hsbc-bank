import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatGBP, fromPence, toPence } from "@/lib/money";
import { requireUserPage } from "@/server/auth";
import { PageHeader } from "@/components/ui";

export default async function InsightsPage() {
  const session = await requireUserPage();
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const debits = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
      type: "DEBIT",
      transactionDate: { gte: start },
      account: { userId: session.user.id },
    },
    select: { amount: true, category: true },
  });
  const totals = new Map<string, bigint>();
  let spent = 0n;
  for (const txn of debits) {
    const amount = toPence(txn.amount.toString());
    spent += amount;
    totals.set(txn.category, (totals.get(txn.category) ?? 0n) + amount);
  }
  const rows = [...totals.entries()].sort((a, b) => (a[1] > b[1] ? -1 : 1));
  const month = start.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div>
      <PageHeader title="Spending" back="/home" />
      <div className="space-y-4 px-5">
        <section className="rounded-2xl bg-white p-5 ring-1 ring-line">
          <p className="text-sm text-neutral-500">{month}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">{session.user.hideBalances ? "£ ••••••" : formatGBP(fromPence(spent))}</p>
          <p className="text-sm text-neutral-500">Paid out</p>
        </section>
        <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          {rows.length === 0 ? <p className="px-4 py-6 text-sm text-neutral-500">No spending this month yet.</p> : null}
          {rows.map(([category, amount]) => {
            const width = spent === 0n ? 0 : Number((amount * 100n) / spent);
            return (
              <div key={category} className="border-b border-line px-4 py-3 last:border-b-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category}</span>
                  <span>{session.user.hideBalances ? "£ ••••••" : formatGBP(fromPence(amount))}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </section>
        <Link href="/transactions?view=OUT" className="block text-sm font-semibold text-brand">
          See outgoing transactions
        </Link>
      </div>
    </div>
  );
}
