import { isAxiosError } from "axios";

/**
 * Turns Axios (or generic) errors into a single user-facing string.
 */
export function extractApiErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : "Something went wrong. Please try again.";
  }
  const body = error.response?.data;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const msg = record.message ?? record.error ?? record.detail;
    if (typeof msg === "string" && msg.trim()) return msg;
    if (Array.isArray(record.errors) && record.errors.length > 0) {
      const first = record.errors[0];
      if (typeof first === "string") return first;
      if (first && typeof first === "object" && "message" in first) {
        const m = (first as { message?: unknown }).message;
        if (typeof m === "string") return m;
      }
    }
  }
  if (error.response?.status === 409) {
    return "An account with this email already exists.";
  }
  if (error.response?.status === 422) {
    return "Please check your details and try again.";
  }
  return error.message || "Request failed. Please try again.";
}
