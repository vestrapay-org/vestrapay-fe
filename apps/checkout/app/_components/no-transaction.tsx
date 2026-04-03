import { Link2Off, Lock } from "lucide-react";

export function NoTransaction(): React.ReactNode {
  return (
    <main className="flex min-h-screen items-start justify-center bg-[#f6f9fc] p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-150">
        <div className="flex min-h-screen flex-col overflow-hidden bg-white sm:min-h-0 sm:rounded-2xl sm:border sm:border-[#e3e8ee]">
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center">
            <img src="/vestrapay.svg" alt="Vestrapay" className="mb-10 h-7 w-auto sm:h-8" />

            <div className="flex size-16 items-center justify-center rounded-2xl bg-[#f6f9fc]">
              <Link2Off className="size-7 text-[#8898aa]" strokeWidth={1.5} />
            </div>

            <h1 className="mt-6 text-[17px] font-semibold text-[#3c4257]">
              Transaction not found
            </h1>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#6b7c93]">
              We couldn&apos;t find the transaction linked to this checkout. The link may be invalid
              or has already expired.
            </p>
            <p className="mt-5 text-xs text-[#8898aa]">
              Contact the merchant for a new payment link.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1.5 pb-4 sm:pb-0">
          <Lock className="size-3 text-[#8898aa]/60" strokeWidth={2} />
          <span className="flex items-center gap-1.5 text-[11px] tracking-wide text-[#8898aa]">
            Secured by <span className="font-semibold text-[#34287b]">Vestrapay</span>
          </span>
        </div>
      </div>
    </main>
  );
}
