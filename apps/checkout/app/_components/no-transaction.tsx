import { AlertTriangle, Lock } from "lucide-react";

export function NoTransaction(): React.ReactNode {
  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f0f2f5] p-0 sm:items-center sm:p-5">
      <div className="w-full max-w-140">
        <div className="animate-in fade-in-0 zoom-in-95 flex min-h-screen flex-col overflow-hidden bg-white shadow-sm duration-300 sm:min-h-96 sm:rounded-lg sm:shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
            <img src="/vestrapay.svg" alt="Vestrapay" className="mb-8 h-6 w-auto" />

            <div className="flex size-14 items-center justify-center rounded-full bg-red-50">
              <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="size-5 text-red-500" strokeWidth={2} />
              </div>
            </div>

            <h1 className="mt-5 text-[15px] font-semibold text-[#1a1d26]">
              Transaction not found
            </h1>
            <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-[#6b7280]">
              We couldn&apos;t find the transaction linked to this checkout. The link may be invalid
              or has already expired.
            </p>

            <div className="mt-5 rounded-md bg-red-50 px-4 py-2.5">
              <p className="text-[11px] text-red-600">
                Contact the merchant for a new payment link.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 pb-4 sm:pb-0">
          <Lock className="size-3 text-[#a0a3b1]/60" strokeWidth={2} />
          <span className="flex items-center gap-1.5 text-[11px] tracking-wide text-[#a0a3b1]">
            Secured by <span className="font-semibold text-[#2d2572]">Vestrapay</span>
          </span>
        </div>
      </div>
    </main>
  );
}
