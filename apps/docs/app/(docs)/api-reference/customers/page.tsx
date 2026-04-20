import type { Metadata } from "next";
import { EndpointBadge } from "@/components/docs/endpoint-badge";
import { ParameterTable, Parameter } from "@/components/docs/parameter-table";
import { CodeBlock } from "@/components/docs/code-block";
import { ApiPlayground } from "@/components/playground/api-playground";

export const metadata: Metadata = {
  title: "Customers",
  description: "Manage customer profiles and saved payment methods.",
};

const CUSTOMER_OBJECT = `{
  "id": "cus_xK92mPlw3R",
  "object": "customer",
  "email": "ada@example.com",
  "name": "Ada Obi",
  "phone": "+2348012345678",
  "description": "Premium subscriber",
  "metadata": { "plan": "pro" },
  "payment_methods": {
    "object": "list",
    "data": [
      {
        "id": "pm_4Xw9QzK3Rp",
        "type": "card",
        "card": {
          "brand": "mastercard",
          "last4": "5252",
          "exp_month": 8,
          "exp_year": 2028
        },
        "is_default": true
      }
    ]
  },
  "created": 1745002345
}`;

const CREATE_RESPONSE = `{
  "id": "cus_xK92mPlw3R",
  "object": "customer",
  "email": "ada@example.com",
  "name": "Ada Obi",
  "phone": "+2348012345678",
  "description": null,
  "metadata": {},
  "payment_methods": { "object": "list", "data": [] },
  "created": 1745002345
}`;

const LIST_RESPONSE = `{
  "object": "list",
  "data": [
    {
      "id": "cus_xK92mPlw3R",
      "object": "customer",
      "email": "ada@example.com",
      "name": "Ada Obi",
      "created": 1745002345
    }
  ],
  "pagination": {
    "has_more": false,
    "next_cursor": null,
    "total_count": 1
  }
}`;

export default function CustomersPage(): React.ReactNode {
  return (
    <>
      <h1>Customers</h1>
      <p>
        Customer objects store identity and payment method data for repeat buyers. When you supply a{" "}
        <code>customer</code> ID at payment creation, Vestrapay offers the customer&apos;s saved payment
        methods at checkout. dramatically increasing conversion for returning users.
      </p>

      {/* ── CREATE ── */}
      <section className="mb-10">
        <h2 id="create-customer" className="mt-0">Create a customer</h2>
        <p>Creates a new Customer object. At minimum, provide an email address.</p>

        <EndpointBadge method="POST" path="/v2/customers" />

        <ApiPlayground
          method="POST"
          path="/v2/customers"
          fields={[
            { name: "email", label: "Email", type: "text", placeholder: "ada@example.com", required: true },
            { name: "name", label: "Name", type: "text", placeholder: "Ada Obi" },
            { name: "phone", label: "Phone", type: "text", placeholder: "+2348012345678" },
            { name: "description", label: "Description", type: "text", placeholder: "Premium subscriber" },
          ]}
        />

        <ParameterTable title="Body parameters">
          <Parameter name="email" type="string" required>
            Customer&apos;s email address. Used for receipts and dispute notifications.
          </Parameter>
          <Parameter name="name" type="string">
            Customer&apos;s full name. Shown on the checkout page.
          </Parameter>
          <Parameter name="phone" type="string">
            Phone number in E.164 format (e.g. <code>+2348012345678</code>).
          </Parameter>
          <Parameter name="description" type="string">
            An internal description not shown to the customer.
          </Parameter>
          <Parameter name="metadata" type="object">
            Arbitrary key-value data to store alongside the customer.
          </Parameter>
        </ParameterTable>

        <h4>Response</h4>
        <CodeBlock code={CREATE_RESPONSE} lang="json" title="201 Created" />
      </section>

      {/* ── RETRIEVE ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="retrieve-customer" className="mt-0">Retrieve a customer</h2>
        <p>Retrieves a customer by ID, including their saved payment methods.</p>

        <EndpointBadge method="GET" path="/v2/customers/{id}" />

        <ApiPlayground
          method="GET"
          path="/v2/customers/{id}"
          fields={[
            { name: "id", label: "Customer ID", type: "text", placeholder: "cus_xK92mPlw3R", required: true },
          ]}
        />

        <h4>Response</h4>
        <CodeBlock code={CUSTOMER_OBJECT} lang="json" title="200 OK" />
      </section>

      {/* ── UPDATE ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="update-customer" className="mt-0">Update a customer</h2>
        <p>Updates mutable fields on a customer. Only the fields you supply are changed.</p>

        <EndpointBadge method="PATCH" path="/v2/customers/{id}" />

        <ParameterTable title="Body parameters">
          <Parameter name="email" type="string">Updated email address.</Parameter>
          <Parameter name="name" type="string">Updated full name.</Parameter>
          <Parameter name="phone" type="string">Updated phone number.</Parameter>
          <Parameter name="description" type="string">Updated internal description.</Parameter>
          <Parameter name="metadata" type="object">
            Metadata is merged: new keys are added, existing keys are updated. Pass <code>null</code> to
            a key to remove it.
          </Parameter>
        </ParameterTable>
      </section>

      {/* ── LIST ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="list-customers" className="mt-0">List customers</h2>
        <p>Returns a paginated list of customers ordered by creation date descending.</p>

        <EndpointBadge method="GET" path="/v2/customers" />

        <ParameterTable title="Query parameters">
          <Parameter name="limit" type="integer" default="20">Number of customers per page (1–100).</Parameter>
          <Parameter name="after" type="string">Cursor for the next page.</Parameter>
          <Parameter name="email" type="string">Filter by exact email address.</Parameter>
        </ParameterTable>

        <h4>Response</h4>
        <CodeBlock code={LIST_RESPONSE} lang="json" title="200 OK" />
      </section>

      {/* ── DELETE ── */}
      <section className="border-t pt-8">
        <h2 id="delete-customer" className="mt-0">Delete a customer</h2>
        <p>
          Permanently deletes a customer. Cannot be undone. Associated payments and transaction
          history are retained for compliance purposes.
        </p>

        <EndpointBadge method="DELETE" path="/v2/customers/{id}" />

        <h4>Response</h4>
        <CodeBlock
          code={`{
  "id": "cus_xK92mPlw3R",
  "object": "customer",
  "deleted": true
}`}
          lang="json"
          title="200 OK"
        />
      </section>
    </>
  );
}
