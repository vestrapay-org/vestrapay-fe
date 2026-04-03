import type {
  ApiResponse,
  ChargeCardData,
  ThreeDsCompleteData,
  ChargeBankTransferData,
  ChargeBankPaymentData,
  CheckoutChargeCardRequest,
  CheckoutComplete3dsRequest,
  CheckoutChargeBankTransferRequest,
  CheckoutChargeUssdRequest,
  CheckoutChargeUssdData,
  CheckoutCompleteUssdRequest,
  CheckoutCompleteUssdData,
  CheckoutChargeBankPaymentRequest,
  CheckoutConfig,
  VerifyTransactionData,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

export class ApiError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface FetchOptions {
  readonly method?: string;
  readonly body?: unknown;
  readonly withApiKey?: boolean;
}

async function apiFetch<T>(path: string, options?: FetchOptions): Promise<T> {
  const method = options?.method ?? "POST";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-correlation-id": crypto.randomUUID(),
  };

  if (options?.withApiKey !== false) {
    headers["x-api-key"] = API_KEY;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    ...(options?.body != null ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch((): string => "Unknown error");
    throw new ApiError(res.status, text);
  }

  return res.json() as Promise<T>;
}

export function getCheckoutConfig(
  accessCode: string,
): Promise<ApiResponse<CheckoutConfig>> {
  return apiFetch<ApiResponse<CheckoutConfig>>(
    `/api/v1/public/payment/checkout/${encodeURIComponent(accessCode)}`,
    { method: "GET", withApiKey: false },
  );
}

export function verifyTransaction(
  reference: string,
): Promise<ApiResponse<VerifyTransactionData>> {
  return apiFetch<ApiResponse<VerifyTransactionData>>(
    `/api/v1/public/payment/verify/${encodeURIComponent(reference)}`,
    { method: "GET" },
  );
}

export function checkoutChargeCard(
  req: CheckoutChargeCardRequest,
): Promise<ApiResponse<ChargeCardData>> {
  return apiFetch<ApiResponse<ChargeCardData>>(
    "/api/v1/public/payment/checkout/charge/card",
    { body: req, withApiKey: false },
  );
}

export function checkoutComplete3ds(
  req: CheckoutComplete3dsRequest,
): Promise<ApiResponse<ThreeDsCompleteData>> {
  return apiFetch<ApiResponse<ThreeDsCompleteData>>(
    "/api/v1/public/payment/checkout/charge/card/3ds-complete",
    { body: req, withApiKey: false },
  );
}

export function checkoutChargeBankTransfer(
  req: CheckoutChargeBankTransferRequest,
): Promise<ApiResponse<ChargeBankTransferData>> {
  return apiFetch<ApiResponse<ChargeBankTransferData>>(
    "/api/v1/public/payment/checkout/charge/bank-transfer",
    { body: req, withApiKey: false },
  );
}

export function checkoutChargeUssd(
  req: CheckoutChargeUssdRequest,
): Promise<ApiResponse<CheckoutChargeUssdData>> {
  return apiFetch<ApiResponse<CheckoutChargeUssdData>>(
    "/api/v1/public/payment/checkout/charge/ussd",
    { body: req, withApiKey: false },
  );
}

export function checkoutCompleteUssd(
  req: CheckoutCompleteUssdRequest,
): Promise<ApiResponse<CheckoutCompleteUssdData>> {
  return apiFetch<ApiResponse<CheckoutCompleteUssdData>>(
    "/api/v1/public/payment/checkout/charge/ussd/complete",
    { body: req, withApiKey: false },
  );
}

export function checkoutChargeBankPayment(
  req: CheckoutChargeBankPaymentRequest,
): Promise<ApiResponse<ChargeBankPaymentData>> {
  return apiFetch<ApiResponse<ChargeBankPaymentData>>(
    "/api/v1/public/payment/checkout/charge/bank-payment",
    { body: req, withApiKey: false },
  );
}

export function checkoutGetBankPaymentBanks(): Promise<
  ApiResponse<ReadonlyArray<{ readonly code: string; readonly name: string; readonly slug: string }>>
> {
  return apiFetch<
    ApiResponse<ReadonlyArray<{ readonly code: string; readonly name: string; readonly slug: string }>>
  >("/api/v1/public/payment/checkout/banks/pay-with-bank", {
    method: "GET",
    withApiKey: false,
  });
}
