"use client";

import { useState, useCallback, useRef } from "react";
import { Input } from "@vestrapay/ui/components/input";
import { Label } from "@vestrapay/ui/components/label";
import { Button } from "@vestrapay/ui/components/button";
import { CreditCard, Loader } from "@/components/icons";
import { detectCardBrand, CardBrandIcon } from "@/components/card-brands";
import { PaymentResult } from "@/components/payment-result";
import { ThreeDsChallenge } from "@/components/three-ds-challenge";
import { checkoutChargeCard, checkoutComplete3ds } from "@/lib/api";
import { formatCardNumber, formatExpiry } from "@/lib/formatters";
import type { PaymentComponentProps, ActivePaymentStatus } from "@/lib/types";

type CardPaymentPhase =
  | { readonly step: "form" }
  | { readonly step: "processing" }
  | { readonly step: "3ds"; readonly html: string; readonly reference: string }
  | { readonly step: "result"; readonly status: ActivePaymentStatus; readonly reference: string; readonly errorMsg?: string };

export function CardPayment({
  accessCode,
  amount,
  reference,
  onPaymentSuccess,
  onPaymentFailed,
}: PaymentComponentProps): React.ReactNode {
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [phase, setPhase] = useState<CardPaymentPhase>({ step: "form" });

  const expiryRef = useRef<HTMLInputElement>(null);
  const cvvRef = useRef<HTMLInputElement>(null);

  const brand = detectCardBrand(cardNumber);
  const isComplete: boolean =
    cardNumber.replace(/\s/g, "").length >= 15 && expiry.length >= 4 && cvv.length >= 3;

  const handleCharge = useCallback(async (): Promise<void> => {
    setPhase({ step: "processing" });

    try {
      const digits = cardNumber.replace(/\s/g, "");
      const expiryDigits = expiry.replace(/\D/g, "");

      const res = await checkoutChargeCard({
        access_code: accessCode,
        reference,
        card: {
          number: digits,
          cvv,
          expiryMonth: expiryDigits.slice(0, 2),
          expiryYear: expiryDigits.slice(2, 4),
        },
      });

      const { status, reference: apiRef, threeDsHtml } = res.data;

      switch (status) {
        case "success":
          setPhase({ step: "result", status: "success", reference: apiRef });
          onPaymentSuccess?.(apiRef);
          break;
        case "3ds_required":
          setPhase({ step: "3ds", html: threeDsHtml ?? "", reference: apiRef });
          break;
        case "failed":
          setPhase({ step: "result", status: "failed", reference: apiRef });
          onPaymentFailed?.(apiRef);
          break;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setPhase({ step: "result", status: "failed", reference, errorMsg: msg });
      onPaymentFailed?.(reference, msg);
    }
  }, [accessCode, cardNumber, expiry, cvv, reference, onPaymentSuccess, onPaymentFailed]);

  const handle3dsSuccess = useCallback(async (): Promise<void> => {
    const ref = phase.step === "3ds" ? phase.reference : reference;
    setPhase({ step: "processing" });

    try {
      const res = await checkoutComplete3ds({ access_code: accessCode, reference: ref });
      const { status, reference: apiRef } = res.data;

      if (status === "success") {
        setPhase({ step: "result", status: "success", reference: apiRef });
        onPaymentSuccess?.(apiRef);
      } else {
        setPhase({ step: "result", status: "failed", reference: apiRef });
        onPaymentFailed?.(apiRef);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "3DS verification failed";
      setPhase({ step: "result", status: "failed", reference: ref, errorMsg: msg });
      onPaymentFailed?.(ref, msg);
    }
  }, [accessCode, phase, reference, onPaymentSuccess, onPaymentFailed]);

  const handle3dsFailed = useCallback(
    (errorMsg?: string): void => {
      const ref = phase.step === "3ds" ? phase.reference : reference;
      setPhase({ step: "result", status: "failed", reference: ref, errorMsg });
      onPaymentFailed?.(ref, errorMsg);
    },
    [phase, reference, onPaymentFailed],
  );

  if (phase.step === "3ds") {
    return (
      <ThreeDsChallenge
        html={phase.html}
        onSuccess={handle3dsSuccess}
        onFailed={handle3dsFailed}
      />
    );
  }

  if (phase.step === "result") {
    return (
      <PaymentResult
        status={phase.status}
        amount={amount}
        reference={phase.reference}
        errorMsg={phase.errorMsg}
        onClose={(): void => setPhase({ step: "form" })}
        onRetry={handleCharge}
      />
    );
  }

  const isProcessing: boolean = phase.step === "processing";

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-2 space-y-3.5 duration-300 sm:space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="card-number" className="text-[12px] font-medium text-[#3c4257]">
          Card number
        </Label>
        <div className="relative">
          <Input
            id="card-number"
            type="text"
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            value={cardNumber}
            onChange={(e): void => {
              const formatted = formatCardNumber(e.target.value);
              setCardNumber(formatted);
              if (
                formatted.replace(/\s/g, "").length >= 16 ||
                (formatted.replace(/\s/g, "").length >= 15 &&
                  detectCardBrand(formatted) === "unknown")
              ) {
                expiryRef.current?.focus();
              }
            }}
            className="h-10 rounded-md border-[#e3e8ee] bg-white pr-14 pl-3.5 text-sm tracking-wider text-[#3c4257] transition-all duration-200 placeholder:text-[#a3acb9] sm:h-11"
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transition-all duration-300">
            {brand !== "unknown" ? (
              <div className="animate-in fade-in-0 zoom-in-75 duration-300">
                <CardBrandIcon brand={brand} className="h-5 w-8" />
              </div>
            ) : (
              <CreditCard className="size-4.5 text-[#cdd3da]" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="expiry" className="text-[12px] font-medium text-[#3c4257]">
            Expiry
          </Label>
          <Input
            id="expiry"
            ref={expiryRef}
            type="text"
            inputMode="numeric"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e): void => {
              const formatted = formatExpiry(e.target.value);
              setExpiry(formatted);
              if (formatted.length >= 5) {
                cvvRef.current?.focus();
              }
            }}
            className="h-10 rounded-md border-[#e3e8ee] bg-white text-sm tracking-wider text-[#3c4257] transition-all duration-200 placeholder:text-[#a3acb9] sm:h-11"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cvv" className="text-[12px] font-medium text-[#3c4257]">
            CVC
          </Label>
          <Input
            id="cvv"
            ref={cvvRef}
            type="password"
            inputMode="numeric"
            placeholder="CVC"
            maxLength={4}
            value={cvv}
            onChange={(e): void => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 4);
              setCvv(val);
              if (val.length >= 3) {
                (e.target as HTMLInputElement).blur();
              }
            }}
            className="h-10 rounded-md border-[#e3e8ee] bg-white text-sm tracking-wider text-[#3c4257] transition-all duration-200 placeholder:text-[#a3acb9] sm:h-11"
          />
        </div>
      </div>

      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 h-10 w-full cursor-pointer rounded-md text-sm font-semibold tracking-wide transition-all duration-200 hover:shadow-md disabled:opacity-40 sm:mt-1.5 sm:h-11"
        size="lg"
        disabled={!isComplete || isProcessing}
        onClick={handleCharge}
      >
        <span className="flex items-center justify-center gap-2">
          {`Pay ${amount}`}
          {isProcessing && <Loader className="size-4 animate-spin" />}
        </span>
      </Button>
    </div>
  );
}
