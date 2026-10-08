"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  CalendarClock,
  Car,
  CircleHelp,
  CreditCard,
  Eye,
  FileText,
  FolderOpen,
  Gauge,
  Globe,
  HandCoins,
  House,
  KeyRound,
  Landmark,
  Lock,
  Minus,
  Percent,
  PieChart,
  PiggyBank,
  QrCode,
  Receipt,
  Repeat,
  Shield,
  SlidersHorizontal,
  Star,
  Tag,
  Target,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { serviceSections } from "@/lib/services";

const icons: Record<string, LucideIcon> = {
  qr: QrCode,
  transfer: ArrowLeftRight,
  receipt: Receipt,
  repeat: Repeat,
  wallet: Wallet,
  calendar: CalendarClock,
  globe: Globe,
  hand: HandCoins,
  chart: TrendingUp,
  pie: PieChart,
  shield: Shield,
  landmark: Landmark,
  briefcase: Briefcase,
  eye: Eye,
  banknote: Wallet,
  house: House,
  car: Car,
  minus: Minus,
  calculator: Calculator,
  piggy: PiggyBank,
  lock: Lock,
  clock: CalendarClock,
  star: Star,
  percent: Percent,
  card: CreditCard,
  sliders: SlidersHorizontal,
  gauge: Gauge,
  key: KeyRound,
  file: FileText,
  tag: Tag,
  folder: FolderOpen,
  book: BookOpen,
  building: Building2,
  bell: Bell,
  help: CircleHelp,
  target: Target,
};

export function HomeServices() {
  return (
    <div className="mt-6 space-y-6">
      {serviceSections.map((section) => (
        <section key={section.title}>
          <h2 className="mb-3 text-sm font-semibold">{section.title}</h2>
          <div className="grid grid-cols-4 gap-x-2 gap-y-4">
            {section.items.map((entry) => {
              const Icon = icons[entry.icon] ?? Wallet;
              return (
                <Link key={entry.slug} href={entry.href} className="press flex flex-col items-center gap-1.5 text-center">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand shadow-sm ring-1 ring-line">
                    <Icon size={20} />
                  </span>
                  <span className="max-w-[4.8rem] text-[11px] font-medium leading-tight text-neutral-700">{entry.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
