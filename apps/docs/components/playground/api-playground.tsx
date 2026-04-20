"use client";

import { useState } from "react";
import { Play, ChevronDown, ChevronUp, Loader2, CheckCircle, XCircle, Terminal, Code2 } from "lucide-react";
import { CopyButton } from "@/components/docs/copy-button";
import { cn } from "@/lib/utils";
import type { HttpMethod } from "@/components/docs/endpoint-badge";

interface PlaygroundField {
  name: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  default?: string;
}

interface ApiPlaygroundProps {
  method: HttpMethod;
  path: string;
  baseUrl?: string;
  fields?: PlaygroundField[];
}

const METHOD_COLOR: Record<HttpMethod, { pill: string; accent: string; dot: string }> = {
  GET:    { pill: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400", accent: "", dot: "bg-emerald-500" },
  POST:   { pill: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400", accent: "", dot: "bg-blue-500" },
  PUT:    { pill: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400", accent: "", dot: "bg-amber-500" },
  PATCH:  { pill: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400", accent: "", dot: "bg-orange-500" },
  DELETE: { pill: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400", accent: "", dot: "bg-red-500" },
};

type Status = "idle" | "loading" | "success" | "error";

interface MockResponse { status: number; body: unknown; time: number; }

function buildMockResponse(method: HttpMethod, path: string, fields: Record<string, string>): MockResponse {
  const now = Date.now();
  const id = `pay_${Math.random().toString(36).slice(2, 14)}`;

  if (path.includes("payments")) {
    return {
      status: method === "POST" ? 201 : 200,
      time: Math.floor(Math.random() * 120) + 80,
      body: method === "GET"
        ? { id, object: "payment", amount: Number(fields.amount ?? 5000), currency: fields.currency ?? "NGN", status: "succeeded", customer: fields.customer ?? "cus_xK92mPlw3R", description: fields.description ?? "Order #1042", created: Math.floor(now / 1000) }
        : { id, object: "payment", amount: Number(fields.amount ?? 5000), currency: fields.currency ?? "NGN", status: "pending", customer: fields.customer ?? null, description: fields.description ?? null, checkout_url: `https://checkout.vestrapay.com/${id}`, created: Math.floor(now / 1000) },
    };
  }

  if (path.includes("customers")) {
    const cid = `cus_${Math.random().toString(36).slice(2, 12)}`;
    return {
      status: method === "POST" ? 201 : 200,
      time: Math.floor(Math.random() * 80) + 60,
      body: { id: cid, object: "customer", email: fields.email ?? "ada@example.com", name: fields.name ?? "Ada Obi", phone: fields.phone ?? "+2348012345678", created: Math.floor(now / 1000), metadata: {} },
    };
  }

  if (path.includes("transfers")) {
    const tid = `trf_${Math.random().toString(36).slice(2, 12)}`;
    return {
      status: 201,
      time: Math.floor(Math.random() * 100) + 70,
      body: { id: tid, object: "transfer", amount: Number(fields.amount ?? 25000), currency: "NGN", status: "pending", narration: fields.narration ?? "Payout", reference: fields.reference ?? `ref_${Date.now()}`, created: Math.floor(now / 1000) },
    };
  }

  return { status: 200, time: Math.floor(Math.random() * 100) + 50, body: { success: true } };
}

export function ApiPlayground({
  method,
  path,
  baseUrl = "https://api.vestrapay.com",
  fields = [],
}: ApiPlaygroundProps): React.ReactNode {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, f.default ?? ""])),
  );
  const [apiKey, setApiKey] = useState("sk_test_••••••••••••••••");
  const [status, setStatus] = useState<Status>("idle");
  const [response, setResponse] = useState<MockResponse | null>(null);
  const [tab, setTab] = useState<"curl" | "response">("curl");

  const fullPath = `/v2${path}`;
  const fullUrl = `${baseUrl}${fullPath}`;

  const buildCurl = (): string => {
    const bodyFields = fields.filter((f) => f.type !== "select" ? values[f.name] : values[f.name] && values[f.name] !== (f.default ?? ""));
    const bodyObj = method !== "GET" && bodyFields.length > 0
      ? Object.fromEntries(bodyFields.map((f) => [f.name, f.type === "number" ? Number(values[f.name]) : values[f.name]]))
      : null;

    const lines = [
      `curl -X ${method} "${fullUrl}"`,
      `  -H "Authorization: Bearer ${apiKey}"`,
      `  -H "Content-Type: application/json"`,
      ...(bodyObj ? [`  -d '${JSON.stringify(bodyObj, null, 2)}'`] : []),
    ];
    return lines.join(" \\\n");
  };

  const handleSend = (): void => {
    setStatus("loading");
    setTab("response");
    setTimeout(() => {
      const mock = buildMockResponse(method, path, values);
      setResponse(mock);
      setStatus(mock.status < 400 ? "success" : "error");
    }, Math.floor(Math.random() * 600) + 400);
  };

  const colors = METHOD_COLOR[method];

  return (
    <div className={cn("not-prose border-border my-6 overflow-hidden rounded-md border", colors.accent)}>
      {/* Trigger row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="hover:bg-muted/40 flex w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-150"
      >
        <span className={cn("shrink-0 rounded px-2 py-0.5 font-mono text-[0.6875rem] font-bold uppercase tracking-wider", colors.pill)}>
          {method}
        </span>
        <code className="text-foreground min-w-0 flex-1 truncate font-mono text-[0.8125rem]">
          {fullPath}
        </code>
        <span className="text-primary flex shrink-0 items-center gap-1.5 text-[0.8125rem] font-medium">
          <Play className="size-3" />
          Try it
        </span>
        {open
          ? <ChevronUp className="text-muted-foreground size-3.5 shrink-0" />
          : <ChevronDown className="text-muted-foreground size-3.5 shrink-0" />}
      </button>

      {open && (
        <div className="border-border border-t">
          <div className="grid md:grid-cols-[1fr_auto] divide-y md:divide-y-0 md:divide-x divide-border">

            {/* ── Left: inputs ── */}
            <div className="space-y-0 divide-y divide-border">
              {/* API key */}
              <div className="px-4 py-4">
                <label className="text-foreground/40 mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.1em]">
                  Authorization
                </label>
                <div className="border-border bg-muted/20 flex items-center gap-2 rounded-md border px-3 py-2.5 transition-colors duration-150 focus-within:border-foreground/30">
                  <span className="text-muted-foreground shrink-0 font-mono text-[11px]">Bearer</span>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent font-mono text-[0.8125rem] outline-none"
                    placeholder="sk_test_..."
                  />
                </div>
              </div>

              {/* Fields */}
              {fields.length > 0 && (
                <div className="px-4 py-4">
                  <label className="text-foreground/40 mb-3 block text-[10.5px] font-semibold uppercase tracking-[0.1em]">
                    {method === "GET" ? "Query parameters" : "Request body"}
                  </label>
                  <div className="space-y-3">
                    {fields.map((field) => (
                      <div key={field.name} className="grid grid-cols-[120px_1fr] items-center gap-3">
                        <div className="flex items-center gap-1 min-w-0">
                          <code className="text-foreground truncate font-mono text-[12px] font-medium">
                            {field.name}
                          </code>
                          {field.required && <span className="text-destructive shrink-0 text-[10px]">*</span>}
                        </div>
                        {field.type === "select" ? (
                          <select
                            value={values[field.name] ?? ""}
                            onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                            className="border-border bg-background text-foreground rounded-md border px-3 py-2 text-[0.8125rem] outline-none transition-colors duration-150 focus:border-foreground/30"
                          >
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type === "number" ? "number" : "text"}
                            value={values[field.name] ?? ""}
                            onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                            placeholder={field.placeholder}
                            className="border-border bg-background text-foreground placeholder:text-muted-foreground rounded-md border px-3 py-2 text-[0.8125rem] outline-none transition-colors duration-150 focus:border-foreground/30"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Send button */}
              <div className="flex items-center justify-end px-4 py-3.5">
                <button
                  onClick={handleSend}
                  disabled={status === "loading"}
                  className="bg-primary text-primary-foreground flex items-center gap-2 rounded-md px-4 py-2.5 text-[0.875rem] font-medium transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <><Loader2 className="size-3.5 animate-spin" />Sending…</>
                  ) : (
                    <><Play className="size-3.5" />Send Request</>
                  )}
                </button>
              </div>
            </div>

            {/* ── Right: cURL / Response ── */}
            <div className="flex min-w-0 flex-col md:w-85 lg:w-100">
              {/* Tabs */}
              <div
                className="flex items-center border-b"
                style={{ background: "var(--code-bg)", borderColor: "var(--code-border)" }}
              >
                {(["curl", "response"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-mono text-[11.5px] font-medium uppercase tracking-wide transition-all duration-150",
                        tab === t
                        ? "border-foreground text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t === "curl" ? <Terminal className="size-3" /> : <Code2 className="size-3" />}
                    {t === "curl" ? "cURL" : "Response"}
                    {t === "response" && response && (
                      <span className={cn(
                        "ml-1 size-1.5 rounded-full",
                        status === "success" ? "bg-emerald-500" : "bg-red-500",
                      )} />
                    )}
                  </button>
                ))}
                <div className="ml-auto pr-2">
                  <CopyButton
                    text={tab === "curl" ? buildCurl() : (response ? JSON.stringify(response.body, null, 2) : "")}
                    dark
                  />
                </div>
              </div>

              {/* Content */}
              <div
                className="docs-scroll flex-1 overflow-auto p-5"
                style={{ background: "var(--code-bg)" }}
              >
                {tab === "curl" ? (
                  <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed" style={{ color: "var(--shiki-light, #24292e)" }}>
                    <code className="dark:text-(--shiki-dark,#abb2bf)">{buildCurl()}</code>
                  </pre>
                ) : response ? (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      {status === "success"
                        ? <CheckCircle className="size-4 text-emerald-500" />
                        : <XCircle className="size-4 text-red-500" />
                      }
                      <span className={cn(
                        "font-mono text-[13px] font-semibold",
                        status === "success" ? "text-emerald-500" : "text-red-500",
                      )}>
                        {response.status} {status === "success" ? "OK" : "Error"}
                      </span>
                      <span className="text-muted-foreground ml-auto font-mono text-[11px]">
                        {response.time}ms
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed" style={{ color: "var(--shiki-light, #24292e)" }}>
                      <code className="dark:text-(--shiki-dark,#abb2bf)">
                        {JSON.stringify(response.body, null, 2)}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Code2 className="text-muted-foreground/20 mb-3 size-10" />
                    <p className="text-muted-foreground text-[13px]">
                      Hit Send Request to see the response
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
