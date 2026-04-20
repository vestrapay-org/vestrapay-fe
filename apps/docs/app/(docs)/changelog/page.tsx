import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "API version history, new features, and breaking changes.",
};

interface ChangeEntry {
  type: "feature" | "improvement" | "fix" | "breaking" | "deprecated";
  text: string;
}

interface Release {
  version: string;
  date: string;
  summary: string;
  changes: ChangeEntry[];
}

const RELEASES: Release[] = [
  {
    version: "2.0.0",
    date: "2026-03-01",
    summary: "Major release introducing multi-currency support, enhanced webhooks, and the new Transfers API.",
    changes: [
      { type: "breaking", text: "Amounts are now always integers in the smallest currency unit. Float amounts are rejected with a 400 error." },
      { type: "breaking", text: "Webhook payloads now use a top-level `data` key instead of `payload`. Update all webhook handlers." },
      { type: "feature", text: "Multi-currency support: NGN, USD, GHS, and KES now available on all accounts." },
      { type: "feature", text: "New Transfers API for bank payouts (`POST /v2/transfers`)." },
      { type: "feature", text: "Account verification endpoint. resolve account numbers before initiating transfers." },
      { type: "feature", text: "Restricted API keys with per-resource permission scoping." },
      { type: "feature", text: "Idempotency key support on all POST endpoints." },
      { type: "improvement", text: "Payment checkout URL now expires after configurable `expires_in` (default 24h)." },
      { type: "improvement", text: "Webhook retry window extended from 24 hours to 72 hours." },
      { type: "improvement", text: "List endpoints now support `created[gte]` and `created[lte]` date range filters." },
    ],
  },
  {
    version: "1.5.0",
    date: "2025-10-15",
    summary: "Customer management improvements, partial refunds, and webhook management API.",
    changes: [
      { type: "feature", text: "Partial refunds. pass `amount` to `POST /v1/payments/:id/refund` to refund a specific amount." },
      { type: "feature", text: "Customer payment methods. saved cards returned on customer retrieval under `payment_methods`." },
      { type: "feature", text: "Webhook management API. create, update, and delete endpoints programmatically." },
      { type: "feature", text: "Test endpoint for webhooks. `POST /v1/webhooks/:id/test` to send a sample event." },
      { type: "improvement", text: "Payment list now supports filtering by `customer` and `status`." },
      { type: "improvement", text: "Customer `DELETE` now returns a deleted confirmation object." },
      { type: "fix", text: "Fixed a race condition where simultaneous payment creates with the same email could create duplicate customers." },
    ],
  },
  {
    version: "1.4.0",
    date: "2025-07-08",
    summary: "Metadata support, expanded error codes, and response time improvements.",
    changes: [
      { type: "feature", text: "Metadata field available on Payment, Customer, and Refund objects." },
      { type: "feature", text: "New error codes: `expired_card`, `incorrect_cvc`, `do_not_honour`, `fraudulent`." },
      { type: "improvement", text: "API response times reduced by ~35% through infrastructure upgrades." },
      { type: "improvement", text: "Error responses now include a `doc_url` field linking directly to the relevant documentation." },
      { type: "fix", text: "Fixed incorrect `total_count` values on list endpoints when using date filters." },
    ],
  },
  {
    version: "1.3.0",
    date: "2025-04-22",
    summary: "USSD and mobile money payment methods, plus improved 3DS support.",
    changes: [
      { type: "feature", text: "USSD payment method support at checkout for all major Nigerian telcos." },
      { type: "feature", text: "Mobile money support for Opay, Kuda, Palmpay, and Moniepoint." },
      { type: "feature", text: "3DS2 frictionless flow. qualifying low-risk transactions complete without customer interaction." },
      { type: "improvement", text: "Checkout page redesign with improved mobile experience." },
    ],
  },
  {
    version: "1.2.0",
    date: "2025-02-10",
    summary: "Expanded SDK coverage and performance improvements.",
    changes: [
      { type: "feature", text: "Official Python SDK released (`pip install vestrapay`)." },
      { type: "feature", text: "Official Go SDK released (`go get github.com/vestrapay/vestrapay-go`)." },
      { type: "improvement", text: "Node.js SDK rewritten in TypeScript with full type definitions." },
      { type: "fix", text: "Fixed webhook signature verification for payloads containing non-ASCII characters." },
    ],
  },
  {
    version: "1.0.0",
    date: "2024-11-01",
    summary: "General availability. Payments, Customers, and Webhooks.",
    changes: [
      { type: "feature", text: "Payments API. create, retrieve, list, and refund payments." },
      { type: "feature", text: "Customers API. create, update, retrieve, list, and delete customers." },
      { type: "feature", text: "Webhooks. `payment.succeeded`, `payment.failed`, and `refund.created` events." },
      { type: "feature", text: "Hosted checkout with Visa, Mastercard, and Verve card support." },
      { type: "feature", text: "Node.js SDK (`npm install @vestrapay/node`)." },
    ],
  },
];

const CHANGE_STYLES: Record<ChangeEntry["type"], { label: string; classes: string }> = {
  feature:     { label: "New",        classes: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" },
  improvement: { label: "Improved",   classes: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
  fix:         { label: "Fixed",      classes: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400" },
  breaking:    { label: "Breaking",   classes: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" },
  deprecated:  { label: "Deprecated", classes: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
};

export default function ChangelogPage(): React.ReactNode {
  return (
    <article className="prose">
      <h1>Changelog</h1>
      <p>
        All notable changes to the Vestrapay API. Versioning follows{" "}
        <a href="https://semver.org">Semantic Versioning</a>. Breaking changes always increment
        the major version and are announced at least 12 months in advance.
      </p>

      <div className="not-prose mt-8 space-y-10">
        {RELEASES.map((release) => (
          <div key={release.version}>
            {/* Release header */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="border-border text-foreground rounded-md border px-2.5 py-1 font-mono text-[13px] font-semibold">
                v{release.version}
              </span>
              <time className="text-muted-foreground text-[13px]">
                {new Date(release.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {release.version.startsWith("2.") && (
                <span className="bg-primary text-primary-foreground rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                  Latest
                </span>
              )}
            </div>

            <p className="text-muted-foreground mb-3 text-[13.5px] leading-relaxed">
              {release.summary}
            </p>

            {/* Changes */}
            <ul className="space-y-2">
              {release.changes.map((change, i) => {
                const style = CHANGE_STYLES[change.type];
                return (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 shrink-0 rounded px-1.5 py-px text-[10.5px] font-semibold uppercase tracking-wide ${style.classes}`}
                    >
                      {style.label}
                    </span>
                    <span className="text-muted-foreground text-[13.5px] leading-relaxed">
                      {change.text}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Divider */}
            <div className="border-border mt-8 border-b" />
          </div>
        ))}
      </div>
    </article>
  );
}
