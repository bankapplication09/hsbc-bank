"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ApiError, api } from "@/lib/client";
import { Button, ErrorState, TextField } from "./ui";
import { Wordmark } from "./shells";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api<{ redirect: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, remember, code: code || undefined }),
      });
      router.replace(result.redirect);
      router.refresh();
    } catch (cause) {
      if (cause instanceof ApiError && cause.needsCode) setNeedsCode(true);
      setError(cause instanceof ApiError ? cause.message : "Log on failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error ? <ErrorState message={error} /> : null}
      <TextField label="Email" type="text" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <div className="relative">
        <TextField
          label="Password"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="button" className="absolute right-3 top-9 text-neutral-500" onClick={() => setShow((value) => !value)} aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" className="accent-[#db0011]" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
        Remember me
      </label>
      {needsCode ? (
        <TextField label="Staff code" inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value)} required />
      ) : null}
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Signing in…" : "Log on"}
      </Button>
    </form>
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@hsbcuk.co.uk");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [needsCode, setNeedsCode] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api<{ redirect: string }>("/api/auth/admin-login", {
        method: "POST",
        body: JSON.stringify({ email, password, code }),
      });
      router.replace(result.redirect);
      router.refresh();
    } catch (cause) {
      if (cause instanceof ApiError && cause.needsCode) setNeedsCode(true);
      setError(cause instanceof ApiError ? cause.message : "Log on failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error ? <ErrorState message={error} /> : null}
      <TextField label="Staff email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <div className="relative">
        <TextField label="Password" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button type="button" className="absolute right-3 top-9 text-neutral-500" onClick={() => setShow((value) => !value)} aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {needsCode ? (
        <TextField label="Staff code" inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value)} required />
      ) : null}
      <div className="text-right text-sm">
        <Link href="/admin/forgot-password" className="font-medium text-brand">
          Forgot password
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Signing in…" : "Staff log on"}
      </Button>
    </form>
  );
}

export function AuthScreen({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-mist">
      <header className="bg-brand px-5 py-4">
        <Wordmark onDark />
      </header>
      <div className="mx-auto flex w-full max-w-md flex-col px-5 py-10">
        <div className="panel p-6 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-charcoal">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-muted">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? <div className="mt-6 text-center text-sm text-muted">{footer}</div> : null}
      </div>
    </main>
  );
}

export function ForgotForm({ portal }: { portal: "USER" | "ADMIN" }) {
  const [email, setEmail] = useState(portal === "ADMIN" ? "admin@hsbcuk.co.uk" : "user@hsbcuk.co.uk");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api<{ message: string; resetUrl?: string }>("/api/auth/forgot", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(result.message);
      setResetUrl(result.resetUrl ?? "");
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error ? <ErrorState message={error} /> : null}
      {message ? <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}
      {resetUrl ? (
        <p className="break-all rounded-xl bg-neutral-100 px-3 py-2 text-xs">
          Reset link: <Link href={resetUrl} className="text-brand">{resetUrl}</Link>
        </p>
      ) : null}
      <TextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Please wait…" : "Continue"}
      </Button>
    </form>
  );
}

export function ResetForm({ token, portal }: { token: string; portal: "USER" | "ADMIN" }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/auth/reset", { method: "POST", body: JSON.stringify({ token, password }) });
      router.replace(portal === "ADMIN" ? "/admin/login" : "/login");
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Reset failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {error ? <ErrorState message={error} /> : null}
      <TextField label="New password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <p className="text-xs text-neutral-500">At least 10 characters, with upper and lower case, a number and a symbol.</p>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Saving…" : "Set password"}
      </Button>
    </form>
  );
}
