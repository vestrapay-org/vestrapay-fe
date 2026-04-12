"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

import { AuthPageLayout } from "@/layout/auth-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function VerifyOtpView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const emailDisplay = emailParam ? decodeURIComponent(emailParam) : null;

  const [otp, setOtp] = useState("");
  const [resent, setResent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const digits = otp.replace(/\D/g, "");
    if (digits.length !== 6) {
      return;
    }
    router.push("/dashboard");
  }

  return (
    <AuthPageLayout
      title="Verify your email"
      description={
        emailDisplay ? (
          <>
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-slate-800">{emailDisplay}</span>. Enter it below to
            confirm your address.
          </>
        ) : (
          "We sent a 6-digit code to the email you used at registration. Enter it below to verify your address and continue to your dashboard."
        )
      }
      footer={
        <p className="m-0">
          Wrong email? <Link href="/register">Go back and edit</Link>
          {" · "}
          <button type="button" onClick={() => setResent(true)}>
            Resend code
          </button>
          {resent ? <span className="ml-1 text-emerald-600">(Demo: request recorded)</span> : null}
        </p>
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
            disabled={otp.replace(/\D/g, "").length !== 6}
            className="!text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
          >
            Verify and continue
          </Button>
        </div>
      </form>
    </AuthPageLayout>
  );
}

export { VerifyOtpView };
