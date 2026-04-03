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

type TransferStatus = "idle" | "success" | "failed";

interface TransferState {
  readonly status: TransferStatus;
  readonly details: ChargeBankTransferData | null;
  readonly socketReference: string | null;
  readonly countdown: number;
}

function formatCountdown(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getRemainingSeconds(expiresAt: string): number {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
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
    <div className="rounded-md border border-amber-200/60 bg-amber-50/50 p-3.5">
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

interface TransferDetailsViewProps {
  readonly amount: string;
  readonly details: ChargeBankTransferData;
  readonly timeStr: string;
  readonly copied: boolean;
  readonly onCopy: (value: string) => void;
}

function TransferDetailsView({
  amount,
  details,
  timeStr,
  copied,
  onCopy,
}: TransferDetailsViewProps): React.ReactNode {
  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-3 space-y-5 duration-400">
      <p className="text-sm leading-relaxed text-[#6b7c93]">
        Transfer exactly <span className="font-semibold text-[#3c4257]">{amount}</span> to the
        account below. We&apos;ll verify automatically once your transfer arrives.
      </p>

      <div className="overflow-hidden rounded-md border border-[#e3e8ee]">
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
            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-[#f6f9fc] px-3 py-1.5 text-xs font-medium text-[#6b7c93] transition-all duration-200 hover:bg-[#edf2f7]"
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

      <CountdownBanner timeStr={timeStr} />

      <div className="flex items-center justify-center gap-2 pt-1 text-xs text-[#8898aa]">
        <Loader className="size-3.5 animate-spin" />
        <span>Waiting for your transfer…</span>
      </div>
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
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TransferState>({
    status: "idle",
    details: null,
    socketReference: null,
    countdown: EXPIRY_SECONDS,
  });

  const { copied, copy } = useClipboard();

  usePaymentSocket({
    reference: state.socketReference,
    onStatus: useCallback(
      (event: PaymentStatusEvent): void => {
        if (event.status === "success") {
          setState((prev) => ({ ...prev, status: "success", socketReference: null }));
          onPaymentSuccess?.(event.reference);
        } else if (event.status === "failed") {
          setState((prev) => ({ ...prev, status: "failed", socketReference: null }));
          onPaymentFailed?.(event.reference);
        }
      },
      [onPaymentSuccess, onPaymentFailed],
    ),
  });

  useEffect((): (() => void) | undefined => {
    if (state.details === null || state.status !== "idle") return;

    const timer = setInterval((): void => {
      setState((prev) => ({ ...prev, countdown: Math.max(0, prev.countdown - 1) }));
    }, 1000);

    return (): void => clearInterval(timer);
  }, [state.details, state.status]);

  const handleGenerate = useCallback(async (): Promise<void> => {
    setGenerating(true);
    setError(null);

    try {
      const res = await checkoutChargeBankTransfer({ access_code: accessCode, reference });

      setState({
        status: "idle",
        details: res.data,
        socketReference: res.data.reference,
        countdown: getRemainingSeconds(res.data.expiresAt),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate account");
    } finally {
      setGenerating(false);
    }
  }, [accessCode, reference]);

  useEffect((): void => {
    void handleGenerate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = useCallback((): void => {
    setState({ status: "idle", details: null, socketReference: null, countdown: EXPIRY_SECONDS });
    setError(null);
  }, []);

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
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-5 h-10 cursor-pointer rounded-md px-6 text-sm font-semibold tracking-wide transition-all duration-200 hover:shadow-md"
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
      onCopy={copy}
    />
  );
}
