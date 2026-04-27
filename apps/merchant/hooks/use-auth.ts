"use client";

import { useCallback, useState } from "react";

import { login, registerMerchant, resendOtp, verifyEmail, forgotPassword, resetPassword } from "@/lib/api/auth";
import { useAuthFlowStore } from "@/stores/auth-flow-store";
import type {
  APIResponse,
  ForgotPasswordPayload,
  LoginData,
  LoginPayload,
  RegisterMerchantData,
  RegisterMerchantPayload,
  ResetPasswordPayload,
  VerifyEmailData,
  VerifyEmailPayload,
} from "@/lib/api/types";

export const MERCHANT_REGISTRATION_CHALLENGE_TOKEN_KEY = "vestrapay_merchant_registration_challenge_token";
export const MERCHANT_ACCESS_TOKEN_KEY = "vestrapay_merchant_access_token";
export const MERCHANT_REFRESH_TOKEN_KEY = "vestrapay_merchant_refresh_token";

export function clearAuthStorage() {
  if (typeof window === "undefined") return;
  window.localStorage.clear();
  window.sessionStorage.clear();
  useAuthFlowStore.getState().clear();
}

export function useAuth() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const loginMerchant = useCallback(async (payload: LoginPayload): Promise<LoginData> => {
    setIsLoggingIn(true);
    try {
      const response = await login(payload);
      if (typeof window !== "undefined") {
        localStorage.setItem(MERCHANT_ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(MERCHANT_REFRESH_TOKEN_KEY, response.refreshToken);
      }
      return response;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterMerchantPayload): Promise<RegisterMerchantData> => {
    setIsRegistering(true);
    try {
      const response = await registerMerchant(payload);
      if (response?.challengeToken && typeof window !== "undefined") {
        sessionStorage.setItem(MERCHANT_REGISTRATION_CHALLENGE_TOKEN_KEY, response.challengeToken);
      }
      return response;
    } finally {
      setIsRegistering(false);
    }
  }, []);

  const verify = useCallback(async (payload: VerifyEmailPayload): Promise<APIResponse<VerifyEmailData>> => {
    setIsVerifying(true);
    try {
      const challengeToken = useAuthFlowStore.getState().registrationData?.challengeToken;
      const response = await verifyEmail({
        ...payload,
        challengeToken: challengeToken ?? payload.challengeToken,
      });
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
        const challengeToken = useAuthFlowStore.getState().registrationData?.challengeToken;
        return await resendOtp({
          method: code,
          challengeToken,
        });
      } finally {
        setIsResendingOtp(false);
      }
    },
    [],
  );

  const forgotPasswordMerchant = useCallback(async (payload: ForgotPasswordPayload): Promise<APIResponse<void>> => {
    setIsForgotPassword(true);
    try {
      const response = await forgotPassword(payload);
      return response;
    } finally {
      setIsForgotPassword(false);
    }
  }, []);

  const resetPasswordMerchant = useCallback(async (payload: ResetPasswordPayload): Promise<APIResponse<void>> => {
    setIsResettingPassword(true);
    try {
      const response = await resetPassword(payload);
      return response;
    } finally {
      setIsResettingPassword(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
  }, []);

  return {
    login: loginMerchant,
    isLoggingIn,
    register,
    isRegistering,
    verify,
    isVerifying,
    resendVerificationOtp,
    isResendingOtp,
    forgotPasswordMerchant,
    isForgotPassword,
    resetPasswordMerchant,
    isResettingPassword,
    logout,
  };
}
