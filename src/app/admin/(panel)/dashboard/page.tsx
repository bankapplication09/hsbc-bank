import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { requireAdminPage } from "@/server/auth";
import { loadStats } from "@/server/stats";
import { OverviewCharts } from "@/components/charts";
import { CurrencyAmount } from "@/components/bank";

export default async function DashboardPage() {
  await requireAdminPage();
  const stats = await loadStats();
  const tiles = [
    ["Customers", String(stats.totalUsers)],
    ["Active", String(stats.activeUsers)],
    ["Suspended", String(stats.suspendedUsers)],
    ["Accounts", String(stats.totalAccounts)],
    ["Balances", formatGBP(stats.totalBalance)],
    ["Credits", formatGBP(stats.totalCredits)],
    ["Debits", formatGBP(stats.totalDebits)],
    ["Today", String(stats.transactionsToday)],
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-neutral-500">HSBC UK balances and customer activity.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map(([label, value]) => (
          <section key={label} className="rounded-2xl bg-white p-4 ring-1 ring-line">
            <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
            <p className="mt-2 text-xl font-semibold tracking-tight">{value}</p>
          </section>
        ))}
      </div>
      <OverviewCharts data={stats.chart} />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl bg-white ring-1 ring-line">
          <h2 className="border-b border-line px-4 py-3 text-sm font-semibold">Recent transactions</h2>
          {stats.recentTransactions.map((txn) => (
            <Link key={txn.id} href="/admin/transactions" className="flex items-center justify-between border-b border-line px-4 py-3 last:border-b-0">
              <span>
                <span className="block text-sm font-medium">{txn.description}</span>
                <span className="text-xs text-neutral-500">{txn.ownerName}</span>
              </span>
              <CurrencyAmount amount={txn.amount} type={txn.type} />
            </Link>
          ))}
        </section>
        <section className="rounded-2xl bg-white ring-1 ring-line">
          <h2 className="border-b border-line px-4 py-3 text-sm font-semibold">Recent staff actions</h2>
          {stats.recentActions.length === 0 ? <p className="px-4 py-6 text-sm text-neutral-500">No staff actions yet.</p> : null}
          {stats.recentActions.map((action) => (
            <div key={action.id} className="border-b border-line px-4 py-3 last:border-b-0">
              <p className="text-sm">{action.summary}</p>
              <p className="text-xs text-neutral-500">
                {action.adminName} · {formatDateTime(action.createdAt)}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
