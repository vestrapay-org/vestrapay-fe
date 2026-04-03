export type PaymentMethod = "card" | "bank" | "transfer" | "ussd" | "qr";

export type PaymentStatus = "idle" | "processing" | "success" | "failed";

export type ActivePaymentStatus = Exclude<PaymentStatus, "idle">;

export type CardBrand = "mastercard" | "visa" | "verve" | "unknown";

export interface PaymentComponentProps {
  readonly accessCode: string;
  readonly amount: string;
  readonly reference: string;
  readonly onPaymentSuccess?: (reference: string) => void;
  readonly onPaymentFailed?: (reference: string, errorMsg?: string) => void;
}

export interface Bank {
  readonly code: string;
  readonly name: string;
}

export interface USSDBank extends Bank {
  readonly ussd: string;
}

export interface Merchant {
  readonly name: string;
  readonly email: string;
  readonly amount: number;
  readonly currency: string;
  readonly reference: string;
}

export interface SVGIconProps {
  readonly className?: string;
  readonly active?: boolean;
}

export interface QRCell {
  readonly x: number;
  readonly y: number;
  readonly key: string;
  readonly visible: boolean;
}

export type ChargeCardStatus = "success" | "3ds_required" | "failed";

export interface ChargeCardData {
  readonly status: ChargeCardStatus;
  readonly reference: string;
  readonly threeDsHtml: string | null;
}

export interface ApiResponse<T> {
  readonly metadata: {
    readonly language: string;
    readonly timestamp: number;
    readonly timezone: string;
    readonly path: string;
    readonly version: string;
    readonly repoVersion: string;
  };
  readonly message: string;
  readonly statusCode: number;
  readonly data: T;
}

export type ThreeDsCompleteData = ChargeCardData;

export interface ChargeBankTransferData {
  readonly status: string;
  readonly reference: string;
  readonly accountNumber: string;
  readonly bankName: string;
  readonly accountName: string;
  readonly expiresAt: string;
}

export interface ChargeBankPaymentData {
  readonly status: string;
  readonly transactionReference: string;
  readonly paymentReference: string;
  readonly amount: number;
  readonly currency: string;
  readonly fee: number;
  readonly redirectUrl: string;
  readonly bankName: string;
}

export type CheckoutChannel = "card" | "bank_transfer" | "bank_payment" | "ussd" | "qr";

export interface CheckoutConfig {
  readonly reference: string;
  readonly amount: number;
  readonly currency: string;
  readonly email: string;
  readonly description: string | null;
  readonly channels: readonly CheckoutChannel[];
  readonly merchant: {
    readonly name: string;
  };
  readonly callbackUrl: string | null;
}

export type VerifyTransactionStatus = "pending" | "processing" | "success" | "failed";

export interface VerifyTransactionData {
  readonly status: VerifyTransactionStatus;
  readonly amount: number;
  readonly currency: string;
  readonly channel: string;
  readonly reference: string;
  readonly paidAt: string | null;
  readonly fees: number;
  readonly metadata: Record<string, unknown> | null;
}

export interface CheckoutChargeCardRequest {
  readonly access_code: string;
  readonly reference: string;
  readonly card: {
    readonly number: string;
    readonly cvv: string;
    readonly expiryMonth: string;
    readonly expiryYear: string;
  };
}

export interface CheckoutComplete3dsRequest {
  readonly access_code: string;
  readonly reference: string;
}

export interface CheckoutChargeBankTransferRequest {
  readonly access_code: string;
  readonly reference: string;
}

export interface CheckoutChargeUssdRequest {
  readonly access_code: string;
  readonly reference: string;
  readonly bankCode: string;
}

export interface CheckoutChargeUssdData {
  readonly status: string;
  readonly reference: string;
  readonly ussdCode: string;
}

export interface CheckoutCompleteUssdRequest {
  readonly access_code: string;
  readonly reference: string;
}

export interface CheckoutCompleteUssdData {
  readonly status: string;
  readonly reference: string;
}

export interface CheckoutChargeBankPaymentRequest {
  readonly access_code: string;
  readonly reference: string;
  readonly bankCode: string;
}

export type PaymentStatusEventStatus = "success" | "failed" | "pending" | "processing";

export interface PaymentStatusEvent {
  readonly reference: string;
  readonly status: PaymentStatusEventStatus;
  readonly amount: number;
  readonly currency: string;
  readonly paidAt: string | null;
}

export interface ServerToClientEvents {
  "payment:status": (event: PaymentStatusEvent) => void;
}

export interface ClientToServerEvents {
  subscribe: (payload: { readonly reference: string }) => void;
  unsubscribe: (payload: { readonly reference: string }) => void;
}
