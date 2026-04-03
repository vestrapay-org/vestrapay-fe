import type { CheckoutConfig, PaymentMethod, SVGIconProps } from "@/lib/types";

export type CheckoutPhase = "loading" | "not-found" | "error" | "ready";

export type CheckoutState =
  | { readonly phase: "loading" }
  | { readonly phase: "not-found" }
  | { readonly phase: "error"; readonly message: string }
  | { readonly phase: "ready"; readonly config: CheckoutConfig };

export type PaymentOutcome =
  | { readonly status: "success"; readonly reference: string }
  | { readonly status: "failed"; readonly reference: string; readonly errorMsg?: string }
  | null;

export interface PaymentMethodConfig {
  readonly id: PaymentMethod;
  readonly label: string;
  readonly icon: React.ComponentType<SVGIconProps>;
}

export interface MethodNavProps {
  readonly methods: ReadonlyArray<PaymentMethodConfig>;
  readonly active: PaymentMethod;
  readonly onSelect: (method: PaymentMethod) => void;
}

export interface CheckoutHeaderProps {
  readonly merchantName: string;
  readonly email: string;
  readonly description: string | null;
  readonly formattedAmount: string;
  readonly onClose: () => void;
}

export interface CheckoutErrorProps {
  readonly message: string;
}
