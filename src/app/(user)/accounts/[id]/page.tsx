import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDate, formatSortCode } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { requireUserPage } from "@/server/auth";
import { queryTransactions } from "@/server/queries";
import { serializeTxn } from "@/server/serialize";
import { TransactionItem } from "@/components/bank";
import { PageHeader, StatusBadge } from "@/components/ui";

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireUserPage();
  const account = await prisma.account.findFirst({ where: { id, userId: session.user.id } });
  if (!account) notFound();
  const txns = await queryTransactions({ accountId: account.id, page: 1, pageSize: 8 }, session.user.id);
  const hidden = session.user.hideBalances;
  const rows = [
    ["Account type", "Savings account"],
    ["Account number", account.accountNumber],
    ["Sort code", formatSortCode(account.sortCode)],
    ["Currency", account.currency],
    ["Opened", formatDate(account.createdAt)],
  ];
  return (
    <div>
      <PageHeader title={account.name} back="/accounts" />
      <div className="space-y-4 px-5">
        <section className="rounded-2xl bg-white p-5 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">Available balance</p>
            <StatusBadge status={account.status} />
          </div>
          <p className="mt-2 text-4xl font-semibold tracking-tight">{hidden ? "£ ••••••" : formatGBP(account.availableBalance.toString())}</p>
          <p className="mt-2 text-sm text-neutral-500">Current balance {hidden ? "£ ••••••" : formatGBP(account.currentBalance.toString())}</p>
        </section>
        <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between border-b border-line px-4 py-3 last:border-b-0">
              <span className="text-sm text-neutral-500">{label}</span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </section>
        <Link href={`/statements?accountId=${account.id}`} className="block rounded-xl bg-brand py-3 text-center text-sm font-semibold text-white">
          View statement
        </Link>
        <section>
          <h2 className="mb-2 text-base font-semibold">Recent activity</h2>
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
            {txns.items.map((txn) => {
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
                  hidden={hidden}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
