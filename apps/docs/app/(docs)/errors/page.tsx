import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata: Metadata = {
  title: "Errors & Troubleshooting",
  description: "HTTP status codes, error codes, and debugging guides.",
};

const ERROR_SHAPE = `{
  "error": {
    "code": "card_declined",
    "message": "The card was declined by the issuer.",
    "decline_code": "insufficient_funds",
    "param": null,
    "payment_intent": "pay_k9mPlx3Rw7QzA4",
    "doc_url": "https://docs.vestrapay.com/errors#card_declined"
  }
}`;

interface ErrorRow {
  code: string;
  status: number;
  description: string;
}

const HTTP_ERRORS: ErrorRow[] = [
  { code: "400", status: 400, description: "Bad Request. malformed JSON or missing required parameter" },
  { code: "401", status: 401, description: "Unauthorized. invalid or missing API key" },
  { code: "402", status: 402, description: "Request Failed. valid parameters but the request couldn't be processed (e.g. unverified account)" },
  { code: "403", status: 403, description: "Forbidden. your API key doesn't have permission for this operation" },
  { code: "404", status: 404, description: "Not Found. the requested resource doesn't exist" },
  { code: "409", status: 409, description: "Conflict. the request conflicts with the current state (e.g. duplicate idempotency key with different params)" },
  { code: "422", status: 422, description: "Unprocessable Entity. parameters are valid but failed business-logic validation" },
  { code: "429", status: 429, description: "Too Many Requests. rate limit exceeded" },
  { code: "500", status: 500, description: "Server Error. something went wrong on Vestrapay's end" },
];

interface ApiErrorRow {
  code: string;
  description: string;
}

const API_ERRORS: ApiErrorRow[] = [
  { code: "invalid_amount", description: "Amount must be a positive integer in the smallest currency unit." },
  { code: "invalid_currency", description: "The supplied currency code is not supported or not enabled on your account." },
  { code: "invalid_api_key", description: "The API key provided is not valid." },
  { code: "api_key_expired", description: "The API key has been rotated and is no longer active." },
  { code: "card_declined", description: "The card was declined by the issuing bank." },
  { code: "insufficient_funds", description: "The card has insufficient funds to complete the transaction." },
  { code: "expired_card", description: "The card's expiry date has passed." },
  { code: "incorrect_cvc", description: "The CVC number is incorrect." },
  { code: "do_not_honour", description: "The issuing bank has declined the transaction without providing a reason." },
  { code: "fraudulent", description: "Vestrapay's fraud detection flagged this transaction." },
  { code: "payment_not_found", description: "No payment exists with the supplied ID." },
  { code: "payment_already_succeeded", description: "The payment has already been completed and cannot be modified." },
  { code: "payment_not_refundable", description: "The payment cannot be refunded (e.g. it failed or is disputed)." },
  { code: "refund_exceeds_amount", description: "The refund amount is greater than the remaining refundable balance." },
  { code: "customer_not_found", description: "No customer exists with the supplied ID." },
  { code: "transfer_not_found", description: "No transfer exists with the supplied ID." },
  { code: "account_not_verified", description: "Your account requires additional verification before this operation is allowed." },
  { code: "live_mode_disabled", description: "Your account is not enabled for live transactions. Complete KYC verification in the dashboard." },
  { code: "idempotency_conflict", description: "An idempotency key was reused with different request parameters." },
  { code: "rate_limit_exceeded", description: "You have exceeded the API rate limit. Retry after the time specified in Retry-After." },
  { code: "webhook_invalid_signature", description: "The webhook signature could not be verified against the payload." },
];

const STATUS_COLORS: Record<number, string> = {
  400: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  401: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  402: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  403: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  404: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400",
  409: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  422: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  429: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  500: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default function ErrorsPage(): React.ReactNode {
  return (
    <article className="prose">
      <h1>Errors &amp; Troubleshooting</h1>
      <p>
        The Vestrapay API uses conventional HTTP status codes and returns a consistent error object
        on every failure. This makes it straightforward to handle errors programmatically.
      </p>

      <h2 id="error-object">Error object</h2>
      <p>
        Every error response includes an <code>error</code> object with these fields:
      </p>

      <CodeBlock code={ERROR_SHAPE} lang="json" />

      <div className="not-prose border-border mb-6 overflow-hidden rounded-md border text-[13px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="text-foreground/60 border-border border-b px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider">Field</th>
              <th className="text-foreground/60 border-border border-b px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              { field: "code", desc: "Machine-readable error code. Use this for programmatic handling." },
              { field: "message", desc: "Human-readable description of the error." },
              { field: "decline_code", desc: "For card_declined errors, the specific reason from the issuer." },
              { field: "param", desc: "The request parameter that caused the error, if applicable." },
              { field: "payment_intent", desc: "The payment ID associated with the error, when relevant." },
              { field: "doc_url", desc: "Direct link to this error in the documentation." },
            ].map(({ field, desc }) => (
              <tr key={field} className="border-border border-b last:border-b-0 hover:bg-muted/40">
                <td className="px-4 py-2.5">
                  <code className="text-inline-code-color font-mono text-[12.5px] font-medium">{field}</code>
                </td>
                <td className="text-muted-foreground px-4 py-2.5">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="http-status-codes">HTTP status codes</h2>

      <div className="not-prose border-border mb-6 overflow-hidden rounded-md border text-[13px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="text-foreground/60 border-border border-b px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider">Status</th>
              <th className="text-foreground/60 border-border border-b px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {HTTP_ERRORS.map(({ code, status, description }) => (
              <tr key={code} className="border-border border-b last:border-b-0 hover:bg-muted/40">
                <td className="px-4 py-2.5">
                  <span className={`inline-block rounded px-2 py-0.5 font-mono text-[11.5px] font-semibold ${STATUS_COLORS[status] ?? ""}`}>
                    {code}
                  </span>
                </td>
                <td className="text-muted-foreground px-4 py-2.5">{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="api-error-codes">API error codes</h2>
      <p>
        These codes appear in the <code>error.code</code> field and are stable across API versions.
        Use them in your error handling logic.
      </p>

      <div className="not-prose border-border mb-6 overflow-hidden rounded-md border text-[13px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="text-foreground/60 border-border border-b px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider">Code</th>
              <th className="text-foreground/60 border-border border-b px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody>
            {API_ERRORS.map(({ code, description }) => (
              <tr key={code} className="border-border border-b last:border-b-0 hover:bg-muted/40">
                <td className="px-4 py-2.5">
                  <code className="text-[12.5px]">{code}</code>
                </td>
                <td className="text-muted-foreground px-4 py-2.5">{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="handling-errors">Handling errors in code</h2>

      <CodeBlock
        lang="javascript"
        title="Node.js. structured error handling"
        code={`try {
  const payment = await vestrapay.payments.create({ amount, currency });
} catch (err) {
  if (err instanceof Vestrapay.errors.VestrapaError) {
    switch (err.code) {
      case "card_declined":
        return res.status(402).json({
          message: "Your card was declined. Please try a different card.",
          decline_code: err.declineCode,
        });

      case "insufficient_funds":
        return res.status(402).json({
          message: "Your card has insufficient funds.",
        });

      case "rate_limit_exceeded":
        // Retry after the specified delay
        await sleep(err.retryAfter * 1000);
        return retryPayment(amount, currency);

      default:
        // Log unexpected errors
        logger.error("Unexpected Vestrapay error", { code: err.code, message: err.message });
        return res.status(500).json({ message: "Payment processing failed. Please try again." });
    }
  }
  throw err; // Re-throw non-Vestrapay errors
}`}
      />

      <h2 id="troubleshooting">Common troubleshooting scenarios</h2>

      <h3 id="webhook-not-firing">Webhook not firing</h3>
      <p>
        If your webhook endpoint is not receiving events:
      </p>
      <ul>
        <li>Verify the endpoint URL is correct and publicly reachable (not <code>localhost</code>)</li>
        <li>Check the dashboard under <strong>Webhooks → Recent deliveries</strong> for error responses</li>
        <li>Ensure your endpoint returns a <code>2xx</code> status within 30 seconds</li>
        <li>Confirm the events you subscribed to include the ones you expect</li>
      </ul>

      <h3 id="signature-verification-failing">Signature verification failing</h3>
      <p>
        The most common cause is parsing JSON before verifying. Always pass the raw byte buffer:
      </p>

      <CodeBlock
        lang="javascript"
        code={`// Wrong. JSON already parsed, signature will fail
app.post("/webhooks", express.json(), (req, res) => {
  vestrapay.webhooks.verify(req.body, sig, secret); // fails
});

// Correct. raw buffer
app.post("/webhooks", express.raw({ type: "application/json" }), (req, res) => {
  vestrapay.webhooks.verify(req.body, sig, secret); // works
});`}
      />

      <h3 id="idempotency-409">Idempotency conflict (409)</h3>
      <p>
        A <code>409 Conflict</code> on an idempotent request means the same key was used with
        different parameters. Generate a fresh, unique idempotency key per logical operation. for
        example, include the cart ID and attempt number: <code>cart_abc123-attempt-1</code>.
      </p>
    </article>
  );
}
