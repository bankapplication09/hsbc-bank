import Link from "next/link";
import { clsx } from "clsx";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" }) {
  return (
    <button
      className={clsx(
        "press inline-flex h-12 items-center justify-center rounded-lg px-4 text-sm font-semibold transition disabled:opacity-50",
        variant === "primary" && "bg-brand text-white hover:bg-brand-dark",
        variant === "secondary" && "border border-line bg-white text-neutral-900 hover:bg-neutral-50",
        variant === "ghost" && "h-10 text-neutral-700 hover:bg-neutral-100",
        variant === "danger" && "border border-red-200 bg-white text-red-700 hover:bg-red-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextField({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-800">{label}</span>
      <input
        className="h-12 w-full rounded-lg border border-line bg-white px-3 text-base outline-none ring-brand/30 placeholder:text-neutral-400 focus:border-brand focus:ring-2"
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-neutral-800">{label}</span>
      <select
        className="h-12 w-full rounded-lg border border-line bg-white px-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : null}
    </label>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "ACTIVE" || status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-800"
      : status === "PENDING"
        ? "bg-amber-50 text-amber-800"
        : status === "REVERSED"
          ? "bg-neutral-100 text-neutral-600"
          : "bg-red-50 text-red-800";
  return (
    <span className={clsx("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide", tone)}>
      {status.toLowerCase()}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-neutral-500">{body}</p>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
      {message}
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-3 px-5">
      <div className="skeleton h-36 rounded-2xl" />
      <div className="skeleton h-16 rounded-2xl" />
      <div className="skeleton h-16 rounded-2xl" />
    </div>
  );
}

export function Dialog({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="rise max-h-[90dvh] w-full max-w-md overflow-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm text-neutral-500" aria-label="Close">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ title, back, action }: { title: string; back?: string; action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 bg-[#f4f5f7]/95 px-4 py-4 backdrop-blur md:bg-transparent">
      {back ? (
        <Link href={back} className="press grid h-10 w-10 place-items-center rounded-full text-neutral-800" aria-label="Back">
          <span aria-hidden className="text-xl leading-none">
            ‹
          </span>
        </Link>
      ) : null}
      <h1 className="flex-1 text-lg font-semibold tracking-tight">{title}</h1>
      {action}
    </header>
  );
}
