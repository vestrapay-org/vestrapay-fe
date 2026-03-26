import { useEffect, useState } from "react";
import { MERCHANT } from "@/lib/constants";
import type { Merchant } from "@/lib/types";

interface CheckoutParams {
  readonly merchant: Merchant;
  readonly callbackUrl: string | null;
}

function parseParams(): CheckoutParams {
  if (typeof window === "undefined") {
    return { merchant: MERCHANT, callbackUrl: null };
  }

  const params = new URLSearchParams(window.location.search);
  const rawAmount = params.get("amount");
  const parsed = rawAmount ? Number(rawAmount) : NaN;
  const amount = Number.isNaN(parsed) || parsed <= 0 ? MERCHANT.amount : parsed;

  const merchant: Merchant = {
    name: params.get("name") ?? MERCHANT.name,
    email: params.get("email") ?? MERCHANT.email,
    amount,
    currency: params.get("currency") ?? MERCHANT.currency,
    reference: params.get("reference") ?? MERCHANT.reference,
  };

  let callbackUrl: string | null = null;
  const raw = params.get("redirect_url");
  if (raw) {
    try {
      new URL(raw);
      callbackUrl = raw;
    } catch {
      // invalid URL — ignore
    }
  }

  return { merchant, callbackUrl };
}

export function useCheckoutParams(): CheckoutParams {
  const [params, setParams] = useState<CheckoutParams>({
    merchant: MERCHANT,
    callbackUrl: null,
  });

  useEffect(() => {
    setParams(parseParams());
  }, []);

  return params;
}
