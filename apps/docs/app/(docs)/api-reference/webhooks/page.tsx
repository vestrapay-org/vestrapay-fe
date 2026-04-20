import type { Metadata } from "next";
import { EndpointBadge } from "@/components/docs/endpoint-badge";
import { ParameterTable, Parameter } from "@/components/docs/parameter-table";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";

export const metadata: Metadata = {
  title: "Webhooks",
  description: "Real-time event notifications via webhooks.",
};

const WEBHOOK_PAYLOAD = `{
  "id": "evt_Xw9mKpQ3Rn7Lz",
  "object": "event",
  "type": "payment.succeeded",
  "created": 1745002512,
  "data": {
    "id": "pay_k9mPlx3Rw7QzA4",
    "object": "payment",
    "amount": 5000,
    "currency": "NGN",
    "status": "succeeded",
    "customer": "cus_xK92mPlw3R",
    "description": "Order #1042",
    "paid_at": 1745002512,
    "metadata": { "order_id": "1042" }
  }
}`;

const VERIFY_SIG = `import crypto from "node:crypto";

function verifyWebhook(rawBody, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");

  const trusted  = Buffer.from(\`sha256=\${expected}\`, "utf8");
  const received = Buffer.from(signature, "utf8");

  return crypto.timingSafeEqual(trusted, received);
}

// Express example
app.post(
  "/webhooks/vestrapay",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["x-vestrapay-signature"];

    if (!verifyWebhook(req.body, sig, process.env.WEBHOOK_SECRET)) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    switch (event.type) {
      case "payment.succeeded":
        await fulfillOrder(event.data.id);
        break;
      case "payment.failed":
        await notifyCustomer(event.data.id);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }

    res.status(200).json({ received: true });
  }
);`;

export default function WebhooksPage(): React.ReactNode {
  return (
    <>
      <h1>Webhooks</h1>
      <p>
        Webhooks let Vestrapay push real-time notifications to your server when events happen in
        your account. Rather than polling for state changes, register an HTTPS endpoint and
        Vestrapay calls it whenever a relevant event occurs.
      </p>

      {/* ── SETUP ── */}
      <section className="mb-10">
        <h2 id="setup" className="mt-0">Setting up webhooks</h2>

        <ol>
          <li>
            In the Vestrapay Dashboard, navigate to <strong>Settings → Webhooks</strong>
          </li>
          <li>
            Click <strong>Add endpoint</strong>
          </li>
          <li>
            Enter your public HTTPS URL (e.g.{" "}
            <code>https://myapp.com/webhooks/vestrapay</code>)
          </li>
          <li>Select the events you want to receive, or subscribe to all events</li>
          <li>
            Copy the generated <strong>signing secret</strong>. you will use this to verify payloads
          </li>
        </ol>

        <Callout type="info">
          Your endpoint must return a <code>2xx</code> status within <strong>30 seconds</strong>.
          If it does not, Vestrapay retries delivery with exponential back-off for up to 72 hours.
        </Callout>
      </section>

      {/* ── PAYLOAD ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="event-structure" className="mt-0">Event structure</h2>
        <p>
          Every webhook payload is a JSON object with a consistent top-level structure regardless
          of event type.
        </p>

        <CodeBlock code={WEBHOOK_PAYLOAD} lang="json" title="Example event payload" />

        <ParameterTable title="Event fields">
          <Parameter name="id" type="string">
            Unique identifier prefixed <code>evt_</code>.
          </Parameter>
          <Parameter name="object" type="string">
            Always <code>&quot;event&quot;</code>.
          </Parameter>
          <Parameter name="type" type="string">
            The event type. See <a href="#event-types">event types</a> for all possible values.
          </Parameter>
          <Parameter name="created" type="Unix timestamp">
            When the event was created.
          </Parameter>
          <Parameter name="data" type="object">
            The full resource object related to this event (payment, customer, transfer, etc.).
          </Parameter>
        </ParameterTable>
      </section>

      {/* ── SIGNATURE VERIFICATION ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="signature-verification" className="mt-0">Verifying signatures</h2>
        <p>
          Every webhook request includes an <code>X-Vestrapay-Signature</code> header containing a
          HMAC-SHA256 signature of the request body. Always verify this before processing.
        </p>

        <CodeBlock code={VERIFY_SIG} lang="javascript" title="Signature verification. Node.js" />

        <Callout type="warning" title="Use the raw request body">
          Compute the HMAC against the raw bytes. not the JSON-decoded object. JSON serialisation
          can alter whitespace and produce a different hash.
        </Callout>
      </section>

      {/* ── RETRY POLICY ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="retry-policy" className="mt-0">Retry policy</h2>
        <p>
          When your endpoint returns a non-<code>2xx</code> status or times out, Vestrapay queues
          a retry:
        </p>

        <table>
          <thead>
            <tr>
              <th>Attempt</th>
              <th>Delay after previous</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["1st retry", "5 minutes"],
              ["2nd retry", "30 minutes"],
              ["3rd retry", "2 hours"],
              ["4th retry", "5 hours"],
              ["5th retry", "10 hours"],
              ["Final retry", "24 hours"],
            ].map(([attempt, delay]) => (
              <tr key={attempt}>
                <td>{attempt}</td>
                <td>{delay}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          After all retries are exhausted, the event is marked <code>failed</code>. You can replay
          it manually from the dashboard.
        </p>
      </section>

      {/* ── EVENT TYPES ── */}
      <section className="mb-10 border-t pt-8">
        <h2 id="event-types" className="mt-0">Event types</h2>

        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Trigger</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["payment.created", "A payment object is created"],
              ["payment.succeeded", "Customer completes payment"],
              ["payment.failed", "Payment attempt fails"],
              ["payment.cancelled", "Customer or merchant cancels"],
              ["payment.refunded", "Full refund issued"],
              ["payment.partially_refunded", "Partial refund issued"],
              ["customer.created", "New customer object created"],
              ["customer.updated", "Customer fields changed"],
              ["customer.deleted", "Customer permanently deleted"],
              ["transfer.created", "Transfer initiated"],
              ["transfer.succeeded", "Transfer settles"],
              ["transfer.failed", "Transfer fails"],
              ["refund.created", "Refund initiated"],
              ["refund.succeeded", "Refund settles"],
              ["dispute.created", "Chargeback filed against a payment"],
              ["dispute.resolved", "Dispute closed (won or lost)"],
            ].map(([event, trigger]) => (
              <tr key={event}>
                <td>
                  <code>{event}</code>
                </td>
                <td>{trigger}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ── WEBHOOK MANAGEMENT ── */}
      <section className="border-t pt-8">
        <h2 id="managing-webhooks" className="mt-0">Managing endpoints</h2>
        <p>Use these endpoints to programmatically manage your webhook configurations.</p>

        <EndpointBadge method="POST" path="/v2/webhooks" description="Register a new endpoint" />
        <EndpointBadge method="GET" path="/v2/webhooks" description="List all registered endpoints" />
        <EndpointBadge method="GET" path="/v2/webhooks/{id}" description="Retrieve a webhook endpoint" />
        <EndpointBadge method="PATCH" path="/v2/webhooks/{id}" description="Update events or URL" />
        <EndpointBadge method="DELETE" path="/v2/webhooks/{id}" description="Remove an endpoint" />
        <EndpointBadge method="POST" path="/v2/webhooks/{id}/test" description="Send a test event to an endpoint" />
      </section>
    </>
  );
}
