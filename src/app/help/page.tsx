import Link from "next/link";
import { CircleHelp, Mail, Phone } from "lucide-react";
import { BankingPageIntro } from "@/components/page-intro";
import { Card, PageHeader, SectionHeader } from "@/components/ui";
import { getSession } from "@/server/auth";

const faqs = [
  {
    title: "Getting started",
    paragraphs: [
      "After you log on, the home screen shows a greeting, your primary balance card, quick actions, and a preview of recent activity. Use the menu on desktop or the bottom navigation on mobile to reach Accounts, Payments, Transactions, and more.",
      "If this is your first visit, open Accounts to confirm which savings accounts are linked to your profile, then try a small transfer between your own accounts under Payments to see how confirmation and receipts work in the demo.",
      "Explore additional services from the home grid — each tile opens a dedicated screen with forms, calculators, or empty states that explain what would happen in a full production bank.",
    ],
  },
  {
    title: "Log on and security",
    paragraphs: [
      "Use your registered email address and password on the log on screen. For this demonstration, customer and staff accounts are provided separately — staff members who manage customers should use an admin email and will be taken to the staff console after a successful log on.",
      "If you choose “Remember me”, your session may stay signed in on this device for longer. Always log off on shared or public devices. This app uses a secure session cookie; you may see a “Secure session” indicator in the header while you are signed in.",
      "After several failed log on attempts, access is paused for a short period to protect your account. Never share your password or 4-digit balance PIN with anyone, including people who claim to be from the bank.",
      "We will never ask you to move money to a “safe account” or to install remote-access software. If you are unsure about a message or call, stop and use official HSBC UK contact channels outside this demo.",
    ],
  },
  {
    title: "Balances and the 4-digit password",
    paragraphs: [
      "Your available balance is shown on the home screen and on each account. If you turn on “Hide balances”, amounts are masked until you enter your 4-digit password (demo PIN: set when the account was seeded).",
      "The eye control on the primary account card hides or reveals balances. Changing this preference in Settings may also require your 4-digit password when revealing amounts again.",
      "Balances and transactions in this environment are for practice only. They do not reflect real money at HSBC or any other bank. Pending items, if shown, are illustrative and may not match real clearing times.",
    ],
  },
  {
    title: "Accounts and cards",
    paragraphs: [
      "The Accounts area lists your savings accounts, masked account numbers, and the latest activity line. Open an account to see more detail, controls, and recent entries.",
      "Debit cards linked to an account can be managed under Cards. You can freeze or unfreeze a card, adjust daily limits where supported, and toggle contactless, online, and ATM usage in this demo.",
      "Card numbers are always masked in the app. Never share your full card number, PIN, or online banking password with anyone who contacts you unexpectedly.",
      "Closing or opening new products in this demo may be simulated only. Real account applications are subject to eligibility, credit checks, and product terms from HSBC UK.",
    ],
  },
  {
    title: "Payments and transfers",
    paragraphs: [
      "Under Payments you can move money between your own HSBC UK savings accounts in this demo. Choose the source and destination account, enter the amount and an optional reference, review the details, then confirm.",
      "Use Receive to copy your sort code and account number so someone else can pay you. Incoming credits appear in your transaction list when demo funds are added.",
      "The Saved payees tab lists people or businesses you have stored for faster payments. In this savings-focused demo, paying external bank accounts may be blocked with an explanatory message — this mirrors some real product restrictions.",
      "Standing orders and scheduled payments can be created from Explore or Payments-related flows where available. They run against demo data and show how dates and amounts would be presented in live banking.",
      "Paying external payees or setting up certain payment types may be limited in this savings-focused demo. Icons such as UPI or bill pay may show demonstration workflows only.",
    ],
  },
  {
    title: "Transactions and statements",
    paragraphs: [
      "Transactions are grouped by day with sticky date headings. Use search and filters to narrow by direction, status, account, category, or date range. Select a row to open transaction detail including reference and status.",
      "Completed payments usually appear immediately in this demo. In live banking, some transfers can take longer depending on the payment scheme and the receiving bank.",
      "Statements let you choose an account and date range, then download a CSV file of entries for your records. This is suitable for reconciliation in spreadsheets, not for official tax or legal evidence in this demo.",
      "If you cannot find a payment, check that the correct account filter is selected and that the date range includes the day you made the transfer.",
    ],
  },
  {
    title: "Explore and extra services",
    paragraphs: [
      "The home services grid links to features such as request money, UPI-style flows, loans calculators, investments watchlists, and cheque book requests. Each screen explains whether the action is stored locally on your device (demo only) or sent to the server.",
      "Data saved in your browser for demo purposes (for example draft payees or watchlist symbols) is not synced across devices and can be cleared if you clear site data.",
      "Rates, product names, and investment content are fictional and for layout training. They are not recommendations to buy or sell any financial product.",
    ],
  },
  {
    title: "Profile, settings, and notifications",
    paragraphs: [
      "Profile shows your name, contact details, and account summary. Sensitive changes in a live app would often require step-up authentication; here, some fields are read-only for demonstration.",
      "Settings (from the sidebar) holds preferences such as hiding balances and alert toggles. Profile no longer duplicates those controls — use Settings for display and notification options.",
      "The bell icon shows notifications about demo activity, such as transfers or balance changes. Open Notifications to mark items as read.",
      "Alert preferences for transactions and statements can be updated under Settings. In a live bank, these would control email or push alerts.",
    ],
  },
  {
    title: "Mobile app (WebView)",
    paragraphs: [
      "The companion mobile project loads this website inside a secure WebView. Point it at the deployed URL using the environment variable documented in the mobile project’s example env file.",
      "Log on once inside the app; session behaviour matches the browser. For the best experience, use the same demo credentials you use on desktop.",
    ],
  },
  {
    title: "Staff and administration",
    paragraphs: [
      "Staff users with an admin role can access the staff console to view customers, transactions, audit logs, and demonstration tools. Admin log on uses the same entry page with staff credentials.",
      "Actions taken in the staff console are recorded in the audit log for training and review purposes in this demo environment.",
      "Staff should follow your organisation’s data-handling policies when using real customer data in any non-demo deployment. This build is intended for synthetic or anonymised practice data only.",
    ],
  },
];

const termsSections: { heading: string; paragraphs: string[] }[] = [
  {
    heading: "1. About this service",
    paragraphs: [
      "This application is a fictional demonstration of digital banking layouts and workflows. It is not operated by HSBC Bank plc as a live banking channel, unless you have been explicitly told otherwise by your organisation.",
      "No real payments, investments, or account openings are processed through this demo. Any resemblance to HSBC UK products or branding is for training and user-interface practice only.",
    ],
  },
  {
    heading: "2. Eligibility and acceptable use",
    paragraphs: [
      "Access is limited to authorised demo users. You must be at least 18 years old or have permission from your organisation to use this environment for training.",
      "You must not attempt to probe, disrupt, or reverse-engineer the service, scrape data at scale, or use automated tools to overload hosting. You must not enter real credentials, live account numbers, or personal data belonging to people who have not consented to this test environment.",
      "You agree to use the demo only for lawful purposes aligned with the project that provisioned your access.",
    ],
  },
  {
    heading: "3. Demonstration data and no advice",
    paragraphs: [
      "Balances, transactions, rates, and product information may be sample or randomly generated data. Interest rates, fees, and product names are illustrative and do not constitute an offer or invitation to apply.",
      "Investment and loan calculators provide estimates only. They do not take into account your personal circumstances and are not financial, legal, or tax advice. Always obtain professional advice before making real financial decisions.",
    ],
  },
  {
    heading: "4. Security and privacy",
    paragraphs: [
      "You are responsible for keeping your demo password and PIN confidential. We apply reasonable technical measures in hosting, but you should treat this site as non-production. Do not use the same password you use for real banking or email.",
      "Session data, error logs, and audit entries may be stored on servers used for deployment (for example cloud hosting and database providers). Your organisation’s privacy notice may apply if this demo is used internally.",
      "Do not upload confidential documents or special-category personal data unless your organisation has approved this environment for that purpose.",
    ],
  },
  {
    heading: "5. Availability and changes",
    paragraphs: [
      "The service may be unavailable during maintenance, deployments, or infrastructure issues. Features may change without notice as the demo is updated.",
      "There is no service-level agreement for uptime in this environment. We may reset or reseed databases during upgrades, which can remove demo transactions you created.",
    ],
  },
  {
    heading: "6. Liability",
    paragraphs: [
      "To the fullest extent permitted by law, the providers of this demo accept no liability for loss arising from use of the application, reliance on demo content, downtime, or unauthorised access where you have failed to protect your credentials.",
      "Nothing in these terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under applicable law.",
    ],
  },
  {
    heading: "7. Intellectual property",
    paragraphs: [
      "Software, design, and documentation are protected by copyright and related rights. HSBC-style branding is used for demonstration and training only where permitted by the project owner.",
      "You may not copy, scrape, or redistribute the application for commercial use without written permission. Trademarks belong to their respective owners.",
    ],
  },
  {
    heading: "8. Third-party services",
    paragraphs: [
      "The demo may rely on third-party hosting, databases, and analytics. Those providers have their own terms and privacy policies. Links to external sites, if any, are provided for convenience and do not imply endorsement.",
    ],
  },
  {
    heading: "9. Changes to these terms",
    paragraphs: [
      "These terms may be updated when the demo is redeployed. Continued use after changes are published on this page constitutes acceptance of the revised terms.",
      "The effective date shown in the section header reflects the latest published version in this build. We encourage you to review this page periodically.",
    ],
  },
  {
    heading: "10. Governing law and contact",
    paragraphs: [
      "Unless your organisation specifies otherwise, these demo terms are intended for internal training use and may be governed by the laws applicable to the entity hosting the deployment.",
      "For questions about this demonstration environment, contact the team that provisioned your access. This is not a channel for reporting fraud or disputes on real HSBC accounts — use official HSBC UK channels for live banking matters.",
    ],
  },
];

const quickLinks = [
  { href: "#faq", label: "FAQs" },
  { href: "#contact", label: "Contact" },
  { href: "#terms-and-conditions", label: "Terms and conditions" },
];

export default async function HelpPage() {
  const session = await getSession();
  const signedInUser = session?.user.role === "USER" && session.portal === "USER";
  const back = signedInUser ? "/home" : "/login";

  return (
    <div className="md:pt-2">
      <PageHeader title="Help" back={back} />
      <div className="space-y-8 px-4 pb-12 md:px-0">
        <BankingPageIntro
          title="Help and support"
          description="Guidance for using this HSBC UK-style demo: log on, accounts, payments, statements, security, and legal information."
          icon={CircleHelp}
        />

        <Card padding="md">
          <p className="text-sm leading-relaxed text-muted">
            This help centre is written for the demonstration banking app. It explains how screens behave, what is simulated, and
            where real banking limits apply. Use the links below to jump to FAQs, demo contact details, or the full terms and
            conditions. Logging on to the app means you agree to those terms in addition to any rules from your organisation.
          </p>
          <nav className="mt-4 flex flex-wrap gap-3" aria-label="Help sections">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-mist"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </Card>

        <section id="faq">
          <SectionHeader title="Frequently asked questions" description="Detailed answers for common tasks in the app." />
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.title} padding="md">
                <h2 className="text-base font-semibold text-charcoal">{faq.title}</h2>
                <div className="mt-3 space-y-3">
                  {faq.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="contact">
          <SectionHeader title="Contact (demonstration)" description="Not a live HSBC support line." />
          <Card className="space-y-4">
            <p className="text-sm leading-relaxed text-muted">
              This demo does not connect to HSBC UK telephone banking or secure messaging. The details below are placeholders for
              layout only. For real HSBC UK support, visit hsbc.co.uk and use official contact options.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              If you are testing the mobile shell, ensure the site URL in your mobile environment matches the deployment your team
              shared. Connection or certificate issues are usually configuration problems rather than account problems.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="font-medium text-charcoal">General enquiries (demo)</span>
                  <br />
                  <span className="text-muted">03457 404 404 — illustrative only</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="font-medium text-charcoal">Secure message (demo)</span>
                  <br />
                  <span className="text-muted">Not available in this build</span>
                </span>
              </li>
            </ul>
            {signedInUser ? (
              <Link href="/notifications" className="text-sm font-semibold text-brand hover:underline">
                View in-app notifications
              </Link>
            ) : null}
          </Card>
        </section>

        <section id="terms-and-conditions">
          <SectionHeader
            title="Terms and conditions"
            description="Demo terms for this practice banking application. Effective date: 9 October 2026."
          />
          <Card padding="md" className="space-y-6">
            <p className="text-sm leading-relaxed text-muted">
              Please read these terms carefully before using the application. By logging on and using the services, you agree to the
              following conditions in addition to any rules set by the organisation hosting this demo.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              These terms do not replace your real HSBC UK account terms if you hold live products with HSBC. They apply only to
              this software demonstration.
            </p>
            {termsSections.map((block) => (
              <article key={block.heading}>
                <h3 className="text-sm font-semibold text-charcoal">{block.heading}</h3>
                <div className="mt-2 space-y-2">
                  {block.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="text-sm leading-relaxed text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            ))}
            <p className="border-t border-line pt-4 text-xs text-muted">
              © Demo HSBC UK banking UI. This is not an official HSBC Bank plc customer agreement. Version 1.1 — demonstration
              purposes only.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
