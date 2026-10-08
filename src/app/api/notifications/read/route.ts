import { z } from "zod";
import { prisma } from "@/lib/db";
import { json, readJson, route } from "@/lib/http";
import { requireUserApi } from "@/server/auth";

const schema = z.object({
  id: z.string().uuid().optional(),
  all: z.boolean().optional(),
});

export const POST = route(async (req) => {
  const current = await requireUserApi();
  const input = await readJson(req, schema);
  await prisma.notification.updateMany({
    where: {
      userId: current.user.id,
      read: false,
      ...(input.all || !input.id ? {} : { id: input.id }),
    },
    data: { read: true },
  });
  return json({ ok: true });
});
