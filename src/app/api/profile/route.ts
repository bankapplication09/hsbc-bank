import { prisma } from "@/lib/db";
import { json, readJson, route } from "@/lib/http";
import { profileUpdateSchema } from "@/lib/validation";
import { requireUserApi } from "@/server/auth";
import { serializeUser } from "@/server/serialize";

export const PATCH = route(async (req) => {
  const current = await requireUserApi();
  const input = await readJson(req, profileUpdateSchema);
  const dateOfBirth = input.dateOfBirth ? new Date(`${input.dateOfBirth}T00:00:00.000Z`) : null;
  await prisma.$executeRaw`
    UPDATE users
    SET phone = ${input.phone},
        date_of_birth = ${dateOfBirth},
        address_line = ${input.addressLine ?? null},
        city = ${input.city ?? null},
        postcode = ${input.postcode ?? null},
        occupation = ${input.occupation ?? null}
    WHERE id = CAST(${current.user.id} AS uuid)
  `;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: current.user.id } });
  return json({ user: serializeUser(user) });
});
