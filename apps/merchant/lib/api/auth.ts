import { baseApi } from "@/lib/api/base-api";
import { MODULE_ROUTE, Routes } from "@/lib/api/routes";
import type {
  APIResponse,
  RegisterMerchantData,
  RegisterMerchantPayload,
  ResendOtpPayload,
  VerifyEmailPayload,
  VerifyEmailData,
  LoginPayload,
  LoginData,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/lib/api/types";

export const registerMerchant = async (
  payload: RegisterMerchantPayload,
): Promise<RegisterMerchantData> => {
  try {
    const { data } = await baseApi.post<APIResponse<RegisterMerchantData> | RegisterMerchantData>(
      Routes[MODULE_ROUTE.MERCHANT].REGISTRATION,
      payload,
    );
    if (data && typeof data === "object" && "data" in data) {
      return (data as APIResponse<RegisterMerchantData>).data;
    }
    return data as RegisterMerchantData;
  } catch (error) {
    // eslint-disable-next-line no-console -- mirrors backend debugging pattern
    console.error("Error registering merchant:", error);
    throw error;
  }
};

export const verifyEmail = async (payload: VerifyEmailPayload): Promise<APIResponse<VerifyEmailData>> => {
  try {
    const { challengeToken, ...body } = payload;
    const { data } = await baseApi.post<APIResponse<VerifyEmailData>>(
      Routes[MODULE_ROUTE.AUTH].VERIFY_EMAIL,
      body,
      {
        headers:
          challengeToken?.length
            ? {
                "x-challenge-token": challengeToken,
              }
            : undefined,
      },
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console -- mirrors backend debugging pattern
    console.error("Error verifying email:", error);
    throw error;
  }
};

export const resendOtp = async (payload: ResendOtpPayload): Promise<APIResponse<void>> => {
  try {
    const { challengeToken, method } = payload;
    const { data } = await baseApi.post<APIResponse<void>>(
      Routes[MODULE_ROUTE.AUTH].RESEND_OTP,
      { method },
      {
        headers:
          challengeToken?.length
            ? {
                "x-challenge-token": challengeToken,
              }
            : undefined,
      },
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console -- mirrors backend debugging pattern
    console.error("Error resending OTP:", error);
    throw error;
  }
};

export const login = async (payload: LoginPayload): Promise<LoginData> => {
  try {
    const { data } = await baseApi.post<APIResponse<LoginData> | LoginData>(
      Routes[MODULE_ROUTE.AUTH].LOGIN,
      payload,
    );
    if (data && typeof data === "object" && "data" in data) {
      return (data as APIResponse<LoginData>).data;
    }
    return data as LoginData;
  } catch (error) {
    // eslint-disable-next-line no-console -- mirrors backend debugging pattern
    console.error("Error logging in:", error);
    throw error;
  }
};

export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<APIResponse<void>> => {
  try {
    const { data } = await baseApi.post<APIResponse<void>>(
      Routes[MODULE_ROUTE.AUTH].FORGOT_PASSWORD,
      payload,
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console -- mirrors backend debugging pattern
    console.error("Error forgotting password:", error);
    throw error;
  }
};

export const resetPassword = async (payload: ResetPasswordPayload): Promise<APIResponse<void>> => {
  try {
    const { data } = await baseApi.post<APIResponse<void>>(
      Routes[MODULE_ROUTE.AUTH].RESET_PASSWORD,
      payload,
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console -- mirrors backend debugging pattern
    console.error("Error resetting password:", error);
    throw error;
  }
};