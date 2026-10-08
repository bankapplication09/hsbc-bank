import { prisma } from "@/lib/db";
import { badRequest, json, notFound, readJson, requestMeta, route } from "@/lib/http";
import { updateTransactionSchema } from "@/lib/validation";
import { requireAdminApi } from "@/server/auth";
import { settlePending, writeAudit } from "@/server/ledger";
import { serializeTxn } from "@/server/serialize";
import { txnInclude } from "@/server/queries";

export const PATCH = route<{ id: string }>(async (req, params) => {
  const admin = await requireAdminApi();
  const input = await readJson(req, updateTransactionSchema);
  const meta = requestMeta(req);
  const existing = await prisma.transaction.findUnique({ where: { id: params.id }, include: txnInclude });
  if (!existing) throw notFound("Transaction not found");
  if (input.status && existing.status !== "PENDING") {
    throw badRequest("Amount and history stay as recorded. Only a pending transaction can change status.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    if (input.status) {
      await settlePending(tx, existing.id, input.status, admin.user.id);
    }
    const next = await tx.transaction.update({
      where: { id: existing.id },
      data: {
        description: input.description ?? undefined,
        merchant: input.merchant,
        category: input.category,
        notes: input.notes,
        updatedById: admin.user.id,
      },
      include: txnInclude,
    });
    await writeAudit(tx, {
      actorId: admin.user.id,
      actorEmail: admin.user.email,
      action: "TRANSACTION_UPDATED",
      targetType: "transaction",
      targetId: existing.id,
      targetUserId: existing.account.userId,
      oldValue: {
        description: existing.description,
        category: existing.category,
        status: existing.status,
      },
      newValue: {
        description: next.description,
        category: next.category,
        status: next.status,
      },
      reason: input.reason,
      summary: `Updated transaction ${existing.reference}`,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });
    return next;
  });
  return json({ transaction: serializeTxn(updated) });
});
