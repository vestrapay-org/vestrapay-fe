import Image from "next/image";
import React, { type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AuthPageLayoutProps = {
  title: string;
  description?: ReactNode;
  eyebrow?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  steps?: ReactNode;
  className?: string;
};

export function VestrapayBrand() {
  return (
    <div className="inline-flex items-center gap-2.5">
      <div
        className="grid size-9 shrink-0 place-items-center rounded-[0.35rem] bg-[var(--primary)]"
        aria-hidden
      >
        <Image
          src="/vestrapay-logo-icon.svg"
          alt=""
          width={20}
          height={20}
          className="block h-5 w-5 shrink-0"
          priority
        />
      </div>
      <span className="text-lg font-bold tracking-tight text-[var(--primary)]">Vestrapay</span>
    </div>
  );
}

export function AuthPageLayout({
  title,
  description,
  eyebrow,
  children,
  footer,
  steps,
  className,
}: AuthPageLayoutProps) {
  return (
    <main
      className={cn(
        "mx-auto flex min-h-screen w-full items-center justify-center bg-[#f4f4f5] px-5 pb-10 pt-8",
        className,
      )}
    >
      <div className="flex w-full max-w-[26.5rem] flex-col gap-6">
        <header className="flex flex-col items-center gap-3 text-center">
          <VestrapayBrand />
          {eyebrow ? (
            <p className="m-0 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gray-400">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="m-0 text-[1.75rem] font-bold leading-[1.15] tracking-[-0.03em] text-slate-900 md:text-[2rem]">
            {title}
          </h1>
          {description ? (
            <p className="m-0 max-w-[22rem] text-[0.9375rem] leading-normal text-gray-500">{description}</p>
          ) : null}
          {steps ? <div className="mt-1 w-full">{steps}</div> : null}
        </header>

        <div className="rounded-lg border border-gray-200 bg-white p-5 px-[1.35rem] shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05),0_12px_32px_-12px_rgb(0_0_0_/_0.14)] md:p-7">
          {children}
        </div>

        {footer ? (
          <footer
            className={cn(
              "text-center text-[0.9375rem] leading-normal text-gray-500",
              "[&_a]:font-bold [&_a]:text-[var(--primary)] [&_a]:no-underline [&_a:hover]:underline",
              "[&_button]:m-0 [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-0 [&_button]:[font:inherit] [&_button]:font-bold [&_button]:text-[var(--primary)] [&_button:hover]:underline",
            )}
          >
            {footer}
          </footer>
        ) : null}
      </div>
    </main>
  );
}
