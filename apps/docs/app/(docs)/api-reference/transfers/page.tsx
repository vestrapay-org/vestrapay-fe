import type { Metadata } from "next";
import { EndpointBadge } from "@/components/docs/endpoint-badge";
import { ParameterTable, Parameter } from "@/components/docs/parameter-table";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { ApiPlayground } from "@/components/playground/api-playground";

export const metadata: Metadata = {
  title: "Transfers",
  description: "Initiate bank transfers and payouts via the Vestrapay API.",
};

const TRANSFER_OBJECT = `{
  "id": "trf_Lm7pQzX4Kn2Yw",
  "object": "transfer",
  "amount": 25000,
  "currency": "NGN",
  "status": "pending",
  "recipient": {
    "bank_code": "044",
    "bank_name": "Access Bank",
    "account_number": "0123456789",
    "account_name": "Emeka Eze"
  },
  "narration": "Vendor payout - April",
  "reference": "VND-APR-0042",
  "metadata": {},
  "created": 1745002345,
  "completed_at": null
}`;

export default function TransfersPage(): React.ReactNode {
  return (
    <>
      <h1>Transfers</h1>
      <p>
        Transfer objects represent payouts to bank accounts. Use transfers to disburse vendor
        payments, customer refunds, or any other outbound funds movement.
      </p>

      <Callout type="warning" title="Live accounts only">
        Transfers are only available on live accounts. In the test environment, transfer requests
        succeed immediately with a simulated response but no actual funds move.
      </Callout>

      {/* ── INITIATE ── */}
      <section className="mb-10">
        <h2 id="initiate-transfer" className="mt-0">Initiate a transfer</h2>
        <p>
          Creates and dispatches a new bank transfer. Transfers are processed within one business
          day during banking hours (8 am–5 pm WAT, Monday–Friday).
        </p>

        <EndpointBadge method="POST" path="/v2/transfers" />

        <ApiPlayground
          method="POST"
          path="/v2/transfers"
          fields={[
            { name: "amount", label: "Amount (kobo)", type: "number", placeholder: "25000", required: true },
            {
              name: "currency",
              label: "Currency",
              type: "select",
              required: true,
              options: [{ value: "NGN", label: "NGN. Nigerian Naira" }],
              default: "NGN",
            },
            { name: "bank_code", label: "Bank code", type: "text", placeholder: "044", required: true },
            { name: "account_number", label: "Account number", type: "text", placeholder: "0123456789", required: true },
            { name: "narration", label: "Narration", type: "text", placeholder: "Vendor payout" },
            { name: "reference", label: "Reference", type: "text", placeholder: "VND-APR-0042" },
          ]}
        />

        <ParameterTable title="Body parameters">
          <Parameter name="amount" type="integer" required>
            Transfer amount in the smallest currency unit (kobo for NGN).
          </Parameter>
          <Parameter name="currency" type="string" required>
            Three-letter ISO 4217 code. Currently only <code>ngn</code> is supported.
          </Parameter>
          <Parameter name="bank_code" type="string" required>
            Recipient bank code. See <a href="#bank-codes">bank codes</a> for all supported banks.
          </Parameter>
          <Parameter name="account_number" type="string" required>
            10-digit NUBAN account number of the recipient.
          </Parameter>
          <Parameter name="narration" type="string">
            Description visible on the recipient&apos;s bank statement (max 100 characters).
          </Parameter>
          <Parameter name="reference" type="string">
            Your unique reference. Used for deduplication. if not provided, one is generated.
          </Parameter>
          <Parameter name="metadata" type="object">
            Arbitrary key-value data attached to the transfer.
          </Parameter>
        </ParameterTable>

        <h4>Response</h4>
        <CodeBlock code={TRANSFER_OBJECT} lang="json" title="201 Created" />
      </section>

      {/* ── RETRIEVE ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="retrieve-transfer" className="mt-0">Retrieve a transfer</h2>
        <p>Retrieves a transfer by its ID.</p>

        <EndpointBadge method="GET" path="/v2/transfers/{id}" />

        <ParameterTable title="Path parameters">
          <Parameter name="id" type="string" required>
            Transfer ID prefixed <code>trf_</code>.
          </Parameter>
        </ParameterTable>
      </section>

      {/* ── LIST ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="list-transfers" className="mt-0">List transfers</h2>
        <p>Returns a paginated list of transfers ordered by creation date descending.</p>

        <EndpointBadge method="GET" path="/v2/transfers" />

        <ParameterTable title="Query parameters">
          <Parameter name="limit" type="integer" default="20">Number per page (1–100).</Parameter>
          <Parameter name="after" type="string">Cursor for next page.</Parameter>
          <Parameter name="status" type="string">
            Filter by status: <code>pending</code>, <code>processing</code>, <code>succeeded</code>,{" "}
            <code>failed</code>.
          </Parameter>
          <Parameter name="reference" type="string">Filter by your reference.</Parameter>
        </ParameterTable>
      </section>

      {/* ── VERIFY ACCOUNT ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="verify-account" className="mt-0">Verify bank account</h2>
        <p>
          Resolve an account number to an account name before initiating a transfer. Always call
          this first to show the recipient&apos;s verified name for user confirmation.
        </p>

        <EndpointBadge method="GET" path="/v2/transfers/verify-account" />

        <ParameterTable title="Query parameters">
          <Parameter name="bank_code" type="string" required>Bank code.</Parameter>
          <Parameter name="account_number" type="string" required>10-digit NUBAN number.</Parameter>
        </ParameterTable>

        <CodeBlock
          code={`{
  "account_number": "0123456789",
  "account_name": "Emeka Eze",
  "bank_code": "044",
  "bank_name": "Access Bank"
}`}
          lang="json"
          title="200 OK"
        />
      </section>

      {/* ── BANK CODES ── */}
      <section className="border-t pt-8">
        <h2 id="bank-codes" className="mt-0">Bank codes</h2>
        <p>Common Nigerian bank codes for use in transfer requests:</p>

        <table>
          <thead>
            <tr>
              <th>Bank</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Access Bank", "044"],
              ["Zenith Bank", "057"],
              ["GTBank (Guaranty Trust)", "058"],
              ["First Bank of Nigeria", "011"],
              ["United Bank for Africa (UBA)", "033"],
              ["Sterling Bank", "232"],
              ["Union Bank", "032"],
              ["Fidelity Bank", "070"],
              ["Opay", "999992"],
              ["Moniepoint MFB", "50515"],
              ["Kuda Bank", "50211"],
              ["Palmpay", "999991"],
            ].map(([bank, code]) => (
              <tr key={code}>
                <td>{bank}</td>
                <td>
                  <code>{code}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
