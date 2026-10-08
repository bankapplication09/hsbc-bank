import { prisma } from "@/lib/db";
import { requireUserPage } from "@/server/auth";
import { serializeAccount } from "@/server/serialize";
import { CardsManager } from "@/components/cards-manager";

export default async function CardsPage() {
  const session = await requireUserPage();
  const accounts = await prisma.account.findMany({ where: { userId: session.user.id, cardLast4: { not: null } } });
  return (
    <CardsManager
      cards={accounts.map((account) => {
        const view = serializeAccount(account);
        return {
          id: account.id,
          name: account.name,
          cardLast4: account.cardLast4 ?? "",
          cardFrozen: account.cardFrozen,
          accountNumberMasked: view.accountNumberMasked,
          contactlessEnabled: view.contactlessEnabled,
          onlineEnabled: view.onlineEnabled,
          atmEnabled: view.atmEnabled,
          dailyLimit: view.dailyLimit,
        };
      })}
    />
  );
}
