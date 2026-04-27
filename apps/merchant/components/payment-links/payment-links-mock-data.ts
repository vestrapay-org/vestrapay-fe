import type { PaymentLinkRow, PaymentLinkStatus } from "./payment-links-types";

const LINK_NAMES = [
  "Sneaker Drop Sale",
  "Enterprise Q4 Invoice",
  "Wholesale Batch #12",
  "Creator Payout Portal",
  "Holiday Gift Cards",
  "API Sandbox Checkout",
  "Subscription Renewal",
  "Event Tickets — Lagos",
];

const ACCOUNTS = [
  "Main Settlement - HSBC",
  "EUR Operating - Deutsche Bank",
  "GBP Treasury - Barclays",
  "USD Clearing - J.P. Morgan",
];

function linkIdForIndex(i: number): string {
  const partA = String(8800 + (i % 200)).padStart(4, "0");
  const suffix = ["XJ", "KM", "PQ", "RT", "NV", "LW", "BZ", "HQ"][i % 8]!;
  return `LNK-${partA}-${suffix}`;
}

function amountForIndex(i: number): string {
  const base = 1200 + i * 137 + (i % 7) * 89;
  const cents = (i * 17) % 100;
  return `${base.toLocaleString("en-US")}.${String(cents).padStart(2, "0")}`;
}

function statusForIndex(i: number): PaymentLinkStatus {
  return i % 5 === 2 ? "EXPIRED" : "ACTIVE";
}

function expiresForIndex(i: number, status: PaymentLinkStatus): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[(i + 3) % 12]!;
  const day = 10 + (i % 18);
  const year = status === "EXPIRED" ? 2023 : 2025;
  return `${m} ${day}, ${year}`;
}

export const PAYMENT_LINKS_TOTAL = 24;

export function buildPaymentLinksDataset(total: number): PaymentLinkRow[] {
  return Array.from({ length: total }, (_, i) => {
    const status = statusForIndex(i);
    const currencies: PaymentLinkRow["currency"][] = ["USD", "EUR", "GBP"];
    const bearers: PaymentLinkRow["feeBearer"][] = ["MERCHANT", "CUSTOMER"];

    if (i === 0) {
      return {
        id: "pl-1",
        linkName: "Sneaker Drop Sale",
        linkIdDisplay: "LNK-8829-XJ",
        amountDisplay: "2,450.00",
        currency: "USD" as const,
        accountMapped: ACCOUNTS[0]!,
        feeBearer: "MERCHANT" as const,
        expiresLabel: "Oct 24, 2024",
        status: "ACTIVE" as const,
      };
    }

    return {
      id: `pl-${i + 1}`,
      linkName: LINK_NAMES[i % LINK_NAMES.length]!,
      linkIdDisplay: linkIdForIndex(i),
      amountDisplay: amountForIndex(i),
      currency: currencies[i % 3]!,
      accountMapped: ACCOUNTS[i % ACCOUNTS.length]!,
      feeBearer: bearers[i % 2]!,
      expiresLabel: expiresForIndex(i, status),
      status,
    };
  });
}
