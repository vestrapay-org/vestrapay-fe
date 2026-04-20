import type { Metadata } from "next";
import { EndpointBadge } from "@/components/docs/endpoint-badge";
import { ParameterTable, Parameter } from "@/components/docs/parameter-table";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata: Metadata = {
  title: "Payments",
  description: "Charge cards, process USSD, and manage bank transfers with the Vestrapay API.",
};

const CHARGE_CARD_EXAMPLE = `{
  "reference": "pay_k9mPlx3Rw7QzA4",
  "status": "success",
  "redirectUrl": "",
  "message": "Charge successful"
}`;

const CHARGE_CARD_REQ = `{
  "amount": 5000,
  "currency": "NGN",
  "email": "customer@example.com",
  "cardNumber": "4084084084084081",
  "cvv": "123",
  "expiryMonth": "12",
  "expiryYear": "25"
}`;

const BANK_TRANSFER_EXAMPLE = `{
  "reference": "pay_k9mPlx3Rw7QzA4",
  "accountNumber": "1234567890",
  "accountName": "Vestrapay Checkout",
  "bankName": "Providus Bank",
  "expiresAt": "2026-04-14T22:30:00Z"
}`;

const BANK_TRANSFER_REQ = `{
  "amount": 10000,
  "currency": "NGN",
  "email": "customer@example.com"
}`;

const USSD_EXAMPLE = `{
  "reference": "pay_k9mPlx3Rw7QzA4",
  "ussdCode": "*737*50*5000#",
  "expiresAt": "2026-04-14T22:30:00Z"
}`;

const USSD_REQ = `{
  "amount": 5000,
  "currency": "NGN",
  "email": "customer@example.com",
  "bankCode": "058"
}`;

const VERIFY_EXAMPLE = `{
  "reference": "pay_k9mPlx3Rw7QzA4",
  "status": "success",
  "amount": 5000,
  "currency": "NGN",
  "channel": "card",
  "paidAt": "2026-04-14T22:15:00Z",
  "metadata": {}
}`;

export default function PaymentsPage(): React.ReactNode {
  return (
    <>
      <div className="mb-12 max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Payments</h1>
        <p className="mb-10 text-lg text-muted-foreground">
          The Payments API is the core engine for direct server-to-server charging.
          Use these endpoints to directly process cards, bank transfers, and USSD bypassing
          our hosted checkout system.
        </p>
      </div>

      <div className="space-y-24">
        {/* ── CHARGE CARD ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="charge-card" className="mt-0 pt-0 text-xl font-semibold border-none">Charge Card</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Directly charge a customer's debit or credit card.</p>
            <EndpointBadge method="POST" path="/v1/payment/charge/card" className="mt-0" />

            <ParameterTable title="Body parameters">
              <Parameter name="idempotencyKey" type="string">
                Unique key to prevent duplicate charges.
              </Parameter>
              <Parameter name="amount" type="int64" required>
                Payment amount in the smallest currency unit.
              </Parameter>
              <Parameter name="currency" type="string">
                Three-letter ISO 4217 currency code.
              </Parameter>
              <Parameter name="email" type="string">
                Customer email address.
              </Parameter>
              <Parameter name="cardNumber" type="string">
                Pan/Card number. Redacted in logs.
              </Parameter>
              <Parameter name="cvv" type="string">
                Card security code (CVV/CVC).
              </Parameter>
              <Parameter name="expiryMonth" type="string">
                2-digit expiration month.
              </Parameter>
              <Parameter name="expiryYear" type="string">
                2-digit or 4-digit expiration year.
              </Parameter>
              <Parameter name="cardHolder" type="string">
                Name on the card.
              </Parameter>
              <Parameter name="callbackUrl" type="string">
                URL to redirect the customer after a successful payment (for 3DS).
              </Parameter>
              <Parameter name="metadata" type="object">
                Key-value pairs for additional information.
              </Parameter>
            </ParameterTable>
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={CHARGE_CARD_REQ} lang="json" title="Request Body" />
            <CodeBlock code={CHARGE_CARD_EXAMPLE} lang="json" title="Response (200 OK)" />
          </div>
        </section>

        <div className="h-px bg-border my-12" />

        {/* ── BANK TRANSFER ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="bank-transfer" className="mt-0 pt-0 text-xl font-semibold border-none">Bank Transfer</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Generates a dynamic bank account number for a customer to transfer funds securely.</p>
            <EndpointBadge method="POST" path="/v1/payment/bank-transfer" className="mt-0" />

            <ParameterTable title="Body parameters">
              <Parameter name="idempotencyKey" type="string">
                Unique key to prevent duplicate requests.
              </Parameter>
              <Parameter name="amount" type="int64" required>
                Payment amount in the smallest currency unit.
              </Parameter>
              <Parameter name="currency" type="string">
                Three-letter ISO 4217 currency code.
              </Parameter>
              <Parameter name="email" type="string">
                Customer email address.
              </Parameter>
            </ParameterTable>
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={BANK_TRANSFER_REQ} lang="json" title="Request Body" />
            <CodeBlock code={BANK_TRANSFER_EXAMPLE} lang="json" title="Response (200 OK)" />
          </div>
        </section>

        <div className="h-px bg-border my-12" />

        {/* ── USSD ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="ussd" className="mt-0 pt-0 text-xl font-semibold border-none">USSD Payment</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Generates a USSD code that customers can dial to complete a payment on their mobile phones.</p>
            <EndpointBadge method="POST" path="/v1/payment/ussd" className="mt-0" />

            <ParameterTable title="Body parameters">
              <Parameter name="idempotencyKey" type="string">
                Unique key to prevent duplicate requests.
              </Parameter>
              <Parameter name="amount" type="int64" required>
                Payment amount in the smallest currency unit.
              </Parameter>
              <Parameter name="currency" type="string">
                Three-letter ISO 4217 currency code.
              </Parameter>
              <Parameter name="email" type="string">
                Customer email address.
              </Parameter>
              <Parameter name="bankCode" type="string">
                The CBN code of the customer's selected bank.
              </Parameter>
            </ParameterTable>
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={USSD_REQ} lang="json" title="Request Body" />
            <CodeBlock code={USSD_EXAMPLE} lang="json" title="Response (200 OK)" />
          </div>
        </section>

        <div className="h-px bg-border my-12" />

        {/* ── VERIFY TRANSACTION ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="verify" className="mt-0 pt-0 text-xl font-semibold border-none">Verify Transaction</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Verify the status of a transaction by its reference. It is strongly recommended to verify transactions before giving value.</p>
            <EndpointBadge method="GET" path="/v1/payment/verify/{reference}" className="mt-0" />

            <ParameterTable title="Path parameters">
              <Parameter name="reference" type="string" required>
                The transaction reference returned during initiation.
              </Parameter>
            </ParameterTable>
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={VERIFY_EXAMPLE} lang="json" title="Response (200 OK)" />
          </div>
        </section>
      </div>
    </>
  );
}
