"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Lock } from "@/components/icons";
import { PaymentResult } from "@/components/payment-result";
import { formatCurrency } from "@/lib/formatters";
import { getCheckoutConfig, ApiError } from "@/lib/api";
import { NoTransaction } from "@/app/_components/no-transaction";
import { MethodNav } from "./_components/method-nav";
import { CheckoutHeader } from "./_components/checkout-header";
import { CheckoutSkeleton } from "./_components/checkout-skeleton";
import {
  CHANNEL_METHOD_MAP,
  METHOD_CONFIG_MAP,
  PAYMENT_COMPONENTS,
  TRANSITION_MS,
  REDIRECT_DELAY_MS,
} from "./_lib/constants";
import type { CheckoutState, PaymentOutcome, PaymentMethodConfig } from "./_lib/types";
import type { PaymentMethod } from "@/lib/types";

interface MethodState {
  readonly active: PaymentMethod;
  readonly display: PaymentMethod;
  readonly transitioning: boolean;
}

const DEFAULT_METHOD: PaymentMethod = "card";

const DEFAULT_METHOD_STATE: MethodState = {
  active: DEFAULT_METHOD,
  display: DEFAULT_METHOD,
  transitioning: false,
} as const;

export default function CheckoutPage(): React.ReactNode {
  const { accessCode } = useParams<{ accessCode: string }>();

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ phase: "loading" });
  const [methodState, setMethodState] = useState<MethodState>(DEFAULT_METHOD_STATE);
  const [outcome, setOutcome] = useState<PaymentOutcome>(null);

  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect((): (() => void) => {
    let cancelled = false;

    getCheckoutConfig(accessCode)
      .then(({ data }): void => {
        if (cancelled) return;
        setCheckoutState({ phase: "ready", config: data });

        const firstChannel = data.channels[0];
        if (firstChannel !== undefined) {
          const method: PaymentMethod = CHANNEL_METHOD_MAP[firstChannel];
          setMethodState({ active: method, display: method, transitioning: false });
        }
      })
      .catch((err: unknown): void => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setCheckoutState({ phase: "not-found" });
          return;
        }
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setCheckoutState({ phase: "error", message });
      });

    return (): void => {
      cancelled = true;
      if (transitionTimer.current !== null) clearTimeout(transitionTimer.current);
    };
  }, [accessCode]);

  function switchMethod(method: PaymentMethod): void {
    if (method === methodState.active) return;
    if (transitionTimer.current !== null) clearTimeout(transitionTimer.current);
    setMethodState((prev) => ({ ...prev, active: method, transitioning: true }));
    transitionTimer.current = setTimeout((): void => {
      setMethodState((prev) => ({ ...prev, display: method, transitioning: false }));
    }, TRANSITION_MS);
  }

  function buildCallbackUrl(status: "success" | "failed", reference: string): string | null {
    if (checkoutState.phase !== "ready" || checkoutState.config.callbackUrl === null) return null;
    const { callbackUrl, amount, currency } = checkoutState.config;
    const url = new URL(callbackUrl);
    url.searchParams.set("status", status);
    url.searchParams.set("reference", reference);
    url.searchParams.set("amount", String(amount));
    url.searchParams.set("currency", currency);
    return url.toString();
  }

  function handlePaymentSuccess(reference: string): void {
    setOutcome({ status: "success", reference });
    const url = buildCallbackUrl("success", reference);
    if (url !== null) setTimeout((): void => { window.location.href = url; }, REDIRECT_DELAY_MS);
  }

  function handlePaymentFailed(reference: string, errorMsg?: string): void {
    setOutcome({ status: "failed", reference, errorMsg });
    const url = buildCallbackUrl("failed", reference);
    if (url !== null) setTimeout((): void => { window.location.href = url; }, REDIRECT_DELAY_MS);
  }

  function handleClose(): void {
    if (checkoutState.phase === "ready" && checkoutState.config.callbackUrl !== null) {
      const url = new URL(checkoutState.config.callbackUrl);
      url.searchParams.set("status", "cancelled");
      url.searchParams.set("reference", checkoutState.config.reference);
      window.location.href = url.toString();
    } else {
      window.close();
      // fallback if window.close() is blocked (not opened by script)
      history.back();
    }
  }

  if (checkoutState.phase === "not-found" || checkoutState.phase === "error") {
    return <NoTransaction />;
  }

  const config = checkoutState.phase === "ready" ? checkoutState.config : null;
  const formattedAmount: string = config !== null
    ? formatCurrency(config.amount / 100, config.currency)
    : "";

  const availableMethods: ReadonlyArray<PaymentMethodConfig> =
    config !== null
      ? config.channels.map((ch): PaymentMethodConfig => METHOD_CONFIG_MAP[CHANNEL_METHOD_MAP[ch]])
      : [];

  const ActiveComponent = PAYMENT_COMPONENTS[methodState.display];

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f6f9fc] p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-150">
        <div className="flex min-h-screen flex-col overflow-hidden bg-white sm:min-h-0 sm:flex-row sm:rounded-2xl sm:border sm:border-[#e3e8ee]">
          {checkoutState.phase === "loading" && <CheckoutSkeleton />}

          {checkoutState.phase === "ready" && (
            <>
              {outcome === null && availableMethods.length > 1 && (
                <MethodNav
                  methods={availableMethods}
                  active={methodState.active}
                  onSelect={switchMethod}
                />
              )}

              <div className="flex-1">
                {outcome === null && (
                  <CheckoutHeader
                    merchantName={checkoutState.config.merchant.name}
                    email={checkoutState.config.email}
                    formattedAmount={formattedAmount}
                    onClose={handleClose}
                  />
                )}

                <div
                  className="min-h-72 px-5 pt-5 pb-8 transition-opacity duration-150 ease-in-out sm:px-8 sm:pt-6"
                  style={{ opacity: methodState.transitioning ? 0 : 1 }}
                >
                  {outcome !== null ? (
                    <PaymentResult
                      status={outcome.status}
                      amount={formattedAmount}
                      reference={outcome.reference}
                      errorMsg={outcome.status === "failed" ? outcome.errorMsg : undefined}
                      isRedirecting={checkoutState.config.callbackUrl !== null}
                      onClose={(): void => setOutcome(null)}
                      onRetry={outcome.status === "failed" ? (): void => setOutcome(null) : undefined}
                    />
                  ) : (
                    <ActiveComponent
                      accessCode={accessCode}
                      amount={formattedAmount}
                      reference={checkoutState.config.reference}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentFailed={handlePaymentFailed}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 pb-4 sm:pb-0">
          <Lock className="size-3 text-[#8898aa]/60" />
          <span className="flex items-center gap-1.5 text-[11px] tracking-wide text-[#8898aa]">
            Secured by <span className="text-primary font-semibold">Vestrapay</span>
          </span>
        </div>
      </div>
    </main>
  );
}
