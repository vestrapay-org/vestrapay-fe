"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@vestrapay/ui/components/button";
import { Copy, Check, Clock, Loader } from "@/components/icons";
import { PaymentResult } from "@/components/payment-result";
import { useClipboard } from "@/hooks/use-clipboard";
import { chargeBankTransfer, verifyTransaction } from "@/lib/api";
import type {
  PaymentComponentProps,
  ActivePaymentStatus,
  ChargeBankTransferData,
  VerifyTransactionStatus,
} from "@/lib/types";

const EXPIRY_SECONDS = 1800 as const;
const POLL_INTERVAL_MS = 2000 as const;
const SOCKET_ENDPOINT = process.env.NEXT_PUBLIC_PAYMENT_SOCKET_URL!;
const TRANSFER_SESSION_KEY_PREFIX = "vestrapay.transfer.session." as const;

type TransferPaymentStatus = "idle" | "processing" | "success" | "failed";

interface TransferState {
  status: TransferPaymentStatus;
  details: ChargeBankTransferData | null;
  error: string | null;
  pollingReference: string | null;
  showDetails: boolean;
  countdown: number;
  expiresAtMs: number | null;
  expired: boolean;
}

interface StoredTransferSession {
  readonly details: ChargeBankTransferData;
  readonly pollingReference: string;
  readonly expiresAtMs: number;
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
  label: string;
  value: string;
  children?: React.ReactNode;
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
interface ErrorBannerProps {
  message: string;
}

function ErrorBanner({ message }: ErrorBannerProps): React.ReactNode {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
      {message}
    </div>
  );
}

interface CountdownBannerProps {
  timeStr: string;
}

function CountdownBanner({ timeStr }: CountdownBannerProps): React.ReactNode {
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
  console.log("IdleView", error);

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

      {/* {error && <ErrorBanner message={error} />} */}

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
  generating: boolean;
  expired: boolean;
  onCopy: (value: string) => void;
  onConfirm: () => void;
  onRegenerate: () => void;
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
  onRegenerate,
}: TransferDetailsViewProps): React.ReactNode {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-3 space-y-5 duration-400">
      <p className="text-sm leading-relaxed text-[#6b7c93]">
        Transfer exactly <span className="font-semibold text-[#3c4257]">{amount}</span> to the
        account below. We&apos;ll verify automatically.
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
            onClick={() => onCopy(details.accountNumber)}
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
        disabled={expired}
      >
        I&apos;ve sent the money
      </Button>
    </div>
  );
}

export function TransferPayment({
  amount,
  amountInSmallestUnit,
  reference,
  email,
  currency,
  onPaymentSuccess,
  onPaymentFailed,
}: PaymentComponentProps): React.ReactNode {
  const sessionStorageKey = getTransferSessionStorageKey(reference);
  const [state, setState] = useState<TransferState>({
    status: "idle",
    details: null,
    error: null,
    pollingReference: null,
    showDetails: false,
    countdown: EXPIRY_SECONDS,
    expiresAtMs: null,
    expired: false,
  });
  const [generating, setGenerating] = useState(false);

  const { copied, copy } = useClipboard();
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const settledRef = useRef(false);

  const settlePayment = useCallback(
    (nextStatus: "success" | "failed", txnReference: string): void => {
      if (settledRef.current) return;
      settledRef.current = true;
      setState((prev) => ({ ...prev, status: nextStatus, error: null }));
      clearTransferSession(sessionStorageKey);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      if (nextStatus === "success") onPaymentSuccess?.(txnReference);
      if (nextStatus === "failed") onPaymentFailed?.(txnReference);
    },
    [onPaymentFailed, onPaymentSuccess, sessionStorageKey],
  );

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (!state.showDetails || state.status !== "idle" || !state.expiresAtMs) return;

    const timer = setInterval(() => {
      setState((prev) => {
        if (!prev.expiresAtMs) return prev;
        const remaining = getRemainingSecondsFromMs(prev.expiresAtMs);
        const hasExpired = remaining <= 0;
        if (hasExpired && !prev.expired) {
          clearTransferSession(sessionStorageKey);
        }
        return { ...prev, countdown: remaining, expired: hasExpired };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStorageKey, state.showDetails, state.status, state.expiresAtMs]);

  useEffect(() => {
    if (!state.showDetails || !state.pollingReference || state.expired) return;

    const ref = state.pollingReference;

    const poll = async (): Promise<void> => {
      try {
        const res = await verifyTransaction(ref);
        const txnStatus: VerifyTransactionStatus = res.data.status;

        if (txnStatus === "success") {
          settlePayment("success", ref);
        } else if (txnStatus === "failed") {
          settlePayment("failed", ref);
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
  }, [settlePayment, state.expired, state.showDetails, state.pollingReference]);

  useEffect(() => {
    if (!state.showDetails || !state.pollingReference || state.expired) return;
    const ws = new WebSocket(toSocketUrl(SOCKET_ENDPOINT));
    socketRef.current = ws;
    const ref = state.pollingReference;

    ws.onopen = () => {
      const payload = { action: "subscribe", reference: ref };
      ws.send(JSON.stringify(payload));
      ws.send(JSON.stringify({ type: "subscribe", data: payload }));
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      let parsed: unknown = event.data;
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch {
          return;
        }
      }
      if (!parsed || typeof parsed !== "object") return;
      const payload = parsed as {
        status?: string;
        reference?: string;
        data?: { status?: string; reference?: string };
      };
      const eventStatus = (payload.status ?? payload.data?.status ?? "").toLowerCase();
      const eventReference = payload.reference ?? payload.data?.reference;
      if (eventReference !== ref) return;
      if (eventStatus === "success") settlePayment("success", ref);
      if (eventStatus === "failed") settlePayment("failed", ref);
    };

    return () => {
      ws.close();
      if (socketRef.current === ws) socketRef.current = null;
    };
  }, [settlePayment, state.expired, state.showDetails, state.pollingReference]);

  const handleGenerate = useCallback(async (): Promise<void> => {
    settledRef.current = false;
    setGenerating(true);
    setState((prev) => ({ ...prev, error: null }));
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    try {
      const res = await chargeBankTransfer({
        amount: amountInSmallestUnit,
        currency,
        email,
        description: `Bank transfer ${reference}`,
      });
      const expiresAtMs = Date.now() + EXPIRY_SECONDS * 1000;
      const detailsWithExpiry: ChargeBankTransferData = {
        ...res.data,
        expiresAt: new Date(expiresAtMs).toISOString(),
      };
      saveTransferSession(sessionStorageKey, {
        details: detailsWithExpiry,
        pollingReference: res.data.reference,
        expiresAtMs,
      });

      setState((prev) => ({
        ...prev,
        details: detailsWithExpiry,
        pollingReference: res.data.reference,
        showDetails: true,
        countdown: EXPIRY_SECONDS,
        expiresAtMs,
        expired: false,
        status: "idle",
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate account";
      setState((prev) => ({ ...prev, error: message }));
    } finally {
      setGenerating(false);
    }
  }, [amountInSmallestUnit, currency, email, reference, sessionStorageKey]);

  useEffect(() => {
    const existingSession = readTransferSession(sessionStorageKey);
    if (existingSession) {
      const remaining = getRemainingSecondsFromMs(existingSession.expiresAtMs);
      if (remaining <= 0) {
        clearTransferSession(sessionStorageKey);
        void handleGenerate();
        return;
      }
      setState((prev) => ({
        ...prev,
        details: existingSession.details,
        pollingReference: existingSession.pollingReference,
        showDetails: true,
        countdown: remaining,
        expiresAtMs: existingSession.expiresAtMs,
        expired: false,
      }));
      return;
    }
    void handleGenerate();
  }, [handleGenerate, sessionStorageKey]);

  const handleConfirmPaymentSent = useCallback((): void => {
    if (state.expired) return;
    setState((prev) => ({ ...prev, status: "processing" }));
  }, [state.expired]);

  const handleClose = useCallback((): void => {
    setState({
      status: "idle",
      details: null,
      error: null,
      pollingReference: null,
      showDetails: false,
      countdown: EXPIRY_SECONDS,
      expiresAtMs: null,
      expired: false,
    });
    clearTransferSession(sessionStorageKey);
  }, [sessionStorageKey]);

  if (state.status === "processing") {
    return <ProcessingView amount={amount} />;
  }

  if (state.status !== "idle") {
    return (
      <PaymentResult
        status={state.status as ActivePaymentStatus}
        amount={amount}
        reference={state.pollingReference ?? reference}
        errorMsg={state.error ?? undefined}
        onClose={handleClose}
        onRetry={handleGenerate}
      />
    );
  }

  if (!state.showDetails) {
    return (
      <IdleView
        amount={amount}
        generating={generating}
        error={state.error}
        onGenerate={handleGenerate}
      />
    );
  }

  if (!state.details) return null;

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
      onRegenerate={handleGenerate}
    />
  );
}
