"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown, Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Nigeria",
  "Kenya",
  "South Africa",
  "Canada",
  "Germany",
  "Other",
] as const;

/** Demo: show “email already exists” for these addresses (case-insensitive). */
const DUPLICATE_DEMO_EMAILS = new Set(["contact@business.com", "existing@vestrapay.com"]);

type Checklist = {
  minLen: boolean;
  number: boolean;
  upper: boolean;
  special: boolean;
};

function evaluatePasswordChecks(password: string): Checklist {
  return {
    minLen: password.length >= 8,
    number: /\d/.test(password),
    upper: /[A-Z]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function strengthScore(checks: Checklist): number {
  return [checks.minLen, checks.number, checks.upper, checks.special].filter(Boolean).length;
}

function strengthLabel(score: number): string {
  if (score <= 0) return "Enter a password";
  if (score === 1) return "Weak";
  if (score === 2) return "Fair";
  if (score === 3) return "Strong";
  return "Very Strong";
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-[0.65rem] font-bold tracking-[0.12em] text-gray-500 uppercase">
      {children}
    </span>
  );
}

const fieldInputClass =
  "h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-gray-400 focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--primary)_22%,transparent)]";

function isValidEmailFormat(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function sanitizeNameInput(value: string): string {
  return value.replace(/[^a-zA-Z\s-]/g, "");
}

function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "");
}

function RegisterMerchantForm() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const checks = useMemo(() => evaluatePasswordChecks(password), [password]);
  const score = strengthScore(checks);

  const canSubmit = useMemo(() => {
    const emailTrim = email.trim();
    return (
      businessName.trim().length > 0 &&
      isValidEmailFormat(emailTrim) &&
      !emailError &&
      phone.trim().length > 0 &&
      country.length > 0 &&
      score === 4 &&
      password.length > 0 &&
      password === confirmPassword &&
      termsAccepted
    );
  }, [
    businessName,
    email,
    phone,
    country,
    password,
    confirmPassword,
    termsAccepted,
    emailError,
    score,
  ]);

  function validateEmail(value: string) {
    const v = value.trim().toLowerCase();
    if (v && DUPLICATE_DEMO_EMAILS.has(v)) {
      setEmailError("An account with this email already exists.");
    } else {
      setEmailError(null);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") ?? "").trim();
    validateEmail(email);
    if (email && DUPLICATE_DEMO_EMAILS.has(email.toLowerCase())) {
      return;
    }
    if (!fd.get("terms")) {
      setSubmitError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }
    if (password !== confirmPassword) {
      setSubmitError("Passwords do not match.");
      return;
    }
    if (score < 4) {
      setSubmitError("Please meet all password requirements before continuing.");
      return;
    }
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`/register/verify-otp${query}`);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div>
        <FieldLabel>Business name</FieldLabel>
        <input
          id="businessName"
          name="businessName"
          required
          placeholder="e.g. Acme Corp"
          autoComplete="organization"
          className={fieldInputClass}
          value={businessName}
          onChange={(e) => setBusinessName(sanitizeNameInput(e.target.value))}
        />
      </div>

      <div>
        <FieldLabel>Business email</FieldLabel>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="contact@business.com"
          autoComplete="email"
          className={cn(fieldInputClass, emailError && "border-red-400 focus-visible:ring-red-200")}
          value={email}
          onBlur={(e) => validateEmail(e.target.value)}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "email-error" : undefined}
        />
        {emailError ? (
          <p id="email-error" className="mt-1.5 text-sm text-red-600" role="alert">
            {emailError}{" "}
            <Link
              href="/forgot-password"
              className="font-semibold text-red-600 underline underline-offset-2"
            >
              Reset password?
            </Link>
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Phone</FieldLabel>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            required
            placeholder="2348030000000"
            title="Digits only"
            pattern="\d+"
            className={fieldInputClass}
            value={phone}
            onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
          />
        </div>
        <div>
          <FieldLabel>Country</FieldLabel>
          <div className="relative">
            <select
              id="country"
              name="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={cn(fieldInputClass, "h-11 appearance-none pr-10", country ? "text-gray-900" : "text-gray-400")}
            >
              <option value="" disabled>
                Select country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <div>
        <FieldLabel>Password</FieldLabel>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={pwVisible ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(fieldInputClass, "pr-11")}
          />
          <button
            type="button"
            className="absolute top-1/2 right-2.5 z-10 -translate-y-1/2 rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
            onClick={() => setPwVisible((v) => !v)}
            aria-label={pwVisible ? "Hide password" : "Show password"}
            aria-pressed={pwVisible}
          >
            {pwVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>

        <div className="mt-3 space-y-2">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  i < score ? "bg-[var(--primary)]" : "bg-gray-200",
                )}
                aria-hidden
              />
            ))}
          </div>
          <p className="m-0 text-sm text-[var(--primary)]">
            Strength: <span className="font-bold">{strengthLabel(score)}</span>
          </p>
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 pl-0">
          {(
            [
              { key: "minLen" as const, label: "8+ characters" },
              { key: "upper" as const, label: "Uppercase letter" },
              { key: "number" as const, label: "One number" },
              { key: "special" as const, label: "Special character" },
            ] as const
          ).map(({ key, label }) => {
            const met = checks[key];
            return (
              <li key={key} className="flex items-center gap-2 text-sm font-medium">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border",
                    met
                      ? "border-emerald-500/50 bg-emerald-50 text-emerald-600"
                      : "border-gray-200 bg-gray-50 text-gray-400",
                  )}
                  aria-hidden
                >
                  {met ? <Check className="size-3" strokeWidth={2.5} /> : null}
                </span>
                <span className={met ? "text-emerald-700" : "text-gray-500"}>{label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <FieldLabel>Confirm password</FieldLabel>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={confirmVisible ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={cn(fieldInputClass, "pr-11")}
          />
          <button
            type="button"
            className="absolute top-1/2 right-2.5 z-10 -translate-y-1/2 rounded-md border-0 bg-transparent p-1.5 text-gray-500 hover:text-gray-800 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none"
            onClick={() => setConfirmVisible((v) => !v)}
            aria-label={confirmVisible ? "Hide confirm password" : "Show confirm password"}
            aria-pressed={confirmVisible}
          >
            {confirmVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          value="accepted"
          required
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
        />
        <label htmlFor="terms" className="cursor-pointer text-sm leading-snug text-gray-600">
          I agree to the <span className="font-bold text-[var(--primary)]">Terms of Service</span>{" "}
          and <span className="font-bold text-[var(--primary)]">Privacy Policy</span>.
        </label>
      </div>

      {submitError ? (
        <p className="m-0 text-sm text-red-600" role="alert">
          {submitError}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit}
        className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-md border-0 bg-[var(--primary)] text-sm font-semibold text-white shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--primary)_65%,transparent)] hover:brightness-105 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
      >
        Create Account
        <ArrowRight className="size-4" aria-hidden />
      </Button>
    </form>
  );
}

export { RegisterMerchantForm };
