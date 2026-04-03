"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@vestrapay/ui/components/button";
import { Hash, Copy, Check, Loader } from "@/components/icons";
import { PaymentResult } from "@/components/payment-result";
import { useClipboard } from "@/hooks/use-clipboard";
import { checkoutChargeUssd, checkoutCompleteUssd, verifyTransaction } from "@/lib/api";
import { USSD_BANKS } from "@/lib/constants";
import type { PaymentComponentProps, ActivePaymentStatus, VerifyTransactionStatus } from "@/lib/types";

const POLL_INTERVAL_MS = 2000 as const;

type UssdPhase =
  | { readonly step: "select" }
  | { readonly step: "charging" }
  | { readonly step: "dialing"; readonly ussdCode: string; readonly chargeReference: string }
  | { readonly step: "verifying"; readonly chargeReference: string }
  | { readonly step: "result"; readonly status: ActivePaymentStatus; readonly chargeReference: string; readonly errorMsg?: string };

export function USSDPayment({
  accessCode,
  amount,
  reference,
  onPaymentSuccess,
  onPaymentFailed,
}: PaymentComponentProps): React.ReactNode {
  const [phase, setPhase] = useState<UssdPhase>({ step: "select" });
  const [selectedBankCode, setSelectedBankCode] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const { copied, copy } = useClipboard();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback((): void => {
    if (pollRef.current !== null) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  useEffect((): (() => void) => {
    return stopPolling;
  }, [stopPolling]);

  useEffect((): (() => void) | undefined => {
    const ref =
      phase.step === "dialing" || phase.step === "verifying"
        ? phase.chargeReference
        : null;

    if (ref === null) return;

    const poll = async (): Promise<void> => {
      try {
        const res = await verifyTransaction(ref);
        const status: VerifyTransactionStatus = res.data.status;

        if (status === "success") {
          stopPolling();
          setPhase({ step: "result", status: "success", chargeReference: ref });
          onPaymentSuccess?.(ref);
        } else if (status === "failed") {
          stopPolling();
          setPhase({ step: "result", status: "failed", chargeReference: ref });
          onPaymentFailed?.(ref);
        }
      } catch {
        // silent — keep polling
      }
    };

    setTimeout(poll, 1000);
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return stopPolling;
  }, [phase.step, stopPolling, onPaymentSuccess, onPaymentFailed]);

  const handleCharge = useCallback(async (): Promise<void> => {
    if (selectedBankCode === null) return;
    setPhase({ step: "charging" });

    try {
      const res = await checkoutChargeUssd({
        access_code: accessCode,
        reference,
        bankCode: selectedBankCode,
      });

      setPhase({
        step: "dialing",
        ussdCode: res.data.ussdCode,
        chargeReference: res.data.reference,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate USSD code";
      setPhase({ step: "result", status: "failed", chargeReference: reference, errorMsg: msg });
      onPaymentFailed?.(reference, msg);
    }
  }, [accessCode, reference, selectedBankCode, onPaymentFailed]);

  const handleDialed = useCallback(async (): Promise<void> => {
    if (phase.step !== "dialing") return;
    const ref = phase.chargeReference;
    setPhase({ step: "verifying", chargeReference: ref });

    try {
      await checkoutCompleteUssd({ access_code: accessCode, reference: ref });
    } catch {
      // complete is best-effort; polling continues regardless
    }
  }, [accessCode, phase]);

  const handleReset = useCallback((): void => {
    stopPolling();
    setPhase({ step: "select" });
    setSelectedBankCode(null);
    setSearch("");
  }, [stopPolling]);

  if (phase.step === "result") {
    return (
      <PaymentResult
        status={phase.status}
        amount={amount}
        reference={phase.chargeReference}
        errorMsg={phase.errorMsg}
        onClose={handleReset}
        onRetry={phase.status === "failed" ? handleReset : undefined}
      />
    );
  }

  if (phase.step === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <Loader className="text-primary mb-4 size-8 animate-spin" />
        <p className="text-lg font-semibold text-[#3c4257]">Verifying payment</p>
        <p className="mt-2 text-center text-sm text-[#6b7c93]">
          We&apos;re confirming your USSD transaction of {amount}
        </p>
      </div>
    );
  }

  const filtered = USSD_BANKS.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedBank = USSD_BANKS.find((b) => b.code === selectedBankCode);

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 space-y-4 duration-300">
      <p className="text-sm leading-relaxed text-[#6b7c93]">
        Select your bank to generate a USSD code for this payment.
      </p>

      {(phase.step === "select" || phase.step === "charging") && (
        <>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for your bank"
              value={search}
              onChange={(e): void => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#e3e8ee] bg-white px-4 text-sm text-[#3c4257] transition-all duration-200 outline-none placeholder:text-[#a3acb9]"
            />
          </div>

          <div className="stripe-scroll max-h-48 overflow-y-auto rounded-xl border border-[#e3e8ee] sm:max-h-55">
            {filtered.map((bank, i) => (
              <button
                key={bank.code}
                type="button"
                onClick={(): void => setSelectedBankCode(bank.code)}
                className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left text-sm transition-all duration-150 ${
                  selectedBankCode === bank.code
                    ? "bg-primary/4 text-primary font-medium"
                    : "text-[#3c4257] hover:bg-[#f6f9fc]"
                } ${i !== filtered.length - 1 ? "border-b border-[#e3e8ee]" : ""}`}
              >
                <span className="flex items-center gap-2.5">
                  <Hash className="size-3.5 shrink-0 text-[#a3acb9]" />
                  {bank.name}
                </span>
                <span className="text-xs text-[#a3acb9]">{bank.ussd}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-[#a3acb9]">No banks found</div>
            )}
          </div>

          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 h-11 w-full cursor-pointer rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-40 sm:h-12 sm:text-[15px]"
            size="lg"
            disabled={selectedBankCode === null || phase.step === "charging"}
            onClick={handleCharge}
          >
            <span className="flex items-center justify-center gap-2">
              {selectedBankCode !== null
                ? `Generate USSD code for ${selectedBank?.name}`
                : "Select a bank"}
              {phase.step === "charging" && <Loader className="size-4 animate-spin" />}
            </span>
          </Button>
        </>
      )}

      {phase.step === "dialing" && (
        <>
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 rounded-xl border border-[#e3e8ee] bg-[#f6f9fc] p-5 text-center duration-300">
            <p className="text-[10px] font-medium tracking-wider text-[#8898aa] uppercase">
              Dial this code on your phone
            </p>
            <p className="text-primary mt-2 text-xl font-bold tracking-wider sm:text-2xl">
              {phase.ussdCode}
            </p>
            <button
              type="button"
              onClick={(): void => copy(phase.ussdCode)}
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-[#6b7c93] transition-all duration-200 hover:bg-[#edf2f7]"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy code
                </>
              )}
            </button>
          </div>

          <Button
            variant="outline"
            className="h-11 w-full cursor-pointer rounded-xl border-[#e3e8ee] text-sm font-medium tracking-wide text-[#3c4257] transition-all duration-200 hover:bg-[#f6f9fc] sm:h-12 sm:text-[15px]"
            size="lg"
            onClick={handleDialed}
          >
            I&apos;ve dialed the code
          </Button>
        </>
      )}
    </div>
  );
}
