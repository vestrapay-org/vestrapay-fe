import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export const HTTP_METHODS = {
  GET: { label: "GET", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" },
  POST: { label: "POST", color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400" },
  PUT: { label: "PUT", color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" },
  PATCH: { label: "PATCH", color: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400" },
  DELETE: { label: "DELETE", color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400" },
} as const;

export type HttpMethod = keyof typeof HTTP_METHODS;
