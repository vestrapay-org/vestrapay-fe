import axios, { type AxiosInstance } from "axios";

import { merchantApiBaseUrl } from "@/lib/api/env";

/**
 * Shared Axios instance for the merchant app. All paths should come from
 * `Routes[MODULE_ROUTE.MERCHANT].…` so URLs stay in one place.
 */
export const baseApi: AxiosInstance = axios.create({
  baseURL: merchantApiBaseUrl,
});

baseApi.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("merchant_access_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

baseApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console -- surfaced for local debugging
      console.error("Merchant API error:", error);
    }
    return Promise.reject(error);
  },
);
