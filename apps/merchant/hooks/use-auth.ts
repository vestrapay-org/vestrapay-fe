"use client";

import { useCallback, useState } from "react";

import { registerMerchant, resendOtp, verifyEmail } from "@/lib/api/auth";
import type {
  APIResponse,
  RegisterMerchantData,
  RegisterMerchantPayload,
  VerifyEmailData,
  VerifyEmailPayload,
} from "@/lib/api/types";

export const MERCHANT_REGISTRATION_CHALLENGE_TOKEN_KEY = "vestrapay_merchant_registration_challenge_token";
export const MERCHANT_ACCESS_TOKEN_KEY = "vestrapay_merchant_access_token";
export const MERCHANT_REFRESH_TOKEN_KEY = "vestrapay_merchant_refresh_token";

export function useAuth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const register = useCallback(async (payload: RegisterMerchantPayload): Promise<APIResponse<RegisterMerchantData>> => {
    setIsRegistering(true);
    try {
      const response = await registerMerchant(payload);
      const inner = response.data;
      if (inner?.challengeToken && typeof window !== "undefined") {
        sessionStorage.setItem(MERCHANT_REGISTRATION_CHALLENGE_TOKEN_KEY, inner.challengeToken);
      }
      return response;
    } finally {
      setIsRegistering(false);
    }
  }, []);

  const verify = useCallback(async (payload: VerifyEmailPayload): Promise<APIResponse<VerifyEmailData>> => {
    setIsVerifying(true);
    try {
      const response = await verifyEmail(payload);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(MERCHANT_REGISTRATION_CHALLENGE_TOKEN_KEY);
        localStorage.setItem(MERCHANT_ACCESS_TOKEN_KEY, response.data.accessToken);
        localStorage.setItem(MERCHANT_REFRESH_TOKEN_KEY, response.data.refreshToken);
      }
      return response;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  const resendVerificationOtp = useCallback(
    async (code: string): Promise<APIResponse<void>> => {
      setIsResendingOtp(true);
      try {
        return await resendOtp(code);
      } finally {
        setIsResendingOtp(false);
      }
    },
    [],
  );
  return {
    register,
    isRegistering,
    verify,
    isVerifying,
    resendVerificationOtp,
    isResendingOtp,
  };
}
