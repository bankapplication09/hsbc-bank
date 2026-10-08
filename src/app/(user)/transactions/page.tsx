import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { transactionQuerySchema } from "@/lib/validation";
import { requireUserPage } from "@/server/auth";
import { queryTransactions } from "@/server/queries";
import { serializeTxn } from "@/server/serialize";
import { TransactionFilters, TransactionItem } from "@/components/bank";
import { EmptyState, PageHeader } from "@/components/ui";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireUserPage();
  const raw = await searchParams;
  const view = typeof raw.view === "string" ? raw.view : "ALL";
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string" && key !== "view") flat[key] = value;
  }
  if (view === "IN") flat.type = "CREDIT";
  if (view === "OUT") flat.type = "DEBIT";
  if (view === "PENDING" || view === "COMPLETED" || view === "REVERSED") flat.status = view;
  const parsed = transactionQuerySchema.safeParse(flat);
  const query = parsed.success ? parsed.data : { page: 1, pageSize: 20 };
  const result = await queryTransactions(query, session.user.id);
  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  });
  const page = query.page ?? 1;

  return (
    <div>
      <PageHeader title="Transactions" />
      <div className="space-y-4 px-5">
        <Suspense>
          <TransactionFilters accounts={accounts} />
        </Suspense>
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          {result.items.length === 0 ? (
            <EmptyState title="Nothing to show" body="Try a different search or filter." />
          ) : (
            result.items.map((txn) => {
              const viewTxn = serializeTxn(txn);
              return (
                <TransactionItem
                  key={viewTxn.id}
                  id={viewTxn.id}
                  title={viewTxn.merchant || viewTxn.description}
                  category={viewTxn.category}
                  date={viewTxn.transactionDate}
                  amount={viewTxn.amount}
                  type={viewTxn.type}
                  status={viewTxn.status}
                  hidden={session.user.hideBalances}
                />
              );
            })
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          {page > 1 ? <Link href={`?${new URLSearchParams({ ...flat, page: String(page - 1) })}`}>Previous</Link> : <span />}
          <span className="text-neutral-500">
            Page {page} of {Math.max(1, Math.ceil(result.total / (query.pageSize ?? 20)))}
          </span>
          {page * (query.pageSize ?? 20) < result.total ? (
            <Link href={`?${new URLSearchParams({ ...flat, page: String(page + 1) })}`}>Next</Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
