"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, ArrowRight, Building2, CreditCard, Pencil, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { maskAccountNumber } from "./kyb-format";
import { isKybOwnerComplete } from "./kyb-owner-utils";
import { useKybWizard, type KybOwnerFields } from "./kyb-wizard-context";

function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length < 10) return digits;
  const cc = d.slice(0, d.length - 10);
  const rest = d.slice(-10);
  const a = rest.slice(0, 3);
  const b = rest.slice(3, 6);
  const c = rest.slice(6);
  if (cc) return `+${cc} (${a}) ${b}-${c}`;
  return `(${a}) ${b}-${c}`;
}

function isValidWebsite(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  const href = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const parsed = new URL(href);
    return parsed.hostname.includes(".");
  } catch {
    return false;
  }
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

function OwnerReviewFields({ owner, heading }: { owner: KybOwnerFields; heading: string }) {
  const addr = [owner.residentialStreet, owner.residentialCity, owner.residentialState, owner.residentialPostalCode]
    .filter(Boolean)
    .join(", ");
  return (
    <div className="space-y-3">
      <p className="m-0 text-xs font-bold uppercase tracking-wide text-[var(--primary)]">{heading}</p>
      <FieldRow label="Legal first name" value={owner.legalFirstName} />
      <FieldRow label="Legal last name" value={owner.legalLastName} />
      <FieldRow
        label="Date of birth"
        value={
          owner.dateOfBirth
            ? new Date(`${owner.dateOfBirth}T12:00:00`).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""
        }
      />
      <FieldRow label="SSN / TIN (last 4)" value={owner.ssnTinLast4 ? `••••${owner.ssnTinLast4}` : ""} />
      <FieldRow label="Personal email" value={owner.personalEmail} />
      <FieldRow label="Phone number" value={formatPhoneDisplay(owner.personalPhone)} />
      <FieldRow label="Residential address" value={addr} />
      <FieldRow label="Residential country" value={owner.residentialCountry} />
      <FieldRow label="Country of citizenship" value={owner.citizenshipCountry} />
      <FieldRow label="ID document type" value={owner.idDocumentType} />
      {owner.idDocumentFileName ? (
        <FieldRow
          label="ID document"
          value={`${owner.idDocumentFileName}${owner.idDocumentFileSize ? ` · ${owner.idDocumentFileSize}` : ""}`}
        />
      ) : null}
      {owner.proofOfAddressFileName ? (
        <FieldRow
          label="Proof of address"
          value={`${owner.proofOfAddressFileName}${owner.proofOfAddressFileSize ? ` · ${owner.proofOfAddressFileSize}` : ""}`}
        />
      ) : null}
    </div>
  );
}

function KybReviewContent() {
  const router = useRouter();
  const { business, identity, settlement, resetAll } = useKybWizard();

  const registeredAddressLine = [business.registeredAddress, business.city, business.state]
    .filter(Boolean)
    .join(", ");

  const hasCompleteBusinessStep =
    business.legalBusinessName.trim().length > 0 &&
    business.businessType.length > 0 &&
    business.businessRegistrationNumber.trim().length > 0 &&
    business.taxIdentificationNumber.trim().length > 0 &&
    business.registeredAddress.trim().length > 0 &&
    business.city.trim().length > 0 &&
    business.state.trim().length > 0 &&
    business.phone.trim().length > 0 &&
    isValidWebsite(business.website) &&
    business.industry.length > 0 &&
    business.businessRegistrationCertificateFileName.length > 0 &&
    business.businessProofOfAddressFileName.length > 0;

  const hasCompleteIdentityStep =
    isKybOwnerComplete(identity.primary) &&
    (!identity.additional || isKybOwnerComplete(identity.additional));

  const routingDigits = settlement.routingNumber.replace(/\D/g, "");
  const accountDigits = settlement.accountNumber.replace(/\D/g, "");
  const hasCompleteSettlementStep =
    settlement.bankName.trim().length > 1 &&
    settlement.accountType.length > 0 &&
    accountDigits.length >= 8 &&
    routingDigits.length === 9;

  const canSubmitApplication =
    hasCompleteBusinessStep && hasCompleteIdentityStep && hasCompleteSettlementStep;

  function handleSubmit() {
    if (!canSubmitApplication) return;
    resetAll();
    router.push("/dashboard/kyb/submitted");
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
          <FieldRow label="Registration number" value={business.businessRegistrationNumber} />
          <FieldRow label="Tax identification number" value={business.taxIdentificationNumber} />
          <FieldRow label="Registered address" value={registeredAddressLine} />
          <FieldRow label="Phone number" value={formatPhoneDisplay(business.phone.replace(/\D/g, ""))} />
          <FieldRow label="Website" value={business.website} />
          {business.industry ? <FieldRow label="Business category" value={business.industry} /> : null}
          {business.businessRegistrationCertificateFileName ? (
            <FieldRow
              label="Business registration certificate"
              value={`${business.businessRegistrationCertificateFileName}${business.businessRegistrationCertificateFileSize ? ` · ${business.businessRegistrationCertificateFileSize}` : ""}`}
            />
          ) : null}
          {business.businessProofOfAddressFileName ? (
            <FieldRow
              label="Business proof of address"
              value={`${business.businessProofOfAddressFileName}${business.businessProofOfAddressFileSize ? ` · ${business.businessProofOfAddressFileSize}` : ""}`}
            />
          ) : null}
        </ReviewBlock>

        <ReviewBlock title="Owner / director identity" icon={User} editHref="/dashboard/kyb/identity">
          <OwnerReviewFields owner={identity.primary} heading="Primary owner / director" />
          {identity.additional ? (
            <div className="border-t border-gray-200 pt-4">
              <OwnerReviewFields owner={identity.additional} heading="Additional owner / director" />
            </div>
          ) : null}
        </ReviewBlock>

        <ReviewBlock title="Settlement details" icon={CreditCard} editHref="/dashboard/kyb/settlement">
          <FieldRow label="Bank name" value={settlement.bankName} />
          <FieldRow label="Account type" value={settlement.accountType} />
          <FieldRow label="Account number" value={maskAccountNumber(settlement.accountNumber)} />
          <FieldRow label="Routing number" value={settlement.routingNumber} />
        </ReviewBlock>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/kyb/settlement"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 no-underline hover:text-slate-900"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Link>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmitApplication}
          className="h-11 min-w-[12rem] rounded-lg border-0 bg-[var(--primary)] px-6 text-sm font-semibold text-white shadow-sm hover:brightness-105 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
        >
          Submit application
          <ArrowRight className="ml-2 inline size-4 align-middle" aria-hidden />
        </Button>
      </div>
    </section>
  );
}

export { KybReviewContent };
