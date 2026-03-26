"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Lock, X } from "@/components/icons";
import { CardIcon, BankIcon, TransferIcon, USSDIcon } from "@/components/payment-icons";
import { CardPayment } from "@/components/card-payment";
import { BankPayment } from "@/components/bank-payment";
import { TransferPayment } from "@/components/transfer-payment";
import { USSDPayment } from "@/components/ussd-payment";
import { QRCodePayment } from "@/components/qr-payment";
import { PaymentResult } from "@/components/payment-result";
import { useCheckoutParams } from "@/hooks/use-checkout-params";
import { formatCurrency, toSmallestCurrencyUnit } from "@/lib/formatters";
import type { PaymentMethod, PaymentComponentProps, SVGIconProps } from "@/lib/types";

interface PaymentMethodConfig {
  readonly id: PaymentMethod;
  readonly label: string;
  readonly icon: React.ComponentType<SVGIconProps>;
}

const PAYMENT_METHODS: readonly PaymentMethodConfig[] = [
  { id: "card", label: "Card", icon: CardIcon },
  { id: "transfer", label: "Bank Transfer", icon: TransferIcon },
  { id: "bank", label: "Pay with Bank", icon: BankIcon },
  { id: "ussd", label: "USSD", icon: USSDIcon },
];

const PAYMENT_COMPONENTS: Readonly<
  Record<PaymentMethod, React.ComponentType<PaymentComponentProps>>
> = {
  card: CardPayment,
  bank: BankPayment,
  transfer: TransferPayment,
  ussd: USSDPayment,
  qr: QRCodePayment,
};

const TRANSITION_MS = 150;
const REDIRECT_DELAY_MS = 2500;

type PaymentOutcome =
  | { status: "success"; reference: string }
  | { status: "failed"; reference: string; errorMsg?: string }
  | null;

interface MethodNavProps {
  readonly active: PaymentMethod;
  readonly onSelect: (method: PaymentMethod) => void;
}

function MethodNav({ active, onSelect }: MethodNavProps): React.ReactNode {
  return (
    <nav className="shrink-0 border-b border-[#e3e8ee] sm:w-45 sm:border-r sm:border-b-0 sm:py-6">
      <p className="hidden px-5 pb-3 text-[10px] font-semibold tracking-wider text-[#8898aa] uppercase sm:block">
        Payment Options
      </p>
      <div className="flex overflow-x-auto px-3 py-2 sm:flex-col sm:overflow-x-visible sm:px-0 sm:py-0">
        {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 sm:w-full sm:gap-3 sm:rounded-none sm:px-5 sm:py-3 ${
                isActive
                  ? "bg-primary/8 text-primary sm:bg-primary/4 sm:border-primary sm:border-r-2"
                  : "border-r-2 border-transparent text-[#8898aa] hover:bg-[#f6f9fc] hover:text-[#6b7c93]"
              }`}
            >
              <Icon className="size-5 sm:size-5" active={isActive} />
              <span className="text-xs sm:text-[13px]">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

interface CheckoutHeaderProps {
  readonly name: string;
  readonly email: string;
  readonly formattedAmount: string;
  readonly onClose: () => void;
}

function CheckoutHeader({
  name,
  email,
  formattedAmount,
  onClose,
}: CheckoutHeaderProps): React.ReactNode {
  return (
    <div className="px-5 pt-5 pb-4 sm:px-8 sm:pt-8 sm:pb-6">
      <div className="mb-5 flex items-center justify-between pb-3">
        <img src="/vestrapay.svg" alt="Vestrapay" className="h-7 w-auto sm:h-8" />
        <button
          type="button"
          onClick={onClose}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-[#8898aa] transition-colors hover:bg-[#f6f9fc] hover:text-[#3c4257]"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
      <div>
        <p className="text-sm font-medium text-[#3c4257] sm:text-[15px]">{name}</p>
        <p className="mt-0.5 text-xs text-[#6b7c93] sm:text-sm">{email}</p>
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[#3c4257] sm:mt-3 sm:text-[32px]">
        {formattedAmount}
      </p>
    </div>
  );
}

export default function CheckoutPage(): React.ReactNode {
  const { merchant, callbackUrl } = useCheckoutParams();

  const [activeMethod, setActiveMethod] = useState<PaymentMethod>("card");
  const [displayMethod, setDisplayMethod] = useState<PaymentMethod>("card");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [outcome, setOutcome] = useState<PaymentOutcome>(null);

  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  const handleMethodSwitch = useCallback(
    (method: PaymentMethod) => {
      if (method === activeMethod) return;
      setIsTransitioning(true);
      setActiveMethod(method);
      transitionRef.current = setTimeout(() => {
        setDisplayMethod(method);
        setIsTransitioning(false);
      }, TRANSITION_MS);
    },
    [activeMethod],
  );

  const buildCallbackUrl = useCallback(
    (status: "success" | "failed", reference: string): string | null => {
      if (!callbackUrl) return null;
      const url = new URL(callbackUrl);
      url.searchParams.set("status", status);
      url.searchParams.set("reference", reference);
      url.searchParams.set("amount", String(merchant.amount));
      url.searchParams.set("currency", merchant.currency);
      return url.toString();
    },
    [callbackUrl, merchant.amount, merchant.currency],
  );

  const handlePaymentSuccess = useCallback(
    (reference: string) => {
      setOutcome({ status: "success", reference });
      const url = buildCallbackUrl("success", reference);
      if (url)
        setTimeout(() => {
          window.location.href = url;
        }, REDIRECT_DELAY_MS);
    },
    [buildCallbackUrl],
  );

  const handlePaymentFailed = useCallback(
    (reference: string, errorMsg?: string) => {
      setOutcome({ status: "failed", reference, errorMsg });
      const url = buildCallbackUrl("failed", reference);
      if (url)
        setTimeout(() => {
          window.location.href = url;
        }, REDIRECT_DELAY_MS);
    },
    [buildCallbackUrl],
  );

  const handleClose = useCallback(() => {
    if (callbackUrl) {
      window.location.href = callbackUrl;
    } else {
      setOutcome(null);
    }
  }, [callbackUrl]);

  const formattedAmount = formatCurrency(merchant.amount, merchant.currency);
  const amountInSmallestUnit = toSmallestCurrencyUnit(merchant.amount, merchant.currency);
  const ActiveComponent = PAYMENT_COMPONENTS[displayMethod];

  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f6f9fc] p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-150">
        <div className="flex min-h-screen flex-col overflow-hidden bg-white sm:min-h-0 sm:flex-row sm:rounded-2xl sm:border sm:border-[#e3e8ee]">
          {!outcome && PAYMENT_METHODS.length > 1 && (
            <MethodNav active={activeMethod} onSelect={handleMethodSwitch} />
          )}

          <div className="flex-1">
            {!outcome && (
              <CheckoutHeader
                name={merchant.name}
                email={merchant.email}
                formattedAmount={formattedAmount}
                onClose={handleClose}
              />
            )}

            <div
              className="min-h-72 px-5 pt-5 pb-8 transition-opacity duration-150 ease-in-out sm:px-8 sm:pt-6"
              style={{ opacity: isTransitioning ? 0 : 1 }}
            >
              {outcome ? (
                <PaymentResult
                  status={outcome.status}
                  amount={formattedAmount}
                  reference={outcome.reference}
                  errorMsg={outcome.status === "failed" ? outcome.errorMsg : undefined}
                  isRedirecting={!!callbackUrl}
                  onClose={() => setOutcome(null)}
                  onRetry={outcome.status === "failed" ? () => setOutcome(null) : undefined}
                />
              ) : (
                <ActiveComponent
                  amount={formattedAmount}
                  amountInSmallestUnit={amountInSmallestUnit}
                  reference={merchant.reference}
                  email={merchant.email}
                  currency={merchant.currency}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentFailed={handlePaymentFailed}
                />
              )}
            </div>
          </div>
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
