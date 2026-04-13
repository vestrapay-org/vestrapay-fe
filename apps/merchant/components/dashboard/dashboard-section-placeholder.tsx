import Link from "next/link";
import React from "react";

type DashboardSectionPlaceholderProps = {
  title: string;
  description?: string;
};

function DashboardSectionPlaceholder({
  title,
  description = "This section is a placeholder until it is connected to your backend.",
}: DashboardSectionPlaceholderProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h2 className="m-0 text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-gray-600">{description}</p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex text-sm font-semibold text-[var(--primary)] no-underline hover:underline"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}

export { DashboardSectionPlaceholder };
