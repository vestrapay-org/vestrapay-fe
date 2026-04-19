export type PaymentLinkCurrency = "USD" | "EUR" | "GBP";

export type PaymentLinkStatus = "ACTIVE" | "EXPIRED";

export type PaymentLinkFeeBearer = "MERCHANT" | "CUSTOMER";

export type PaymentLinkRow = {
  id: string;
  linkName: string;
  linkIdDisplay: string;
  amountDisplay: string;
  currency: PaymentLinkCurrency;
  accountMapped: string;
  feeBearer: PaymentLinkFeeBearer;
  expiresLabel: string;
  status: PaymentLinkStatus;
};
