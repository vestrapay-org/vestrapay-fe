"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AuthPageLayout } from "@/layout/auth-page-layout";
import { useAuth } from "@/hooks/use-auth";
import { extractApiErrorMessage } from "@/lib/extract-api-error-message";
import { Button } from "../ui/button";
import { FloatingInput } from "./register-form-utils";

export function ForgotPasswordView() {
  const router = useRouter();
  const { forgotPasswordMerchant, isForgotPassword } = useAuth();
  const [email, setEmail] = useState("");

  const canSubmit = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()), [email]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await forgotPasswordMerchant({ email: email.trim() });
      toast.success("Password reset link sent successfully.");
      router.push("/reset-password");
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  }

  return (
    <AuthPageLayout
      title="Forgot password?"
      description="Enter your business email and we'll send a reset link."
      footer={
        <p className="m-0">
          Remembered your password? <Link href="/login">Back to sign in</Link>
        </p>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FloatingInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          disabled={!canSubmit || isForgotPassword}
          className="text-primary-foreground mt-1 h-12 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-white shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--primary)_65%,transparent)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isForgotPassword ? (
            <>
              <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
              Sending...
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>
    </AuthPageLayout>
  );
}
