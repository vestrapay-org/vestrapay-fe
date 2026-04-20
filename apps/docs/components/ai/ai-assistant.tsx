"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, ChevronRight, User, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CURATED_PROMPTS = [
  "How do I create my first payment?",
  "What API keys do I need for testing?",
  "How do I handle webhook events?",
  "What are the supported currencies?",
  "How do I issue a refund?",
  "How do I manage recurring billing?",
  "What does a 402 error mean?",
  "Can I split a payment between accounts?",
];

const KB: Record<string, string> = {
  create: `To create a payment, send a POST to /v2/payments with amount and currency:\n\n{"amount": 5000, "currency": "NGN", "description": "Order #1042"}\n\nYou will receive a checkout_url. Redirect your customer there. The payment starts as pending and moves to succeeded once paid.\n\nSee the Payments API reference for all available fields.`,
  "api key": `Vestrapay uses two key types:\n\n- Test keys (sk_test_... / pk_test_...): Development only. No real charges.\n- Live keys (sk_live_... / pk_live_...): Production with real transactions.\n\nGet your keys from the Dashboard under Settings > API Keys. Never commit secret keys to version control.`,
  webhook: `Webhooks let Vestrapay notify your server when events happen. Configure your endpoint in the dashboard, then listen for events like payment.succeeded, payment.failed, and refund.created.\n\nAlways verify the X-Vestrapay-Signature header to ensure requests are genuine. See the Webhooks reference for the signature verification code.`,
  currency: `Vestrapay currently supports:\n\n- NGN (Nigerian Naira, min: 100 kobo)\n- USD (US Dollar, min: 1 cent)\n- GHS (Ghanaian Cedi, min: 5 pesewas)\n- KES (Kenyan Shilling, min: 100 cents)\n\nPass the lowercase ISO 4217 code in your request.`,
  refund: `To issue a refund, POST to /v2/payments/{id}/refund:\n\n{"amount": 2500, "reason": "customer_request"}\n\nOmit amount for a full refund. Refunds typically settle within 5-10 business days. The refund status moves from pending to succeeded when it settles.`,
  "402": `A 402 error usually means:\n\n1. Using a live key on an unverified account\n2. Account not fully verified (check your dashboard)\n3. The requested currency is not enabled\n\nCheck your dashboard for outstanding verification steps or contact support@vestrapay.com.`,
  recurring: `For recurring billing, store the customer.id from the first payment and pass it in subsequent charges:\n\n{"amount": 9900, "currency": "NGN", "customer": "cus_abc123", "description": "Monthly plan - April"}\n\nVestrapay offers the saved payment method at checkout. See the Recurring Billing guide for dunning logic and cancellation flows.`,
  split: `Payment splitting is available via the split parameter on payment creation. Contact your account manager to enable it. Once enabled:\n\n{"amount": 10000, "split": {"type": "flat", "subaccounts": [{"id": "sub_abc", "amount": 3000}]}}\n\nThe remainder goes to your main account after fees.`,
};

function getResponse(query: string): string {
  const q = query.toLowerCase();
  for (const [key, answer] of Object.entries(KB)) {
    if (q.includes(key)) return answer;
  }
  return `I can help with Vestrapay API questions. Try asking about:\n\n- Creating payments\n- API keys and authentication\n- Webhooks and events\n- Supported currencies\n- Issuing refunds\n- Error codes\n\nOr browse the full documentation for comprehensive guides.`;
}

interface AiSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AiSidebar({ open, onClose }: AiSidebarProps): React.ReactNode {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string): void => {
    if (!text.trim() || thinking) return;
    setMessages((m) => [...m, { role: "user", content: text.trim() }]);
    setInput("");
    setThinking(true);
    const delay = Math.floor(Math.random() * 700) + 500;
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: getResponse(text) },
      ]);
      setThinking(false);
    }, delay);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "bg-background border-border fixed top-0 right-0 z-40 flex h-screen w-full max-w-sm flex-col border-l shadow-md",
          "transition-transform duration-250 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <div className="bg-muted flex size-7 items-center justify-center rounded-md">
            <Sparkles className="text-foreground size-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-[13px] font-semibold leading-none">
              Vesper AI
            </p>
            <p className="text-muted-foreground mt-0.5 text-[11px] leading-none">
              Documentation assistant
            </p>
          </div>
          <div className="flex items-center gap-0.5">
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  setInput("");
                }}
                className="text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-md transition-colors hover:bg-muted/50"
                title="Clear conversation"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-md transition-colors hover:bg-muted/50"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="docs-scroll flex-1 overflow-y-auto px-4 py-5">
          {messages.length === 0 && (
            <div className="animate-fade-in">
              <p className="text-muted-foreground mb-4 text-[13px] leading-relaxed">
                Ask anything about the Vestrapay API.
              </p>
              <div className="space-y-1.5">
                {CURATED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => send(prompt)}
                    className="border-border hover:bg-muted/40 group flex w-full items-center gap-2 rounded-md border px-3 py-2.5 text-left transition-colors duration-150"
                  >
                    <ChevronRight className="text-muted-foreground size-3 shrink-0" />
                    <span className="text-foreground text-[12.5px]">
                      {prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "animate-fade-in flex gap-2.5",
                  msg.role === "user" && "flex-row-reverse",
                )}
              >
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md",
                    msg.role === "assistant" ? "bg-muted" : "bg-muted",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="text-foreground size-3" />
                  ) : (
                    <User className="text-muted-foreground size-3" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[84%] rounded-md px-3 py-2.5 text-[12.5px] leading-relaxed",
                    msg.role === "assistant"
                      ? "bg-muted/60 text-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {msg.content.split("\n").map((line, j) => (
                    <p
                      key={j}
                      className={
                        j > 0 && line.length > 0
                          ? "mt-1.5"
                          : line.length === 0
                            ? "mt-1"
                            : ""
                      }
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="animate-fade-in flex gap-2.5">
                <div className="bg-muted flex size-6 shrink-0 items-center justify-center rounded-md">
                  <Sparkles className="text-foreground size-3" />
                </div>
                <div className="bg-muted/60 flex items-center gap-1.5 rounded-md px-3.5 py-3">
                  <span className="bg-muted-foreground/50 size-1.5 animate-bounce rounded-full [animation-delay:0ms]" />
                  <span className="bg-muted-foreground/50 size-1.5 animate-bounce rounded-full [animation-delay:150ms]" />
                  <span className="bg-muted-foreground/50 size-1.5 animate-bounce rounded-full [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          <div ref={bottomRef} />
        </div>

        <div className="border-border shrink-0 border-t p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-border bg-background flex items-center gap-2 rounded-md border px-3 py-2 transition-colors duration-150 focus-within:border-foreground/30"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the API..."
              className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-[13px] outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || thinking}
              className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded transition-opacity duration-150 hover:opacity-90 disabled:opacity-40"
            >
              <Send className="size-3" />
            </button>
          </form>
          <p className="text-muted-foreground mt-1.5 text-center text-[11px]">
            AI responses are for guidance only
          </p>
        </div>
      </aside>
    </>
  );
}
