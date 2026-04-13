import React, { Suspense } from "react";

import { VerifyOtpView } from "@/components/auth/verify-otp-view";

function VerifyOtpFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5] px-5 text-sm text-gray-600">
      Loading verification…
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpFallback />}>
      <VerifyOtpView />
    </Suspense>
  );
}
