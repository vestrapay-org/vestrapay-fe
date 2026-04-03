import { CircleX } from "@/components/icons";
import type { CheckoutErrorProps } from "../_lib/types";

export function CheckoutError({ message }: CheckoutErrorProps): React.ReactNode {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50">
        <CircleX className="size-7 text-red-400" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-semibold text-[#3c4257]">Something went wrong</p>
      <p className="max-w-xs text-xs leading-relaxed text-[#8898aa]">{message}</p>
    </div>
  );
}
