import type { Metadata } from "next";
import { EndpointBadge } from "@/components/docs/endpoint-badge";
import { ParameterTable, Parameter } from "@/components/docs/parameter-table";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata: Metadata = {
  title: "SDK Integrations",
  description: "Advanced charging parameters specific for Mobile and Web SDKs.",
};

const BANK_PAYMENT_EXAMPLE = `{
  "reference": "pay_k9mPlx3Rw7QzA4",
  "status": "success",
  "message": "Payment successful"
}`;

const BANK_PAYMENT_REQ = `{
  "accessCode": "acc_x7K9pMqwVz",
  "bankCode": "058",
  "accountNumber": "1234567890"
}`;

const SDK_CHARGE_CARD_EXAMPLE = `{
  "reference": "pay_k9mPlx3Rw7QzA4",
  "status": "pending",
  "redirectUrl": "https://3ds.provider.com/...",
  "message": "Please authorize this transaction."
}`;

const SDK_CHARGE_CARD_REQ = `{
  "accessCode": "acc_x7K9pMqwVz",
  "cardNumber": "4084084084084081",
  "cvv": "123",
  "expiryMonth": "12",
  "expiryYear": "25",
  "cardHolder": "John Doe"
}`;

const COMPLETE_3DS_REQ = `{
  "reference": "pay_k9mPlx3Rw7QzA4"
}`;

const GET_BANKS_EXAMPLE = `{
  "banks": [
    {
      "name": "Guaranty Trust Bank",
      "code": "058",
      "type": "pay-with-bank"
    },
    {
      "name": "Providus Bank",
      "code": "101",
      "type": "pay-with-bank"
    }
  ]
}`;

export default function SdkPage(): React.ReactNode {
  return (
    <>
      <div className="mb-12 max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">SDK Endpoints</h1>
        <p className="mb-10 text-lg text-muted-foreground">
          The SDK endpoints provide fine-grained, stateful control over the payment sequence.
          They are optimized for mobile and web SDKs to handle multi-step verifications like 3DS.
        </p>
      </div>

      <div className="space-y-24">
        {/* ── SDK CHARGE CARD ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="sdk-charge-card" className="mt-0 pt-0 text-xl font-semibold border-none">Charge Card (SDK)</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Charge a card using a pre-initialized checkout session.</p>
            <EndpointBadge method="POST" path="/v1/payment/sdk/charge/card" className="mt-0" />

            <ParameterTable title="Body parameters">
              <Parameter name="accessCode" type="string" required>
                The access code retrieved from initializing the checkout session.
              </Parameter>
              <Parameter name="cardNumber" type="string">
                The full card PAN.
              </Parameter>
              <Parameter name="cvv" type="string">
                Card security code.
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
            </ParameterTable>
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={SDK_CHARGE_CARD_REQ} lang="json" title="Request Body" />
            <CodeBlock code={SDK_CHARGE_CARD_EXAMPLE} lang="json" title="Response (200 OK)" />
          </div>
        </section>

        <div className="h-px bg-border my-12" />

        {/* ── SDK COMPLETE 3DS ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="sdk-complete-3ds" className="mt-0 pt-0 text-xl font-semibold border-none">Complete 3DS</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Complete a 3D Secure authentication flow initiated via the SDK.</p>
            <EndpointBadge method="POST" path="/v1/payment/sdk/charge/card/3ds-complete" className="mt-0" />

            <ParameterTable title="Body parameters">
              <Parameter name="reference" type="string" required>
                The payment reference from the initial charge request.
              </Parameter>
            </ParameterTable>
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={COMPLETE_3DS_REQ} lang="json" title="Request Body" />
          </div>
        </section>

        <div className="h-px bg-border my-12" />

        {/* ── SDK BANK PAYMENT ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="sdk-bank-payment" className="mt-0 pt-0 text-xl font-semibold border-none">Bank Payment (Direct Debit)</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Initiate a direct bank debit via the SDK.</p>
            <EndpointBadge method="POST" path="/v1/payment/sdk/charge/bank-payment" className="mt-0" />

            <ParameterTable title="Body parameters">
              <Parameter name="accessCode" type="string" required>
                Checkout session access code.
              </Parameter>
              <Parameter name="bankCode" type="string">
                The CBN code of the customer's selected bank.
              </Parameter>
              <Parameter name="accountNumber" type="string">
                The customer's bank account number.
              </Parameter>
            </ParameterTable>
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={BANK_PAYMENT_REQ} lang="json" title="Request Body" />
            <CodeBlock code={BANK_PAYMENT_EXAMPLE} lang="json" title="Response (200 OK)" />
          </div>
        </section>

        <div className="h-px bg-border my-12" />

        {/* ── SDK BANK TRANSFER ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="sdk-bank-transfer" className="mt-0 pt-0 text-xl font-semibold border-none">Bank Transfer (SDK)</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Generate a bank transfer virtual account relative to a checkout session.</p>
            <EndpointBadge method="POST" path="/v1/payment/sdk/charge/bank-transfer" className="mt-0" />

            <ParameterTable title="Body parameters">
              <Parameter name="accessCode" type="string" required>
                Checkout session access code.
              </Parameter>
            </ParameterTable>
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={'{ "accessCode": "acc_x7K9pMqwVz" }'} lang="json" title="Request Body" />
          </div>
        </section>

        <div className="h-px bg-border my-12" />

        {/* ── SDK USSD ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="sdk-ussd" className="mt-0 pt-0 text-xl font-semibold border-none">USSD (SDK)</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Generates a USSD code tied to the active checkout session.</p>
            <EndpointBadge method="POST" path="/v1/payment/sdk/charge/ussd" className="mt-0" />

            <ParameterTable title="Body parameters">
              <Parameter name="accessCode" type="string" required>
                Checkout session access code.
              </Parameter>
              <Parameter name="bankCode" type="string">
                Selected bank code for generating the USSD string.
              </Parameter>
            </ParameterTable>
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={'{ "accessCode": "acc_x7K9pMqwVz", "bankCode": "058" }'} lang="json" title="Request Body" />
          </div>
        </section>

        <div className="h-px bg-border my-12" />

        {/* ── GET BANKS ── */}
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <h2 id="get-banks" className="mt-0 pt-0 text-xl font-semibold border-none">Get Supported Banks</h2>
            <p className="text-[15px] text-muted-foreground mb-6">Retrieve a list of supported banks for Pay-with-Bank direct debit channels.</p>
            <EndpointBadge method="GET" path="/v1/payment/sdk/banks/pay-with-bank" className="mt-0" />
          </div>
          <div className="sticky top-24 lg:mt-0 mt-8 space-y-4">
            <CodeBlock code={GET_BANKS_EXAMPLE} lang="json" title="Response (200 OK)" />
          </div>
        </section>

      </div>
    </>
  );
}
