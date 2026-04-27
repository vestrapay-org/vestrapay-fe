"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AuthPageLayout } from "@/layout/auth-page-layout";
import { useAuth } from "@/hooks/use-auth";
import { extractApiErrorMessage } from "@/lib/extract-api-error-message";
import { Button } from "../ui/button";
import { checkPasswordRequirements, FloatingPasswordInput } from "./floating-password-input";

export function ResetPasswordView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { resetPasswordMerchant, isResettingPassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromQuery = searchParams.get("token");
    if (!tokenFromQuery) return;
    setToken(tokenFromQuery);
    router.replace(pathname);
  }, [pathname, router, searchParams]);

  const policyMet = useMemo(() => {
    const checks = checkPasswordRequirements(newPassword);
    return Object.values(checks).every(Boolean);
  }, [newPassword]);

  const canSubmit = useMemo(() => {
    return policyMet && newPassword.length > 0 && newPassword === confirmPassword && confirmPassword.length > 0;
  }, [policyMet, newPassword, confirmPassword]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    if (!token) {
      toast.error("Reset token is missing or invalid.");
      return;
    }
    try {
      await resetPasswordMerchant({
        token,
        newPassword,
      });
      toast.success("Password updated successfully.");
      router.push("/login");
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  }

  return (
    <AuthPageLayout
      title="Reset password"
      description="Create a new secure password for your merchant account."
      footer={
        <p className="m-0">
          Remembered your password? <Link href="/login">Back to sign in</Link>
        </p>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FloatingPasswordInput
          id="newPassword"
          label="New password"
          showRequirements
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <FloatingPasswordInput
          id="confirmPassword"
          label="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="submit"
          disabled={!canSubmit || !token || isResettingPassword}
          className="text-primary-foreground mt-1 h-12 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-white shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--primary)_65%,transparent)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isResettingPassword ? (
            <>
              <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
              Updating...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </AuthPageLayout>
  );
}
