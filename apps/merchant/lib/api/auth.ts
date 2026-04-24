import { baseApi } from "@/lib/api/base-api";
import { MODULE_ROUTE, Routes } from "@/lib/api/routes";
import type {
  APIResponse,
  RegisterMerchantData,
  RegisterMerchantPayload,
  ResendOtpPayload,
  VerifyEmailPayload,
  VerifyEmailData,
} from "@/lib/api/types";

export const registerMerchant = async (
  payload: RegisterMerchantPayload,
): Promise<APIResponse<RegisterMerchantData>> => {
  try {
    const { data } = await baseApi.post<APIResponse<RegisterMerchantData>>(
      Routes[MODULE_ROUTE.MERCHANT].REGISTRATION,
      payload,
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console -- mirrors backend debugging pattern
    console.error("Error registering merchant:", error);
    throw error;
  }
};

export const verifyEmail = async (payload: VerifyEmailPayload): Promise<APIResponse<VerifyEmailData>> => {
  try {
    const { data } = await baseApi.post<APIResponse<VerifyEmailData>>(
      Routes[MODULE_ROUTE.AUTH].VERIFY_EMAIL,
      payload,
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
    const { data } = await baseApi.post<APIResponse<void>>(
      Routes[MODULE_ROUTE.AUTH].RESEND_OTP,
      payload,
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console -- mirrors backend debugging pattern
    console.error("Error resending OTP:", error);
    throw error;
  }
};