import { LoginForm } from "@/components/auth-forms";
import { HsbcLogo } from "@/components/logo";

export default function LoginPage() {
  return (
    <main className="relative isolate min-h-dvh overflow-x-hidden bg-[#ffe8ea]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 -top-24 h-[26rem] w-[26rem] rounded-full bg-[#ffb3ba] blur-[90px]" />
        <div className="absolute right-[-5rem] top-[20%] h-[22rem] w-[22rem] rounded-full bg-[#ff8f99]/80 blur-[100px]" />
        <div className="absolute bottom-[-8rem] left-[22%] h-[24rem] w-[32rem] rounded-full bg-white/70 blur-[90px]" />
        <div className="absolute left-1/2 top-[42%] h-80 w-80 -translate-x-1/2 rounded-full bg-[#ff9aa3]/80 blur-3xl" />
        <svg viewBox="0 0 200 174" className="absolute left-[8%] top-[22%] hidden w-44 opacity-80 sm:block">
          <polygon points="100,2 186.6,50 186.6,136.6 100,172 13.4,136.6 13.4,50" fill="none" stroke="#db0011" strokeOpacity="0.25" strokeWidth="3" />
          <polygon points="13.4,50 13.4,136.6 100,86.6" fill="#db0011" fillOpacity="0.08" />
          <polygon points="186.6,50 186.6,136.6 100,86.6" fill="#db0011" fillOpacity="0.08" />
        </svg>
        <svg viewBox="0 0 200 174" className="absolute bottom-[6%] right-[7%] w-48 opacity-70 sm:w-64">
          <polygon points="100,2 186.6,50 186.6,136.6 100,172 13.4,136.6 13.4,50" fill="#ffffff" fillOpacity="0.35" />
          <polygon points="13.4,50 13.4,136.6 100,86.6" fill="#db0011" fillOpacity="0.12" />
          <polygon points="186.6,50 186.6,136.6 100,86.6" fill="#db0011" fillOpacity="0.12" />
        </svg>
      </div>

      <div className="relative h-16 bg-brand sm:h-20" aria-hidden />

      <div className="relative mx-auto w-full max-w-[28rem] px-5 py-10 sm:py-16">
        <div className="rounded-3xl border border-white/80 bg-white/30 px-5 py-7 shadow-[0_20px_50px_rgba(219,0,17,0.1)] backdrop-blur-2xl sm:px-7 sm:py-8">
          <HsbcLogo size={64} />
          <h1 className="mt-6 text-[2rem] font-medium leading-tight tracking-tight text-black">Welcome to HSBC UK</h1>
          <p className="mt-3 text-[15px] leading-6 text-[#333]">Log on to online banking.</p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
