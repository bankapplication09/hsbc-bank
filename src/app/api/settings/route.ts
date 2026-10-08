import { prisma } from "@/lib/db";
import { badRequest, json, readJson, route } from "@/lib/http";
import { settingsSchema } from "@/lib/validation";
import { requireUserApi, verifyPassword } from "@/server/auth";
import { serializeUser } from "@/server/serialize";

export const PATCH = route(async (req) => {
  const current = await requireUserApi();
  const input = await readJson(req, settingsSchema);
  const revealing = current.user.hideBalances && !input.hideBalances;
  if (revealing) {
    if (!input.pin) throw badRequest("Enter your 4-digit password");
    if (!current.user.balancePinHash || !(await verifyPassword(input.pin, current.user.balancePinHash))) {
      throw badRequest("That 4-digit password is not correct");
    }
  }
  const user = await prisma.user.update({
    where: { id: current.user.id },
    data: {
      hideBalances: input.hideBalances,
      notifyTransactions: input.notifyTransactions,
      notifyStatements: input.notifyStatements,
    },
  });
  return json({ user: serializeUser(user) });
});
