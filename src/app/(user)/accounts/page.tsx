import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { requireUserPage } from "@/server/auth";
import { serializeAccount } from "@/server/serialize";
import { EmptyState, PageHeader, StatusBadge } from "@/components/ui";

export default async function AccountsPage() {
  const session = await requireUserPage();
  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    include: { transactions: { orderBy: { transactionDate: "desc" }, take: 1 } },
  });
  const hidden = session.user.hideBalances;
  return (
    <div>
      <PageHeader title="Accounts" />
      <div className="space-y-3 px-5">
        {accounts.length === 0 ? <EmptyState title="No accounts" body="Your accounts will be listed here." /> : null}
        {accounts.map((account) => {
          const view = serializeAccount(account);
          const latest = account.transactions[0];
          return (
            <Link key={account.id} href={`/accounts/${account.id}`} className="block rounded-2xl bg-white p-5 ring-1 ring-line">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-[0.14em] text-neutral-500">{view.name.toUpperCase()}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">{hidden ? "£ ••••••" : formatGBP(view.availableBalance)}</p>
                  <p className="text-xs text-neutral-500">Available balance</p>
                </div>
                <StatusBadge status={view.status} />
              </div>
              <p className="mt-4 font-mono text-sm text-neutral-600">{view.accountNumberMasked}</p>
              <p className="mt-2 text-xs text-neutral-500">
                {latest ? `Latest · ${latest.description} · ${formatDate(latest.transactionDate)}` : "No recent activity"}
              </p>
            </Link>
          );
        })}
        <Link href="/cards" className="block rounded-2xl bg-white px-5 py-4 text-sm font-semibold ring-1 ring-line">
          Cards
        </Link>
      </div>
    </div>
  );
}
