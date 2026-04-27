const MERCHANT = "/merchants" as const;
const AUTH = "/auth" as const;

export enum MODULE_ROUTE {
  MERCHANT = "MERCHANT",
  AUTH = "AUTH",
}

/**
 * Path segments under the API base (which already includes `/v1`).
 * Use these with `baseApi` from `base-api.ts`.
 */
export const Routes = {
  [MODULE_ROUTE.MERCHANT]: {
    REGISTRATION: `${MERCHANT}`,
  },
  [MODULE_ROUTE.AUTH]: {
    VERIFY_EMAIL: `${AUTH}/verify-email`,
    RESEND_OTP: `${AUTH}/resend-otp`,
    LOGIN: `${AUTH}/login`,
    FORGOT_PASSWORD: `${AUTH}/forgot-password`,
    RESET_PASSWORD: `${AUTH}/reset-password`,
  },
} as const;

export type MerchantRouteKey = keyof (typeof Routes)[typeof MODULE_ROUTE.MERCHANT];
export type AuthRouteKey = keyof (typeof Routes)[typeof MODULE_ROUTE.AUTH];