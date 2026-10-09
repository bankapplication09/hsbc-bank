import { forbidden, route } from "@/lib/http";
import { requireUserApi } from "@/server/auth";

export const PATCH = route(async () => {
  await requireUserApi();
  throw forbidden("Personal details cannot be updated here. Contact HSBC UK to change your information.");
});
