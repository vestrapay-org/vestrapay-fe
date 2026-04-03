"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, Clock, Loader } from "@/components/icons";
import { PaymentResult } from "@/components/payment-result";
import { useClipboard } from "@/hooks/use-clipboard";
import { usePaymentSocket } from "@/hooks/use-payment-socket";
import { checkoutChargeBankTransfer } from "@/lib/api";
import type {
  PaymentComponentProps,
  ActivePaymentStatus,
  ChargeBankTransferData,
  PaymentStatusEvent,
} from "@/lib/types";

const EXPIRY_SECONDS = 1800 as const;
const POLL_INTERVAL_MS = 2000 as const;

type TransferStatus = "idle" | "success" | "failed";

interface TransferState {
  status: TransferPaymentStatus;
  details: ChargeBankTransferData | null;
  error: string | null;
  pollingReference: string | null;
  showDetails: boolean;
  countdown: number;
}

function formatCountdown(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getRemainingSecondsFromMs(expiresAtMs: number): number {
  return Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000));
}

function getTransferSessionStorageKey(reference: string): string {
  return `${TRANSFER_SESSION_KEY_PREFIX}${reference}`;
}

function saveTransferSession(storageKey: string, session: StoredTransferSession): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(storageKey, JSON.stringify(session));
}

function readTransferSession(storageKey: string): StoredTransferSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredTransferSession>;
    if (
      !parsed ||
      typeof parsed.expiresAtMs !== "number" ||
      !parsed.details ||
      typeof parsed.pollingReference !== "string"
    ) {
      return null;
    }
    return {
      details: parsed.details as ChargeBankTransferData,
      pollingReference: parsed.pollingReference,
      expiresAtMs: parsed.expiresAtMs,
    };
  } catch {
    return null;
  }
}

function clearTransferSession(storageKey: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(storageKey);
}

function toSocketUrl(endpoint: string): string {
  if (endpoint.startsWith("https://")) return endpoint.replace("https://", "wss://");
  if (endpoint.startsWith("http://")) return endpoint.replace("http://", "ws://");
  return endpoint;
}

interface DetailRowProps {
  readonly label: string;
  readonly value: string;
  readonly children?: React.ReactNode;
}

function DetailRow({ label, value, children }: DetailRowProps): React.ReactNode {
  return (
    <div className="flex items-center justify-between border-b border-[#e3e8ee] px-4 py-3.5 last:border-b-0">
      <div>
        <p className="text-[10px] font-medium tracking-wider text-[#8898aa] uppercase">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-[#3c4257]">{value}</p>
      </div>
      {children}
    </div>
  );
}

function CountdownBanner({ timeStr }: { readonly timeStr: string }): React.ReactNode {
  return (
    <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-3.5">
      <div className="flex items-start gap-2.5 text-xs leading-relaxed text-amber-800/80">
        <Clock className="mt-0.5 size-3.5 shrink-0" />
        <span>
          This account expires in <span className="font-mono font-semibold">{timeStr}</span>.
          Complete the transfer before it expires.
        </span>
      </div>
    </div>
  );
}

interface IdleViewProps {
  amount: string;
  generating: boolean;
  error: string | null;
  onGenerate: () => void;
}

function IdleView({ amount, generating, error, onGenerate }: IdleViewProps): React.ReactNode {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 space-y-5 duration-300">
      <p className="text-sm leading-relaxed text-[#6b7c93]">
        Generate a temporary bank account. Transfer exactly{" "}
        <span className="font-semibold text-[#3c4257]">{amount}</span> to complete your payment.
      </p>

      <div className="rounded-xl border border-[#e3e8ee] bg-[#f6f9fc] p-4">
        <div className="flex items-center gap-2 text-sm text-[#6b7c93]">
          <Clock className="size-4" />
          <span>
            Account expires in <span className="font-medium text-[#3c4257]">30 minutes</span>
          </span>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 h-11 w-full cursor-pointer rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 sm:h-12 sm:text-[15px]"
        size="lg"
        onClick={onGenerate}
        disabled={generating}
      >
        <span className="flex items-center justify-center gap-2">
          Generate Account Number
          {generating && <Loader className="size-4 animate-spin" />}
        </span>
      </Button>
    </div>
  );
}

interface TransferDetailsViewProps {
  amount: string;
  details: ChargeBankTransferData;
  timeStr: string;
  copied: boolean;
  onCopy: (value: string) => void;
  onConfirm: () => void;
}

interface ProcessingViewProps {
  amount: string;
}

function ProcessingView({ amount }: ProcessingViewProps): React.ReactNode {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-6 flex justify-center">
        <Loader className="text-primary size-8 animate-spin" />
      </div>
      <p className="text-lg font-semibold text-[#3c4257]">Verifying your payment</p>
      <p className="mt-2 text-center text-sm text-[#6b7c93]">
        Please wait while we confirm your transfer of {amount}
      </p>
    </div>
  );
}

function TransferDetailsView({
  amount,
  details,
  timeStr,
  copied,
  generating,
  expired,
  onCopy,
  onConfirm,
}: TransferDetailsViewProps): React.ReactNode {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-3 space-y-5 duration-400">
      <p className="text-sm leading-relaxed text-[#6b7c93]">
        Transfer exactly <span className="font-semibold text-[#3c4257]">{amount}</span> to the
        account below. We&apos;ll verify automatically once your transfer arrives.
      </p>

      <div className="overflow-hidden rounded-xl border border-[#e3e8ee]">
        <DetailRow label="Bank" value={details.bankName} />

        <div className="flex items-center justify-between border-b border-[#e3e8ee] px-4 py-3.5">
          <div>
            <p className="text-[10px] font-medium tracking-wider text-[#8898aa] uppercase">
              Account Number
            </p>
            <p className="mt-0.5 text-lg font-semibold tracking-wider text-[#3c4257]">
              {details.accountNumber}
            </p>
          </div>
          <button
            type="button"
            onClick={(): void => onCopy(details.accountNumber)}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f6f9fc] px-3 py-1.5 text-xs font-medium text-[#6b7c93] transition-all duration-200 hover:bg-[#edf2f7]"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                Copy
              </>
            )}
          </button>
        </div>

        <DetailRow label="Account Name" value={details.accountName} />

        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-[10px] font-medium tracking-wider text-[#8898aa] uppercase">
              Amount
            </p>
            <p className="text-primary mt-0.5 text-sm font-semibold">{amount}</p>
          </div>
        </div>
      </div>

      {expired ? (
        <div className="space-y-3">
          <ErrorBanner message="This virtual account has expired. Generate a new account number to continue." />
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full cursor-pointer rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 sm:h-12 sm:text-[15px]"
            size="lg"
            onClick={onRegenerate}
            disabled={generating}
          >
            <span className="flex items-center justify-center gap-2">
              Generate New Account Number
              {generating && <Loader className="size-4 animate-spin" />}
            </span>
          </Button>
        </div>
      ) : (
        <CountdownBanner timeStr={timeStr} />
      )}

      <Button
        variant="outline"
        className="mt-2 h-11 w-full cursor-pointer rounded-xl border-[#e3e8ee] text-sm font-medium tracking-wide text-[#3c4257] transition-all duration-200 hover:bg-[#f6f9fc] sm:h-12 sm:text-[15px]"
        size="lg"
        onClick={onConfirm}
      >
        I've sent the money
      </Button>
    </div>
  );
}

export function TransferPayment({
  accessCode,
  amount,
  reference,
  onPaymentSuccess,
  onPaymentFailed,
}: PaymentComponentProps): React.ReactNode {
  const [state, setState] = useState<TransferState>({
    status: "idle",
    details: null,
    socketReference: null,
    countdown: EXPIRY_SECONDS,
    expiresAtMs: null,
    expired: false,
  });

  const { copied, copy } = useClipboard();
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!state.showDetails || state.status !== "idle") return;

    const timer = setInterval(() => {
      setState((prev) => ({ ...prev, countdown: Math.max(0, prev.countdown - 1) }));
    }, 1000);

    return () => clearInterval(timer);
  }, [state.showDetails, state.status]);

  useEffect(() => {
    if (!state.showDetails || !state.pollingReference) return;

    const ref = state.pollingReference;

    const poll = async (): Promise<void> => {
      try {
        const res = await verifyTransaction(ref);
        const txnStatus: VerifyTransactionStatus = res.data.status;

        if (txnStatus === "success") {
          setState((prev) => ({ ...prev, status: "success" }));
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          onPaymentSuccess?.(ref);
        } else if (txnStatus === "failed") {
          setState((prev) => ({ ...prev, status: "failed" }));
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          onPaymentFailed?.(ref);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    setTimeout(poll, 1000);
    pollIntervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [state.showDetails, state.pollingReference, onPaymentSuccess, onPaymentFailed]);

  const handleGenerate = useCallback(async (): Promise<void> => {
    settledRef.current = false;
    setGenerating(true);
    setState((prev) => ({ ...prev, error: null }));

    try {
      const res = await chargeBankTransfer({
        amount: amountInSmallestUnit,
        currency,
        email,
        description: `Bank transfer ${reference}`,
      });

      setState((prev) => ({
        ...prev,
        details: res.data,
        pollingReference: res.data.reference,
        showDetails: true,
        countdown: getRemainingSeconds(res.data.expiresAt),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate account");
    } finally {
      setGenerating(false);
    }
  }, [amountInSmallestUnit, currency, email, reference]);

  useEffect(() => {
    handleGenerate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirmPaymentSent = useCallback((): void => {
    setState((prev) => ({ ...prev, status: "processing" }));
  }, []);

  const handleClose = useCallback((): void => {
    setState({
      status: "idle",
      details: null,
      error: null,
      pollingReference: null,
      showDetails: false,
      countdown: EXPIRY_SECONDS,
    });
  }, []);

  if (state.status === "processing") {
    return <ProcessingView amount={amount} />;
  }

  if (state.status !== "idle") {
    return (
      <PaymentResult
        status={state.status as ActivePaymentStatus}
        amount={amount}
        reference={state.details?.reference ?? reference}
        onClose={handleClose}
        onRetry={state.status === "failed" ? handleGenerate : undefined}
      />
    );
  }

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <Loader className="text-primary mb-4 size-6 animate-spin" />
        <p className="text-sm text-[#6b7c93]">Generating account...</p>
      </div>
    );
  }

  if (error !== null) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-12">
        <p className="text-sm text-[#6b7c93]">Unable to generate an account. Please try again.</p>
        <button
          type="button"
          onClick={handleGenerate}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-5 h-11 rounded-xl px-6 text-sm font-semibold tracking-wide transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  if (state.details === null) return null;

  return (
    <TransferDetailsView
      amount={amount}
      details={state.details}
      timeStr={formatCountdown(state.countdown)}
      copied={copied}
      generating={generating}
      expired={state.expired}
      onCopy={copy}
      onConfirm={handleConfirmPaymentSent}
    />
  );
}
