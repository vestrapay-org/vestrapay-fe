"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@vestrapay/ui/components/button";
import { Loader, ChevronDown } from "@/components/icons";
import { PaymentResult } from "@/components/payment-result";
import { checkoutChargeBankPayment, checkoutGetBankPaymentBanks, verifyTransaction } from "@/lib/api";
import type {
  PaymentComponentProps,
  ActivePaymentStatus,
  ChargeBankPaymentData,
  VerifyTransactionStatus,
} from "@/lib/types";

const POLL_INTERVAL_MS = 2000 as const;

type BankPaymentStatus = "idle" | "loading" | "redirect" | "processing" | "success" | "failed";

interface BankPaymentState {
  readonly status: BankPaymentStatus;
  readonly selectedBankCode: string | null;
  readonly banks: ReadonlyArray<{ readonly code: string; readonly name: string; readonly slug: string }>;
  readonly data: ChargeBankPaymentData | null;
  readonly error: string | null;
  readonly pollingReference: string | null;
}

export function BankPayment({
  accessCode,
  amount,
  reference,
  onPaymentSuccess,
  onPaymentFailed,
}: PaymentComponentProps): React.ReactNode {
  const [state, setState] = useState<BankPaymentState>({
    status: "idle",
    selectedBankCode: null,
    banks: [],
    data: null,
    error: null,
    pollingReference: null,
  });

  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect((): void => {
    checkoutGetBankPaymentBanks()
      .then((res): void => {
        setState((prev) => ({ ...prev, banks: res.data }));
      })
      .catch((err: unknown): void => {
        const msg = err instanceof Error ? err.message : "Failed to load banks";
        setState((prev) => ({ ...prev, error: msg }));
      });
  }, []);

  useEffect((): (() => void) => {
    return (): void => {
      if (pollIntervalRef.current !== null) clearInterval(pollIntervalRef.current);
      if (redirectTimeoutRef.current !== null) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  useEffect((): (() => void) | undefined => {
    if (state.status !== "processing" || state.pollingReference === null) return;

    const ref = state.pollingReference;

    const poll = async (): Promise<void> => {
      try {
        const res = await verifyTransaction(ref);
        const txnStatus: VerifyTransactionStatus = res.data.status;

        if (txnStatus === "success") {
          setState((prev) => ({ ...prev, status: "success" }));
          if (pollIntervalRef.current !== null) clearInterval(pollIntervalRef.current);
          onPaymentSuccess?.(ref);
        } else if (txnStatus === "failed") {
          setState((prev) => ({ ...prev, status: "failed" }));
          if (pollIntervalRef.current !== null) clearInterval(pollIntervalRef.current);
          onPaymentFailed?.(ref);
        }
      } catch {
        // silent — keep polling
      }
    };

    setTimeout(poll, 1000);
    pollIntervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return (): void => {
      if (pollIntervalRef.current !== null) clearInterval(pollIntervalRef.current);
    };
  }, [state.status, state.pollingReference, onPaymentSuccess, onPaymentFailed]);

  const handleInitiate = useCallback(async (): Promise<void> => {
    if (state.selectedBankCode === null) {
      setState((prev) => ({ ...prev, error: "Please select a bank" }));
      return;
    }

    setState((prev) => ({ ...prev, status: "loading", error: null }));

    try {
      const res = await checkoutChargeBankPayment({
        access_code: accessCode,
        reference,
        bankCode: state.selectedBankCode,
      });

      setState((prev) => ({
        ...prev,
        data: res.data,
        pollingReference: res.data.paymentReference,
        status: "redirect",
      }));

      redirectTimeoutRef.current = setTimeout((): void => {
        window.location.href = res.data.redirectUrl;
        setState((prev) => ({ ...prev, status: "processing" }));
      }, 500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to initiate payment";
      setState((prev) => ({ ...prev, status: "idle", error: msg }));
    }
  }, [accessCode, reference, state.selectedBankCode]);

  const handleRetry = useCallback((): void => {
    setState((prev) => ({
      status: "idle",
      selectedBankCode: null,
      banks: prev.banks,
      data: null,
      error: null,
      pollingReference: null,
    }));
  }, []);

  if (state.banks.length === 0 && state.status === "idle") {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <Loader className="text-primary mb-4 size-6 animate-spin" />
        <p className="text-sm text-[#6b7c93]">Loading available banks...</p>
      </div>
    );
  }

  if (state.status === "success" || state.status === "failed") {
    return (
      <PaymentResult
        status={state.status as ActivePaymentStatus}
        amount={amount}
        reference={state.pollingReference ?? reference}
        errorMsg={state.error ?? undefined}
        onClose={handleRetry}
        onRetry={handleInitiate}
      />
    );
  }

  if (state.status === "redirect" || state.status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <div className="mb-6 flex justify-center">
          <Loader className="text-primary size-8 animate-spin" />
        </div>
        <p className="text-lg font-semibold text-[#3c4257]">
          {state.status === "redirect" ? "Redirecting..." : "Verifying your payment"}
        </p>
        <p className="mt-2 text-center text-sm text-[#6b7c93]">
          {state.status === "redirect"
            ? "Please complete the authorization in your browser"
            : `We're confirming your payment of ${amount}`}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 space-y-5 duration-300">
      <p className="text-sm leading-relaxed text-[#6b7c93]">
        Select your bank and authorize the debit mandate. You&apos;ll be redirected to complete the
        payment of <span className="font-semibold text-[#3c4257]">{amount}</span>.
      </p>

      <div className="space-y-3">
        <label className="text-xs font-semibold tracking-wide text-[#8898aa] uppercase">
          Select Bank
        </label>
        <div className="relative">
          <select
            value={state.selectedBankCode ?? ""}
            onChange={(e): void => {
              setState((prev) => ({ ...prev, selectedBankCode: e.target.value, error: null }));
            }}
            disabled={state.status === "loading"}
            className="focus:border-primary focus:ring-primary/10 w-full appearance-none rounded-xl border border-[#e3e8ee] bg-white px-4 py-3 pr-10 text-sm text-[#3c4257] transition-all duration-200 hover:border-[#d1d5db] focus:ring-2 focus:outline-none disabled:bg-[#f6f9fc] disabled:text-[#a0aec0]"
          >
            <option value="">Choose a bank...</option>
            {state.banks.map((bank) => (
              <option key={bank.code} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-[#8898aa]" />
        </div>
      </div>

      {state.error !== null && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 h-11 w-full cursor-pointer rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-60 sm:h-12 sm:text-[15px]"
        size="lg"
        onClick={handleInitiate}
        disabled={state.selectedBankCode === null || state.status === "loading"}
      >
        <span className="flex items-center justify-center gap-2">
          Continue to Bank
          {state.status === "loading" && <Loader className="size-4 animate-spin" />}
        </span>
      </Button>

      <p className="text-xs text-[#8898aa]">
        You will be redirected to your bank to authorize this payment.
      </p>
    </div>
  );
}
