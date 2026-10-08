import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { statementQuerySchema } from "@/lib/validation";
import { requireUserPage } from "@/server/auth";
import { loadStatement } from "@/server/statements";
import { serializeTxn } from "@/server/serialize";
import { TransactionItem } from "@/components/bank";
import { EmptyState, PageHeader } from "@/components/ui";

export default async function StatementsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const session = await requireUserPage();
  const raw = await searchParams;
  const accounts = await prisma.account.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "asc" } });
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const defaultTo = now.toISOString().slice(0, 10);
  const parsed = statementQuerySchema.safeParse({
    accountId: raw.accountId || accounts[0]?.id,
    from: raw.from || defaultFrom,
    to: raw.to || defaultTo,
  });

  let statement: Awaited<ReturnType<typeof loadStatement>> | null = null;
  if (parsed.success) {
    statement = await loadStatement(session.user.id, parsed.data.accountId, parsed.data.from, parsed.data.to);
  }

  return (
    <div>
      <PageHeader title="Statements" back="/home" />
      <div className="space-y-4 px-5">
        <form className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-4 ring-1 ring-line" action="/statements">
          <label className="col-span-2 text-sm">
            Account
            <select name="accountId" defaultValue={parsed.success ? parsed.data.accountId : ""} className="mt-1 h-11 w-full rounded-lg border border-line px-2">
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            From
            <input type="date" name="from" defaultValue={parsed.success ? parsed.data.from.slice(0, 10) : defaultFrom} className="mt-1 h-11 w-full rounded-lg border border-line px-2" />
          </label>
          <label className="text-sm">
            To
            <input type="date" name="to" defaultValue={parsed.success ? parsed.data.to.slice(0, 10) : defaultTo} className="mt-1 h-11 w-full rounded-lg border border-line px-2" />
          </label>
          <button className="col-span-2 h-11 rounded-lg bg-brand text-sm font-semibold text-white" type="submit">
            View statement
          </button>
        </form>
        {statement ? (
          <>
            <section className="rounded-2xl bg-white p-4 ring-1 ring-line">
              <p className="text-sm text-neutral-500">{statement.account.name}</p>
              <p className="text-xs text-neutral-400">
                {formatDate(statement.start)} – {formatDate(statement.end)}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <p>Opening<br /><span className="font-semibold">{formatGBP(statement.opening)}</span></p>
                <p>Closing<br /><span className="font-semibold">{formatGBP(statement.closing)}</span></p>
                <p>Paid in<br /><span className="font-semibold text-emerald-700">{formatGBP(statement.credits)}</span></p>
                <p>Paid out<br /><span className="font-semibold">{formatGBP(statement.debits)}</span></p>
              </div>
              <Link
                href={`/api/statements/download?accountId=${statement.account.id}&from=${parsed.success ? parsed.data.from : defaultFrom}&to=${parsed.success ? parsed.data.to : defaultTo}`}
                className="mt-4 block text-center text-sm font-semibold text-brand"
              >
                Download CSV
              </Link>
            </section>
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
              {statement.items.length === 0 ? (
                <EmptyState title="No entries" body="Nothing was posted in this date range." />
              ) : (
                statement.items.map((txn) => {
                  const view = serializeTxn(txn);
                  return (
                    <TransactionItem
                      key={view.id}
                      id={view.id}
                      title={view.merchant || view.description}
                      category={view.category}
                      date={view.transactionDate}
                      amount={view.amount}
                      type={view.type}
                      status={view.status}
                    />
                  );
                })
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
