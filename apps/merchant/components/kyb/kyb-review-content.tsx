"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, ArrowRight, Building2, Check, CreditCard, FileText, Pencil, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { maskAccountNumber, maskIdNumber } from "./kyb-format";
import { useKybWizard } from "./kyb-wizard-context";

function formatPhoneDisplay(digits: string): string {
  if (digits.length < 10) return digits;
  const cc = digits.slice(0, digits.length - 10);
  const rest = digits.slice(-10);
  const a = rest.slice(0, 3);
  const b = rest.slice(3, 6);
  const c = rest.slice(6);
  if (cc) return `+${cc} (${a}) ${b}-${c}`;
  return `(${a}) ${b}-${c}`;
}

function ReviewBlock({
  title,
  icon: Icon,
  editHref,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-100 bg-gray-50/40 p-4 md:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="size-4 shrink-0 text-[var(--primary)]" aria-hidden />
          <h2 className="m-0 text-[0.65rem] font-bold tracking-[0.12em] text-gray-600 uppercase">{title}</h2>
        </div>
        <Link
          href={editHref}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--primary)] no-underline hover:underline"
        >
          <Pencil className="size-3.5" aria-hidden />
          Edit
        </Link>
      </div>
      <div className="grid gap-3 text-sm text-slate-800">{children}</div>
    </section>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="m-0 text-[0.65rem] font-semibold tracking-wide text-gray-500 uppercase">{label}</p>
      <p className="mt-0.5 font-medium text-slate-900">{value || "—"}</p>
    </div>
  );
}

function KybReviewContent() {
  const router = useRouter();
  const { business, identity, settlement, documents, resetAll } = useKybWizard();

  const registeredAddressLine = [business.registeredAddress, business.city, business.state]
    .filter(Boolean)
    .join(", ");

  function handleSubmit() {
    resetAll();
    router.push("/dashboard");
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
      <header className="mb-6">
        <h1 className="m-0 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Review your KYB application</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[0.9375rem]">
          Please review the information provided below before submitting your application for verification.
        </p>
      </header>

      <div className="grid gap-4">
        <ReviewBlock title="Business information" icon={Building2} editHref="/dashboard/kyb">
          <FieldRow label="Legal business name" value={business.legalBusinessName} />
          <FieldRow label="Business type" value={business.businessType} />
          <FieldRow label="Registered address" value={registeredAddressLine} />
          <FieldRow label="Phone number" value={formatPhoneDisplay(business.phone.replace(/\D/g, ""))} />
          <FieldRow label="Website" value={business.website} />
          {business.industry ? <FieldRow label="Industry" value={business.industry} /> : null}
        </ReviewBlock>

        <ReviewBlock title="Identity verification" icon={User} editHref="/dashboard/kyb/identity">
          <FieldRow label="Full legal name" value={identity.fullLegalName} />
          <FieldRow
            label="Date of birth"
            value={
              identity.dateOfBirth
                ? new Date(`${identity.dateOfBirth}T12:00:00`).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""
            }
          />
          <FieldRow label="Nationality" value={identity.nationality} />
          <FieldRow label="ID number" value={maskIdNumber(identity.idNumber)} />
        </ReviewBlock>

        <ReviewBlock title="Settlement details" icon={CreditCard} editHref="/dashboard/kyb/settlement">
          <FieldRow label="Bank name" value={settlement.bankName} />
          <FieldRow label="Account type" value={settlement.accountType} />
          <FieldRow label="Account number" value={maskAccountNumber(settlement.accountNumber)} />
          <FieldRow label="Routing number" value={settlement.routingNumber} />
        </ReviewBlock>

        <ReviewBlock title="Uploaded documents" icon={FileText} editHref="/dashboard/kyb/documents">
          {documents.certFileName ? (
            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2.5">
              <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
              <div>
                <p className="m-0 text-sm font-medium text-slate-900">Certificate of incorporation</p>
                <p className="m-0 text-xs text-gray-500">
                  {documents.certFileName}
                  {documents.certFileSize ? ` · ${documents.certFileSize}` : ""}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No certificate uploaded.</p>
          )}
          {documents.passportFileName ? (
            <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2.5">
              <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
              <div>
                <p className="m-0 text-sm font-medium text-slate-900">Passport or ID</p>
                <p className="m-0 text-xs text-gray-500">
                  {documents.passportFileName}
                  {documents.passportFileSize ? ` · ${documents.passportFileSize}` : ""}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No ID document uploaded.</p>
          )}
        </ReviewBlock>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/kyb/documents"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 no-underline hover:text-slate-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Link>
        <Button
          type="button"
          onClick={handleSubmit}
          className="h-11 min-w-[12rem] rounded-lg border-0 bg-[var(--primary)] px-6 text-sm font-semibold text-white shadow-sm hover:brightness-105"
        >
          Submit application
          <ArrowRight className="ml-2 inline size-4 align-middle" aria-hidden />
        </Button>
      </div>
    </section>
  );
}

export { KybReviewContent };
