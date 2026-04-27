import React, { Suspense } from "react";

import { ResetPasswordView } from "../../components/auth/reset-password-view";

function ResetPasswordFallback() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center px-4 text-sm text-[#6B7280]">
      Loading…
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordView />
    </Suspense>
  );
}
