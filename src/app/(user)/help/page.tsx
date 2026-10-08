import { PageHeader } from "@/components/ui";

const topics = [
  {
    title: "Log on",
    body: "Use your HSBC UK email and password. Staff use the separate staff log on.",
  },
  {
    title: "Hide your balance",
    body: "Use the eye on the home account card. Showing the balance again asks for your 4-digit password.",
  },
  {
    title: "Payments",
    body: "Move money between your own HSBC UK savings accounts, or share your details to receive money. Paying someone else is not available.",
  },
  {
    title: "Statements",
    body: "Pick an account and a date range, then download a CSV of the entries.",
  },
  {
    title: "Card controls",
    body: "Freeze the card, or turn contactless, online payments and cash withdrawals on or off.",
  },
  {
    title: "Balance updates",
    body: "When funds are added or removed, you will see a new transaction and a notification.",
  },
];

export default function HelpPage() {
  return (
    <div>
      <PageHeader title="Help" back="/home" />
      <div className="space-y-3 px-5">
        {topics.map((topic) => (
          <section key={topic.title} className="rounded-2xl bg-white p-4 ring-1 ring-line">
            <h2 className="font-semibold">{topic.title}</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-600">{topic.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
