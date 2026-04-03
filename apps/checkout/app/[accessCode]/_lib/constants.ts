import { CardIcon, BankIcon, TransferIcon, USSDIcon, QRIcon } from "@/components/payment-icons";
import { CardPayment } from "@/components/card-payment";
import { BankPayment } from "@/components/bank-payment";
import { TransferPayment } from "@/components/transfer-payment";
import { USSDPayment } from "@/components/ussd-payment";
import { QRCodePayment } from "@/components/qr-payment";
import type { CheckoutChannel, PaymentMethod, PaymentComponentProps } from "@/lib/types";
import type { PaymentMethodConfig } from "./types";

export const CHANNEL_METHOD_MAP = {
  card: "card",
  bank_transfer: "transfer",
  bank_payment: "bank",
  ussd: "ussd",
  qr: "qr",
} as const satisfies Readonly<Record<CheckoutChannel, PaymentMethod>>;

export const METHOD_CONFIG_MAP: Readonly<Record<PaymentMethod, PaymentMethodConfig>> = {
  card: { id: "card", label: "Card", icon: CardIcon },
  transfer: { id: "transfer", label: "Bank Transfer", icon: TransferIcon },
  bank: { id: "bank", label: "Pay with Bank", icon: BankIcon },
  ussd: { id: "ussd", label: "USSD", icon: USSDIcon },
  qr: { id: "qr", label: "QR Code", icon: QRIcon },
} as const satisfies Readonly<Record<PaymentMethod, PaymentMethodConfig>>;

export const PAYMENT_COMPONENTS: Readonly<
  Record<PaymentMethod, React.ComponentType<PaymentComponentProps>>
> = {
  card: CardPayment,
  bank: BankPayment,
  transfer: TransferPayment,
  ussd: USSDPayment,
  qr: QRCodePayment,
};

export const TRANSITION_MS = 150 as const;
export const REDIRECT_DELAY_MS = 2500 as const;
