import { formatDateTime, humanise } from "@/lib/format";
import { auditQuerySchema } from "@/lib/validation";
import { AUDIT_ACTIONS } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/server/auth";

export default async function AuditPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireAdminPage();
  const raw = await searchParams;
  const parsed = auditQuerySchema.safeParse(raw);
  const query = parsed.success ? parsed.data : { page: 1, pageSize: 25 };
  const logs = await prisma.auditLog.findMany({
    where: {
      ...(query.action ? { action: query.action } : {}),
      ...(query.q ? { OR: [{ actorEmail: { contains: query.q, mode: "insensitive" } }, { reason: { contains: query.q, mode: "insensitive" } }] } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: query.pageSize ?? 25,
    skip: ((query.page ?? 1) - 1) * (query.pageSize ?? 25),
  });
  return (
    <div>
      <h1 className="text-2xl font-semibold">Audit log</h1>
      <p className="mt-1 text-sm text-neutral-500">Staff actions are recorded here and cannot be edited.</p>
      <form className="my-4 flex gap-2" action="/admin/audit-logs">
        <input name="q" defaultValue={query.q ?? ""} placeholder="Search email or reason" className="h-11 flex-1 rounded-lg border border-line bg-white px-3 text-sm" />
        <select name="action" defaultValue={query.action ?? ""} className="h-11 rounded-lg border border-line bg-white px-2 text-sm">
          <option value="">All actions</option>
          {AUDIT_ACTIONS.map((action) => (
            <option key={action} value={action}>{humanise(action)}</option>
          ))}
        </select>
        <button className="h-11 rounded-lg bg-neutral-950 px-4 text-sm font-semibold text-white">Filter</button>
      </form>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Staff</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Target</th>
              <th className="px-4 py-3 font-medium">Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-neutral-500">No audit entries yet.</td></tr>
            ) : null}
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-line align-top last:border-b-0">
                <td className="px-4 py-3 text-neutral-600">{formatDateTime(log.createdAt)}</td>
                <td className="px-4 py-3">{log.actorEmail}</td>
                <td className="px-4 py-3">{humanise(log.action)}</td>
                <td className="px-4 py-3 text-neutral-600">{log.targetType}{log.targetId ? ` · ${log.targetId.slice(0, 8)}` : ""}</td>
                <td className="px-4 py-3 text-neutral-600">{log.reason ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
