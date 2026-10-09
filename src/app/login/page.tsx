import Link from "next/link";
import { LoginForm } from "@/components/auth-forms";
import { HsbcLogo } from "@/components/logo";
import { SecureSessionBadge } from "@/components/ui";

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-mist">
      <header className="bg-brand px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <HsbcLogo onDark size={72} />
          <SecureSessionBadge />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-10 lg:grid-cols-2 lg:items-center lg:py-16">
        <div className="hidden lg:block">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-brand">Personal banking</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-charcoal">Welcome to HSBC UK</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Log on to view accounts, make payments, and manage your money securely. This is a demonstration environment for
            practice only.
          </p>
          <div className="mt-8 h-px w-16 bg-brand" aria-hidden />
        </div>

        <div className="panel mx-auto w-full max-w-md p-6 sm:p-8">
          <div className="lg:hidden">
            <HsbcLogo size={56} />
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-charcoal">Welcome to HSBC UK</h1>
            <p className="mt-2 text-sm text-muted">Log on to online banking.</p>
          </div>
          <div className="mt-6 lg:mt-0">
            <h2 className="sr-only">Log on</h2>
            <LoginForm />
          </div>
          <p className="mt-6 border-t border-line pt-4 text-center text-sm text-muted">
            Staff?{" "}
            <Link href="/admin/forgot-password" className="font-semibold text-brand hover:underline">
              Staff password help
            </Link>
          </p>
          <p className="mt-3 text-center text-xs text-muted">
            <Link href="/help" className="hover:text-charcoal hover:underline">
              Help
            </Link>
            {" · "}
            <Link href="/help#terms-and-conditions" className="hover:text-charcoal hover:underline">
              Terms and conditions
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
