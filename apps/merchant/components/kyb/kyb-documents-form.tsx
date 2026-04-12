"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { ArrowLeft, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatFileSize } from "./kyb-format";
import { useKybWizard } from "./kyb-wizard-context";

const labelClass =
  "mb-1.5 block text-[0.65rem] font-bold tracking-[0.1em] text-gray-500 uppercase";

const dropClass =
  "flex min-h-[7rem] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-6 text-center transition-colors hover:border-[var(--primary)] hover:bg-white";

function KybDocumentsForm() {
  const router = useRouter();
  const { documents, setDocuments } = useKybWizard();
  const canSubmit = useMemo(() => {
    return documents.certFileName.length > 0 && documents.passportFileName.length > 0;
  }, [documents.certFileName, documents.passportFileName]);

  function handleCertChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setDocuments((prev) => ({ ...prev, certFileName: "", certFileSize: "" }));
      return;
    }
    setDocuments((prev) => ({
      ...prev,
      certFileName: file.name,
      certFileSize: formatFileSize(file.size),
    }));
  }

  function handlePassportChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setDocuments((prev) => ({ ...prev, passportFileName: "", passportFileSize: "" }));
      return;
    }
    setDocuments((prev) => ({
      ...prev,
      passportFileName: file.name,
      passportFileSize: formatFileSize(file.size),
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    router.push("/dashboard/kyb/review");
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm md:p-8">
      <header className="mb-6">
        <h1 className="m-0 text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Documents</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[0.9375rem]">
          Upload incorporation proof and a valid government-issued ID for the legal representative.
        </p>
      </header>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div>
          <span className={labelClass}>Certificate of incorporation</span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
            className="sr-only"
            id="certFile"
            onChange={handleCertChange}
          />
          <label htmlFor="certFile" className={dropClass}>
            {documents.certFileName ? (
              <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <Check className="size-4 text-emerald-600" aria-hidden />
                {documents.certFileName}
                {documents.certFileSize ? (
                  <span className="font-normal text-gray-500">({documents.certFileSize})</span>
                ) : null}
              </span>
            ) : (
              <span className="text-sm text-gray-600">Click to upload PDF or image</span>
            )}
          </label>
        </div>

        <div>
          <span className={labelClass}>Passport or ID (front &amp; back)</span>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
            className="sr-only"
            id="passportFile"
            onChange={handlePassportChange}
          />
          <label htmlFor="passportFile" className={dropClass}>
            {documents.passportFileName ? (
              <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                <Check className="size-4 text-emerald-600" aria-hidden />
                {documents.passportFileName}
                {documents.passportFileSize ? (
                  <span className="font-normal text-gray-500">({documents.passportFileSize})</span>
                ) : null}
              </span>
            ) : (
              <span className="text-sm text-gray-600">Click to upload PDF or image</span>
            )}
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/dashboard/kyb/settlement"
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

export { KybDocumentsForm };
