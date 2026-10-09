"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatDateTime, formatSortCode, initials } from "@/lib/format";
import { formatGBP } from "@/lib/money";
import { ApiError, api } from "@/lib/client";
import { Button, ErrorState, PageHeader, StatusBadge, TextField } from "./ui";
import { useToast } from "./providers";

type ProfileUser = {
  fullName: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
  hideBalances: boolean;
  notifyTransactions: boolean;
  notifyStatements: boolean;
  dateOfBirth: string;
  addressLine: string;
  city: string;
  postcode: string;
  occupation: string;
};

type ProfileAccount = {
  id: string;
  name: string;
  accountNumber: string;
  sortCode: string;
  cardLast4: string | null;
  availableBalance: string;
  status: string;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3 last:border-b-0">
      <dt className="text-sm text-neutral-500">{label}</dt>
      <dd className="max-w-[60%] text-right text-sm font-medium">{value || "Not added"}</dd>
    </div>
  );
}

export function ProfileScreen({ user, accounts }: { user: ProfileUser; accounts: ProfileAccount[] }) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState("");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
  const [addressLine, setAddressLine] = useState(user.addressLine);
  const [city, setCity] = useState(user.city);
  const [postcode, setPostcode] = useState(user.postcode);
  const [occupation, setOccupation] = useState(user.occupation);
  async function saveDetails(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await api("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ phone, dateOfBirth, addressLine, city, postcode, occupation }),
      });
      toast("Profile saved");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not save");
    }
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST", body: "{}" });
    router.replace("/login");
    router.refresh();
  }

  const address = [user.addressLine, user.city, user.postcode].filter(Boolean).join(", ");

  return (
    <div>
      <PageHeader title="Profile" />
      <div className="space-y-4 px-5 pb-8">
        {error ? <ErrorState message={error} /> : null}
        <section className="rounded-2xl bg-white p-5 text-center ring-1 ring-line">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-neutral-950 text-lg font-semibold text-white">
            {initials(user.fullName)}
          </div>
          <h2 className="mt-3 text-xl font-semibold">{user.fullName}</h2>
          <p className="text-sm text-neutral-500">{user.email}</p>
          <div className="mt-3">
            <StatusBadge status={user.status} />
          </div>
          <p className="mt-2 text-xs text-neutral-400">Customer since {formatDate(user.createdAt)}</p>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          <h3 className="px-4 pt-4 text-sm font-semibold">Personal details</h3>
          <dl className="mt-2">
            <Row label="Full name" value={user.fullName} />
            <Row label="Email" value={user.email} />
            <Row label="Mobile" value={user.phone ?? ""} />
            <Row label="Date of birth" value={user.dateOfBirth ? formatDate(user.dateOfBirth) : ""} />
            <Row label="Occupation" value={user.occupation} />
            <Row label="Address" value={address} />
            <Row label="Customer since" value={formatDate(user.createdAt)} />
            <Row label="Last sign-in" value={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : ""} />
          </dl>
        </section>

        <form onSubmit={saveDetails} className="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-line">
          <h3 className="font-semibold">Contact and address</h3>
          <TextField label="Mobile" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          <TextField label="Date of birth" type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} />
          <TextField label="Address" value={addressLine} onChange={(event) => setAddressLine(event.target.value)} maxLength={120} />
          <TextField label="City" value={city} onChange={(event) => setCity(event.target.value)} maxLength={60} />
          <TextField label="Postcode" value={postcode} onChange={(event) => setPostcode(event.target.value)} maxLength={12} />
          <TextField label="Occupation" value={occupation} onChange={(event) => setOccupation(event.target.value)} maxLength={60} />
          <Button type="submit" variant="secondary" className="w-full">
            Save details
          </Button>
        </form>

        <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
          <h3 className="px-4 pt-4 text-sm font-semibold">Accounts</h3>
          {accounts.length === 0 ? <p className="px-4 py-3 text-sm text-neutral-500">No accounts yet.</p> : null}
          <ul>
            {accounts.map((account) => (
              <li key={account.id} className="border-t border-line px-4 py-3 first:border-t-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{account.name}</p>
                    <p className="mt-1 text-xs text-neutral-500">Sort code {formatSortCode(account.sortCode)}</p>
                    <p className="text-xs text-neutral-500">Account {account.accountNumber}</p>
                    <p className="text-xs text-neutral-500">{account.cardLast4 ? `Debit card •••• ${account.cardLast4}` : "No card"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{user.hideBalances ? "£ ••••••" : formatGBP(account.availableBalance)}</p>
                    <Link href={`/accounts/${account.id}`} className="mt-1 inline-block text-xs font-semibold text-brand">
                      View
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <Button type="button" variant="danger" className="w-full" onClick={logout}>
          Log off
        </Button>
      </div>
    </div>
  );
}
