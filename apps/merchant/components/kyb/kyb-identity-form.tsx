"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useKybWizard } from "./kyb-wizard-context";

const labelClass =
  "mb-1.5 block text-[0.65rem] font-bold tracking-[0.1em] text-gray-500 uppercase";

const inputClass =
  "h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-gray-400 focus-visible:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklch,var(--primary)_22%,transparent)]";

function sanitizeFullLegalName(value: string): string {
  return value.replace(/[^a-zA-Z0-9\s'.-]/g, "");
}

function sanitizeIdNumber(value: string): string {
  return value.replace(/[^a-zA-Z0-9-]/g, "");
}

function sanitizeNationality(value: string): string {
  return value.replace(/[^a-zA-Z\s-]/g, "");
}

function KybIdentityForm() {
  const router = useRouter();
  const { identity, setIdentity } = useKybWizard();

  const canSubmit = useMemo(() => {
    return (
      identity.fullLegalName.trim().length > 1 &&
      identity.dateOfBirth.length > 0 &&
      identity.nationality.trim().length > 1 &&
      identity.idNumber.trim().length >= 4
    );
  }, [identity]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    router.push("/dashboard/kyb/settlement");
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
      <header className="mb-6">
        <h1 className="m-0 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Identity verification</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[0.9375rem]">
          Provide the legal representative details used to verify your business.
        </p>
      </header>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullLegalName" className={labelClass}>
            Full legal name
          </label>
          <input
            id="fullLegalName"
            name="fullLegalName"
            required
            placeholder="e.g., Alexander J. Richardson"
            autoComplete="name"
            className={inputClass}
            value={identity.fullLegalName}
            onChange={(e) =>
              setIdentity((prev) => ({ ...prev, fullLegalName: sanitizeFullLegalName(e.target.value) }))
            }
          />
        </div>

        <div>
          <label htmlFor="dateOfBirth" className={labelClass}>
            Date of birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            className={inputClass}
            value={identity.dateOfBirth}
            onChange={(e) => setIdentity((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="nationality" className={labelClass}>
            Nationality
          </label>
          <input
            id="nationality"
            name="nationality"
            required
            placeholder="e.g., United States"
            autoComplete="country-name"
            className={inputClass}
            value={identity.nationality}
            onChange={(e) =>
              setIdentity((prev) => ({ ...prev, nationality: sanitizeNationality(e.target.value) }))
            }
          />
        </div>

        <div>
          <label htmlFor="idNumber" className={labelClass}>
            Government ID number
          </label>
          <input
            id="idNumber"
            name="idNumber"
            required
            placeholder="Passport or national ID"
            autoComplete="off"
            className={inputClass}
            value={identity.idNumber}
            onChange={(e) =>
              setIdentity((prev) => ({ ...prev, idNumber: sanitizeIdNumber(e.target.value) }))
            }
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/kyb"
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 no-underline hover:text-slate-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </Link>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="h-11 min-w-[10rem] rounded-lg border-0 bg-[var(--primary)] px-6 text-sm font-semibold text-white shadow-sm hover:brightness-105 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45"
          >
            Save &amp; continue
          </Button>
        </div>
      </form>
    </section>
  );
}

export { KybIdentityForm };
