"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { AuthPageLayout } from "@/layout/auth-page-layout";
import { Button } from "../ui/button";
import { checkPasswordRequirements, FloatingPasswordInput } from "./floating-password-input";

export function ResetPasswordView() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const policyMet = useMemo(() => {
    const checks = checkPasswordRequirements(newPassword);
    return Object.values(checks).every(Boolean);
  }, [newPassword]);

  const canSubmit = useMemo(() => {
    return policyMet && newPassword.length > 0 && newPassword === confirmPassword && confirmPassword.length > 0;
  }, [policyMet, newPassword, confirmPassword]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    router.push("/login");
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
          disabled={!canSubmit}
          className="text-primary-foreground mt-1 h-12 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-white shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--primary)_65%,transparent)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          Update password
        </Button>
      </form>
    </AuthPageLayout>
  );
}
