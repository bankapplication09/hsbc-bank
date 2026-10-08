import { prisma } from "@/lib/db";
import { badRequest, json, readJson, route } from "@/lib/http";
import { scheduledPaymentSchema } from "@/lib/validation";
import { requireUserApi } from "@/server/auth";
import { serializeSchedule } from "@/server/serialize";

export const GET = route(async () => {
  const current = await requireUserApi();
  const items = await prisma.scheduledPayment.findMany({
    where: { userId: current.user.id, active: true },
    include: { payee: true },
    orderBy: { nextDate: "asc" },
  });
  return json({ payments: items.map(serializeSchedule) });
});

export const POST = route(async (req) => {
  await requireUserApi();
  await readJson(req, scheduledPaymentSchema);
  throw badRequest("Paying someone is not available on a savings account");
});
