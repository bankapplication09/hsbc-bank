import { redirect } from "next/navigation";
import { getSession } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function IndexPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  redirect(session.user.role === "ADMIN" ? "/admin/dashboard" : "/home");
}
