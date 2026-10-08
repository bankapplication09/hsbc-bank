"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { formatGBP } from "@/lib/money";
import { ApiError, api } from "@/lib/client";
import { Button, Dialog, ErrorState, SelectField, StatusBadge, TextField } from "./ui";
import { useToast } from "./providers";

type Account = { id: string; name: string; currentBalance: string; status: string; accountNumber: string };
type Txn = { id: string; description: string; amount: string; type: "CREDIT" | "DEBIT"; status: string; reference: string };

export function AdminCustomer({
  user,
  accounts,
  transactions,
}: {
  user: { id: string; fullName: string; email: string; phone: string | null; status: string; balance?: string };
  accounts: Account[];
  transactions: Txn[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState("");
  const [dialog, setDialog] = useState<"funds" | "edit" | "txn" | "status" | "reverse" | "delete" | null>(null);
  const [fundType, setFundType] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [statusAction, setStatusAction] = useState("SUSPEND");
  const [reverseId, setReverseId] = useState("");

  async function run(url: string, body: unknown, message: string, method = "POST") {
    setError("");
    try {
      await api(url, { method, body: JSON.stringify(body) });
      toast(message);
      setDialog(null);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Request failed");
    }
  }

  return (
    <div className="space-y-4">
      {error ? <ErrorState message={error} /> : null}
      <section className="rounded-2xl bg-white p-5 ring-1 ring-line">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{user.fullName}</h1>
            <p className="text-sm text-neutral-500">{user.email}</p>
            <p className="text-sm text-neutral-500">{user.phone || "No phone"}</p>
          </div>
          <StatusBadge status={user.status} />
        </div>
        <p className="mt-4 text-3xl font-semibold tracking-tight">{formatGBP(user.balance ?? "0.00")}</p>
        <p className="text-sm text-neutral-500">Total balance</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" onClick={() => { setFundType("CREDIT"); setDialog("funds"); }}>Add funds</Button>
          <Button type="button" variant="secondary" onClick={() => { setFundType("DEBIT"); setDialog("funds"); }}>Deduct funds</Button>
          <Button type="button" variant="secondary" onClick={() => setDialog("txn")}>Create transaction</Button>
          <Button type="button" variant="secondary" onClick={() => setDialog("edit")}>Edit</Button>
          <Button type="button" variant="secondary" onClick={() => setDialog("status")}>Status</Button>
          <Button type="button" variant="danger" onClick={() => setDialog("delete")}>Delete</Button>
        </div>
      </section>

      {accounts.map((account) => (
        <section key={account.id} className="rounded-2xl bg-white p-4 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{account.name}</p>
              <p className="font-mono text-sm text-neutral-500">{account.accountNumber}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{formatGBP(account.currentBalance)}</p>
              <StatusBadge status={account.status} />
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="mt-2"
            onClick={() => {
              const suspending = account.status === "ACTIVE";
              if (!window.confirm(suspending ? "Suspend this account?" : "Activate this account?")) return;
              void run(`/api/admin/accounts/${account.id}/status`, {
                status: suspending ? "SUSPENDED" : "ACTIVE",
                reason: suspending ? "Account suspended by staff" : "Account activated by staff",
              }, "Account updated");
            }}
          >
            {account.status === "ACTIVE" ? "Suspend account" : "Activate account"}
          </Button>
        </section>
      ))}

      <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
        <h2 className="border-b border-line px-4 py-3 text-sm font-semibold">Transactions</h2>
        {transactions.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0">
            <div>
              <p className="text-sm font-medium">{txn.description}</p>
              <p className="text-xs text-neutral-500">{txn.reference} · {txn.status.toLowerCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{txn.type === "DEBIT" ? "-" : "+"}{formatGBP(txn.amount)}</p>
              {txn.status === "COMPLETED" ? (
                <button
                  type="button"
                  className="text-xs font-semibold text-brand"
                  onClick={() => {
                    setReverseId(txn.id);
                    setDialog("reverse");
                  }}
                >
                  Reverse
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </section>

      <Dialog open={dialog === "funds"} title={fundType === "CREDIT" ? "Add funds" : "Deduct funds"} onClose={() => setDialog(null)}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void run(`/api/admin/accounts/${data.get("accountId")}/adjust`, {
              type: fundType,
              amount: data.get("amount"),
              reason: data.get("reason"),
            }, fundType === "CREDIT" ? "Funds added" : "Funds deducted");
          }}
        >
          <SelectField label="Account" name="accountId" value={accountId} onChange={(event) => setAccountId(event.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </SelectField>
          <TextField label="Amount" name="amount" inputMode="decimal" required />
          <TextField label="Reason" name="reason" required />
          <Button type="submit" className="w-full">Confirm</Button>
        </form>
      </Dialog>

      <Dialog open={dialog === "edit"} title="Edit customer" onClose={() => setDialog(null)}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void run(`/api/admin/users/${user.id}`, {
              fullName: data.get("fullName"),
              email: data.get("email"),
              phone: data.get("phone"),
              balancePin: data.get("balancePin") || undefined,
              reason: data.get("reason"),
            }, "Customer updated", "PATCH");
          }}
        >
          <TextField label="Full name" name="fullName" defaultValue={user.fullName} required />
          <TextField label="Email" name="email" type="email" defaultValue={user.email} required />
          <TextField label="Phone" name="phone" defaultValue={user.phone ?? ""} />
          <TextField label="4-digit password" name="balancePin" inputMode="numeric" maxLength={4} pattern="\d{4}" placeholder="Leave blank to keep the current one" />
          <TextField label="Reason" name="reason" required />
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Dialog>

      <Dialog open={dialog === "status"} title="Change status" onClose={() => setDialog(null)}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void run(`/api/admin/users/${user.id}/status`, { action: statusAction, reason: data.get("reason") }, "Status updated");
          }}
        >
          <SelectField label="Action" value={statusAction} onChange={(event) => setStatusAction(event.target.value)}>
            <option value="SUSPEND">Suspend</option>
            <option value="ACTIVATE">Activate</option>
            <option value="LOCK">Lock</option>
            <option value="UNLOCK">Unlock</option>
          </SelectField>
          <TextField label="Reason" name="reason" required />
          <Button type="submit" className="w-full">Confirm</Button>
        </form>
      </Dialog>

      <Dialog open={dialog === "txn"} title="Create transaction" onClose={() => setDialog(null)}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void run("/api/admin/transactions", {
              accountId: data.get("accountId"),
              type: data.get("type"),
              amount: data.get("amount"),
              description: data.get("description"),
              merchant: data.get("merchant") || undefined,
              category: data.get("category"),
              transactionDate: new Date().toISOString(),
              status: data.get("status"),
              reason: data.get("reason"),
            }, "Transaction created");
          }}
        >
          <SelectField label="Account" name="accountId" defaultValue={accounts[0]?.id}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </SelectField>
          <SelectField label="Type" name="type" defaultValue="CREDIT">
            <option value="CREDIT">Credit</option>
            <option value="DEBIT">Debit</option>
          </SelectField>
          <TextField label="Amount" name="amount" inputMode="decimal" required />
          <TextField label="Description" name="description" required />
          <TextField label="Merchant" name="merchant" />
          <SelectField label="Category" name="category" defaultValue="Adjustment">
            {CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </SelectField>
          <SelectField label="Status" name="status" defaultValue="COMPLETED">
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
          </SelectField>
          <TextField label="Reason" name="reason" required />
          <Button type="submit" className="w-full">Confirm</Button>
        </form>
      </Dialog>

      <Dialog open={dialog === "reverse"} title="Reverse transaction" onClose={() => setDialog(null)}>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            void run(`/api/admin/transactions/${reverseId}/reverse`, { reason: data.get("reason") }, "Transaction reversed");
          }}
        >
          <p className="text-sm text-neutral-600">A new opposite entry is created. The original stays on record as reversed.</p>
          <TextField label="Reason" name="reason" required />
          <Button type="submit" className="w-full">Confirm reversal</Button>
        </form>
      </Dialog>

      <Dialog open={dialog === "delete"} title="Delete customer" onClose={() => setDialog(null)}>
        <p className="text-sm text-neutral-600">This removes the customer, their accounts and their history.</p>
        <Button type="button" variant="danger" className="mt-4 w-full" onClick={() => run(`/api/admin/users/${user.id}`, {}, "Customer deleted", "DELETE")}>
          Delete customer
        </Button>
      </Dialog>
    </div>
  );
}
