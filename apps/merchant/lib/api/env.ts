function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

const raw = process.env.NEXT_PUBLIC_MERCHANT_API_BASE_URL;

if (!raw?.trim()) {
  throw new Error(
    "NEXT_PUBLIC_MERCHANT_API_BASE_URL is not set. Copy apps/merchant/.env.example to apps/merchant/.env or use apps/merchant/.env.development for local defaults.",
  );
}

export const merchantApiBaseUrl = stripTrailingSlash(raw.trim());
