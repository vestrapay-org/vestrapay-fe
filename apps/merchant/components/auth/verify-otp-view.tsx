"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AuthPageLayout } from "@/layout/auth-page-layout";
import { Button } from "@/components/ui/button";
import { MERCHANT_REGISTRATION_CHALLENGE_TOKEN_KEY, useAuth } from "@/hooks/use-auth";
import { extractApiErrorMessage } from "@/lib/extract-api-error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function VerifyOtpView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const emailDisplay = emailParam ? decodeURIComponent(emailParam) : null;
  const { verify, isVerifying, resendVerificationOtp, isResendingOtp } = useAuth();

  const [otp, setOtp] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(30);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsRemaining]);

  async function handleResend() {
    if (!emailDisplay) {
      toast.error("Email is missing. Please restart registration.");
      return;
    }
    const challengeToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem(MERCHANT_REGISTRATION_CHALLENGE_TOKEN_KEY)
        : null;

    if (!challengeToken) {
      toast.error("Session expired. Please register again.");
      router.push("/register");
      return;
    }

    try {
      await resendVerificationOtp(otp);
      setSecondsRemaining(30);
      toast.success("A new verification code has been sent.");
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const digits = otp.replace(/\D/g, "");
    if (digits.length !== 6) {
      toast.error("Enter a valid 6-digit OTP.");
      return;
    }
    if (!emailDisplay) {
      toast.error("Email is missing. Please restart registration.");
      return;
    }
    const challengeToken =
      typeof window !== "undefined"
        ? sessionStorage.getItem(MERCHANT_REGISTRATION_CHALLENGE_TOKEN_KEY)
        : null;
    if (!challengeToken) {
      toast.error("Session expired. Please register again.");
      router.push("/register");
      return;
    }

    try {
      await verify({ code: digits });
      toast.success("Email verified successfully.");
      router.push("/dashboard");
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  }

  return (
    <AuthPageLayout
      title="Verify your email"
      description={
        "We sent a 6-digit code to your email. Enter it below to confirm your address and continue to your dashboard."
      }
      footer={
        secondsRemaining > 0 ? (
          <p className="m-0 text-sm text-gray-600">
            Resend code in{" "}
            <span className="font-semibold text-slate-900">
              {secondsRemaining.toString().padStart(2, "0")}s
            </span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResendingOtp}
            className="font-semibold text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isResendingOtp ? "Resending..." : "Resend code"}
          </button>
        )
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="otp">6-digit code</Label>
          <Input
            id="otp"
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="text-center font-mono text-lg tracking-[0.35em]"
            aria-invalid={otp.length > 0 && otp.length < 6}
          />
          <p className="m-0 text-xs text-gray-500">
            For this demo, any 6 digits will continue to the dashboard.
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="outline" size="lg" type="button">
            <Link href="/register">Back</Link>
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={otp.replace(/\D/g, "").length !== 6 || isVerifying}
            className="!text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isVerifying ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Verifying...
              </>
            ) : (
              "Verify and continue"
            )}
          </Button>
        </div>
      </form>
    </AuthPageLayout>
  );
}
