import { prisma } from "@/lib/db";
import { json, notFound, route } from "@/lib/http";
import { requireUserApi } from "@/server/auth";

export const DELETE = route<{ id: string }>(async (_req, params) => {
  const current = await requireUserApi();
  const payee = await prisma.payee.findFirst({ where: { id: params.id, userId: current.user.id } });
  if (!payee) throw notFound("Payee not found");
  await prisma.payee.delete({ where: { id: payee.id } });
  return json({ ok: true });
});
