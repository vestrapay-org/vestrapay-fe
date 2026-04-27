"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Check, ShoppingBag, Upload, UserPen, X } from "lucide-react";
import { format } from "date-fns";
import React from "react";

import { FloatingSelect, type FloatingSelectOption } from "../commons/floating-select";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const easing = [0.22, 1, 0.36, 1] as const;

type PaymentAmountMode = "fixed" | "customer-enters";
type PaymentFeeBearer = "merchant" | "customer";

type CreatePaymentLinkModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: {
    title: string;
    description: string;
    amountMode: PaymentAmountMode;
    currency: "NGN";
    amount: string;
    feeBearer: PaymentFeeBearer;
    brandingFileName: string | null;
  }) => void;
};

const DEPOSIT_ACCOUNT_OPTIONS: FloatingSelectOption[] = [
  { label: "Primary Wallet (Main)", value: "primary-wallet-main" },
];

export function CreatePaymentLinkModal({ open, onClose, onSubmit }: CreatePaymentLinkModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amountMode, setAmountMode] = React.useState<PaymentAmountMode>("fixed");
  const [currency, setCurrency] = React.useState<"NGN">("NGN");
  const [amount, setAmount] = React.useState("");
  const [feeBearer, setFeeBearer] = React.useState<PaymentFeeBearer>("customer");
  const [brandingFileName, setBrandingFileName] = React.useState<string | null>(null);
  const [depositAccount, setDepositAccount] = React.useState("primary-wallet-main");
  const [expiryEnabled, setExpiryEnabled] = React.useState(true);
  const [expiryDate, setExpiryDate] = React.useState<Date | undefined>();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setAmountMode("fixed");
      setCurrency("NGN");
      setAmount("");
      setFeeBearer("customer");
      setBrandingFileName(null);
      setDepositAccount("primary-wallet-main");
      setExpiryEnabled(true);
      setExpiryDate(undefined);
    }
  }, [open]);

  const titleValid = title.trim().length >= 3;
  const amountValid = amountMode === "customer-enters" || Number(amount || "0") > 0;
  const submitDisabled = !titleValid || !amountValid;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBrandingFileName(file.name);
  };

  const amountCardKeyDown =
    (mode: PaymentAmountMode) => (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setAmountMode(mode);
      }
    };

  const handleSubmit = () => {
    if (submitDisabled) return;
    onSubmit?.({
      title: title.trim(),
      description: description.trim(),
      amountMode,
      currency,
      amount: amount.trim(),
      feeBearer,
      brandingFileName,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-payment-link-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: easing }}
        >
          <motion.button
            type="button"
            aria-label="Close create payment link modal"
            className="absolute inset-0 border-0 bg-[radial-gradient(circle_at_top,_rgba(52,47,113,0.72),_rgba(17,24,39,0.76))] backdrop-blur-[2px]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />

          <motion.div
            className="relative z-[1] flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-[0_30px_60px_-28px_rgba(15,23,42,0.45)]"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.24, ease: easing }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-5 sm:px-7 sm:py-6">
              <h2
                id="create-payment-link-title"
                className="m-0 text-[24px] leading-none font-semibold tracking-tight text-[#0C0644]"
              >
                Create Payment Link
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-10 items-center justify-center rounded-xl border-0 bg-transparent text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#4B5563]"
                aria-label="Close"
              >
                <X className="size-6" strokeWidth={2} />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              <section className="space-y-4">
                <p className="m-0 pb-4 text-[13px] font-bold text-[#111827] uppercase">
                  Link Details
                </p>
                <div>
                  <label
                    htmlFor="payment-link-title"
                    className="text-[12px] font-bold tracking-[0.09em] text-[#111827] uppercase"
                  >
                    Link Title
                  </label>
                  <input
                    id="payment-link-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Sneaker Drop Sale"
                    className="mt-2 h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="payment-link-description"
                    className="text-[11px] font-bold tracking-[0.09em] text-[#111827] uppercase"
                  >
                    Description
                  </label>
                  <textarea
                    id="payment-link-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Tell your customers what they're paying for..."
                    className="mt-2 h-24 w-full resize-none rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold tracking-[0.09em] text-[#111827] uppercase">
                      Logo / Branding Image
                    </label>
                    <span className="text-[11px] font-medium text-[#9CA3AF]">(optional)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 flex h-[130px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#D1D5DB] bg-[#FCFCFD] px-4 text-center transition-colors hover:bg-[#F9FAFB]"
                  >
                    <Upload className="size-5 text-[#6B7280]" />
                    <p className="m-0 mt-2 text-xs font-semibold text-[#0C0644]">
                      Click to upload{" "}
                      <span className="font-medium text-[#6B7280]">or drag and drop</span>
                    </p>
                    <p className="m-0 mt-1 text-[12px] font-semibold text-[#9CA3AF] uppercase">
                      SVG, PNG, JPG (MAX. 300x400px)
                    </p>
                    {brandingFileName ? (
                      <p className="m-0 mt-2 text-sm font-semibold text-[#0C0644]">
                        {brandingFileName}
                      </p>
                    ) : null}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <p className="text-[11px] font-bold tracking-[0.09em] text-[#111827] uppercase">
                  Amount
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={amountMode === "fixed"}
                    onClick={() => setAmountMode("fixed")}
                    onKeyDown={amountCardKeyDown("fixed")}
                    className={`flex h-[106px] cursor-pointer flex-col justify-between rounded-xl border px-4 py-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0C0644]/25 ${
                      amountMode === "fixed"
                        ? "border-[#0C0644] bg-white ring-2 ring-[#0C0644]/10"
                        : "border-[#E5E7EB] bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Checkbox
                        checked={amountMode === "fixed"}
                        onCheckedChange={(value) => {
                          if (value === true) setAmountMode("fixed");
                          else setAmountMode("fixed");
                        }}
                        onClick={(event) => event.stopPropagation()}
                        aria-label="Fixed amount"
                        className="self-start"
                      />
                      <ShoppingBag className="size-5 text-[#6B7280]" />
                    </div>

                    <div>
                      <p className="m-0 pt-1.5 font-semibold text-[#0C0644]">Fixed Amount</p>
                      <p className="m-0 mt-1 text-xs text-[#6B7280]">
                        Set a specific price for all customers.
                      </p>
                    </div>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={amountMode === "customer-enters"}
                    onClick={() => setAmountMode("customer-enters")}
                    onKeyDown={amountCardKeyDown("customer-enters")}
                    className={`flex h-[106px] cursor-pointer flex-col justify-between rounded-xl border px-4 py-3 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0C0644]/25 ${
                      amountMode === "customer-enters"
                        ? "border-[#0C0644] bg-white ring-2 ring-[#0C0644]/10"
                        : "border-[#E5E7EB] bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Checkbox
                        checked={amountMode === "customer-enters"}
                        onCheckedChange={(value) => {
                          if (value === true) setAmountMode("customer-enters");
                          else setAmountMode("customer-enters");
                        }}
                        onClick={(event) => event.stopPropagation()}
                        aria-label="Customer enters"
                        className="self-start"
                      />
                      <UserPen className="size-5 text-[#6B7280]" />
                    </div>

                    <div>
                      <p className="m-0 pt-1.5 font-semibold text-[#0C0644]">Customer Enters</p>
                      <p className="m-0 mt-1 text-xs text-[#6B7280]">
                        Allow customers to decide the pay amount.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[130px_minmax(0,1fr)]">
                  <div>
                    <label className="text-[12px] font-bold tracking-[0.09em] text-[#111827] uppercase">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(event) => setCurrency(event.target.value as "NGN")}
                      className="mt-2 h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-sm font-semibold text-[#111827] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none"
                    >
                      <option value="NGN">NGN</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[12px] font-bold tracking-[0.09em] text-[#111827] uppercase">
                      Amount
                    </label>
                    <div className="relative mt-2">
                      <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-xl font-semibold text-[#6B7280]">
                        ₦
                      </span>
                      <input
                        value={amount}
                        onChange={(event) => {
                          const sanitized = event.target.value.replace(/[^\d.]/g, "");
                          setAmount(sanitized);
                        }}
                        disabled={amountMode === "customer-enters"}
                        placeholder="0.00"
                        inputMode="decimal"
                        className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] pr-4 pl-10 text-sm text-[#111827] placeholder:text-[#D1D5DB] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4 pb-2">
                <p className="m-0 pb-4 text-[13px] font-bold text-[#111827] uppercase">
                  Fee Configuration
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setFeeBearer("merchant")}
                    className={`flex min-h-[146px] flex-col items-start rounded-xl border px-5 py-5 text-left transition-colors ${
                      feeBearer === "merchant"
                        ? "border-[2px] border-[#0C0644] bg-white"
                        : "border-[#E5E7EB] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex size-[20px] items-center justify-center rounded-full border ${
                          feeBearer === "merchant"
                            ? "border-[#0C0644] bg-[#0C0644] text-white"
                            : "border-[3px] border-[#ECECF3] bg-white text-transparent"
                        }`}
                      >
                        <Check className="size-4 stroke-[3]" />
                      </span>
                      <p className="m-0 leading-none font-semibold text-[#111827]">
                        Merchant Bears
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="m-0 text-xs leading-[1.45] font-medium text-[#5B5E6E]">
                        You pay the transaction fee. Customer pays exactly the amount set above.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeeBearer("customer")}
                    className={`flex min-h-[146px] flex-col items-start rounded-xl border px-5 py-5 text-left transition-colors ${
                      feeBearer === "customer"
                        ? "border-[2px] border-[#0C0644] bg-white"
                        : "border-[#E5E7EB] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex size-[20px] items-center justify-center rounded-full border ${
                          feeBearer === "customer"
                            ? "border-[#0C0644] bg-[#0C0644] text-white"
                            : "border-[3px] border-[#ECECF3] bg-white text-transparent"
                        }`}
                      >
                        <Check className="size-4 stroke-[3]" />
                      </span>
                      <p className="m-0 leading-none font-semibold text-[#111827]">
                        Customer Bears
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="m-0 text-xs leading-[1.45] font-medium text-[#5B5E6E]">
                        The transaction fee is added to the total at checkout. You receive the full
                        amount.
                      </p>
                    </div>
                  </button>
                </div>
              </section>

              <section className="space-y-4">
                <p className="m-0 pb-4 text-[13px] leading-[0.09em] font-bold text-[#111827] uppercase">
                  Account Mapping
                </p>

                <div className="pt-2">
                  <FloatingSelect
                    id="payment-link-deposit-account"
                    name="depositAccount"
                    label="Deposit Into Account"
                    placeholder="Select account"
                    options={DEPOSIT_ACCOUNT_OPTIONS}
                    value={depositAccount}
                    onValueChange={setDepositAccount}
                    required={false}
                    triggerClassName="mt-1 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] text-base font-medium text-[#0C0644] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15"
                    contentClassName="rounded-xl border-[#E5E7EB]"
                  />
                </div>
              </section>

              <section className="space-y-4 pb-1">
                <div className="flex items-center justify-between">
                  <p className="m-0 text-[13px] font-bold tracking-[0.03em] text-[#374151] uppercase">
                    Expiry Date
                  </p>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={expiryEnabled}
                    onClick={() => setExpiryEnabled((prev) => !prev)}
                    className={`relative inline-flex h-7 w-[50px] items-center rounded-full transition-colors ${
                      expiryEnabled ? "bg-[#0C0644]" : "bg-[#D1D5DB]"
                    }`}
                  >
                    <span
                      className={`inline-block size-4 rounded-full bg-white transition-transform ${
                        expiryEnabled ? "translate-x-[26px]" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      disabled={!expiryEnabled}
                      className="relative h-14 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] pr-11 pl-12 text-left text-sm font-medium text-[#0C0644] focus:border-[#0C0644] focus:ring-2 focus:ring-[#0C0644]/15 focus:outline-none disabled:cursor-not-allowed disabled:opacity-80"
                    >
                      <CalendarDays className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-[#D1D5DB]" />
                      {expiryDate ? (
                        <span>{format(expiryDate, "dd/MM/yyyy")}</span>
                      ) : (
                        <span className="text-[#D1D5DB]">dd/mm/yyyy</span>
                      )}
                      <CalendarDays className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[#111827]" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </section>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-[#E5E7EB] bg-white px-5 py-4 sm:grid-cols-2 sm:px-7 sm:py-5">
              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-xl border border-transparent bg-transparent text-base font-semibold text-[#6B7280] transition-colors hover:bg-[#F3F4F6]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitDisabled}
                className="inline-flex h-12 items-center justify-center rounded-xl border-0 bg-[#0C0644] px-5 text-base font-semibold text-white shadow-[0_12px_20px_-12px_rgba(12,6,68,0.8)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Create Payment Link
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
