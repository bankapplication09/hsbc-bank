import { prisma } from "@/lib/db";
import { requireUserPage } from "@/server/auth";
import { ProfileScreen } from "@/components/profile-screen";

type ProfileRow = {
  date_of_birth: Date | null;
  address_line: string | null;
  city: string | null;
  postcode: string | null;
  occupation: string | null;
};

export default async function ProfilePage() {
  const session = await requireUserPage();
  const user = session.user;
  const [accounts, details] = await Promise.all([
    prisma.account.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } }),
    prisma.$queryRaw<ProfileRow[]>`
      SELECT date_of_birth, address_line, city, postcode, occupation
      FROM users
      WHERE id = CAST(${user.id} AS uuid)
    `,
  ]);
  const extra = details[0];
  return (
    <ProfileScreen
      user={{
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        status: user.status,
        createdAt: user.createdAt.toISOString(),
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
        hideBalances: user.hideBalances,
        notifyTransactions: user.notifyTransactions,
        notifyStatements: user.notifyStatements,
        dateOfBirth: extra?.date_of_birth ? extra.date_of_birth.toISOString().slice(0, 10) : "",
        addressLine: extra?.address_line ?? "",
        city: extra?.city ?? "",
        postcode: extra?.postcode ?? "",
        occupation: extra?.occupation ?? "",
      }}
      accounts={accounts.map((account) => ({
        id: account.id,
        name: account.name,
        accountNumber: account.accountNumber,
        sortCode: account.sortCode,
        cardLast4: account.cardLast4,
        availableBalance: account.availableBalance.toString(),
        status: account.status,
      }))}
    />
  );
}
