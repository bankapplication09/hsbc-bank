import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { requireUserPage } from "@/server/auth";
import { serializeAccount } from "@/server/serialize";
import { PaymentsScreen } from "@/components/payments-screen";

export default async function PaymentsPage() {
  const session = await requireUserPage();
  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id, accountType: "SAVINGS" },
    orderBy: { createdAt: "asc" },
  });
  return (
    <Suspense>
      <PaymentsScreen
        hidden={session.user.hideBalances}
        accounts={accounts.map((account) => ({ ...serializeAccount(account, true), accountNumber: account.accountNumber, sortCode: account.sortCode }))}
      />
    </Suspense>
  );
}
