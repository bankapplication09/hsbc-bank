import { prisma } from "@/lib/db";
import { requireUserPage } from "@/server/auth";
import { UserShell } from "@/components/shells";

export const dynamic = "force-dynamic";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUserPage();
  const unread = await prisma.notification.count({ where: { userId: session.user.id, read: false } });
  return (
    <UserShell name={session.user.fullName} unread={unread}>
      {children}
    </UserShell>
  );
}
