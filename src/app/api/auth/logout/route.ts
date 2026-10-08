import { json, route } from "@/lib/http";
import { destroyCurrentSession } from "@/server/auth";

export const POST = route(async () => {
  await destroyCurrentSession();
  return json({ ok: true });
});
