"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { AuthPageLayout } from "@/layout/auth-page-layout";
import { Button } from "../ui/button";
import { FloatingPasswordInput } from "./floating-password-input";
import { FloatingInput } from "./register-form-utils";

function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && password.length > 0;
  }, [email, password]);

  return (
    <AuthPageLayout
      title="Welcome back"
      description="Sign in to your merchant account to manage payouts and settlements."
      footer={
        <p className="m-0">
          New here?{" "}
          <Link href="/register">Register your business</Link>
        </p>
      }
    >
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          router.push("/dashboard");
        }}
      >
        <FloatingInput
          id="email"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FloatingPasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link
          href="/forgot-password"
          className="text-primary ml-auto text-sm font-semibold no-underline hover:underline"
        >
          Forgot password?
        </Link>

        <Button
          type="submit"
          disabled={!canSubmit}
          className="text-primary-foreground mt-1 h-12 w-full rounded-md bg-[var(--primary)] text-sm font-semibold text-white shadow-[0_14px_30px_-14px_color-mix(in_oklch,var(--primary)_65%,transparent)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          Sign in
        </Button>
      </form>
    </AuthPageLayout>
  );
}

export { LoginView };
