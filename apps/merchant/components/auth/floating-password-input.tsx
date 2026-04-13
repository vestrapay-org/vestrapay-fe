"use client";

import React, { useMemo, useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react";

import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type PasswordChecks = {
  minLength: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
};

export function checkPasswordRequirements(password: string): PasswordChecks {
  return {
    minLength: password.length > 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function PasswordRequirementsList({ checks }: { checks: PasswordChecks }) {
  const items: { key: keyof PasswordChecks; label: string }[] = [
    { key: "minLength", label: "More than 8 characters" },
    { key: "uppercase", label: "One uppercase letter" },
    { key: "lowercase", label: "One lowercase letter" },
    { key: "number", label: "One number" },
    { key: "special", label: "One special character" },
  ];

  return (
    <ul className="mt-2 grid gap-1.5 pl-0">
      {items.map(({ key, label }) => {
        const met = checks[key];
        return (
          <li
            key={key}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors duration-200",
              met ? "text-emerald-600" : "text-[#8f88a6]",
            )}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded-full border text-[0.65rem] transition-colors duration-200",
                met
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600"
                  : "border-[#d9d4e8] bg-[#f8f7fc] text-[#b5aec9]",
              )}
              aria-hidden
            >
              {met ? <Check className="size-3" strokeWidth={2.5} /> : null}
            </span>
            {label}
          </li>
        );
      })}
    </ul>
  );
}

function FloatingPasswordInput({
  id,
  label,
  showRequirements = false,
  minLength = 9,
  value: valueProp,
  onChange: onChangeProp,
}: {
  id: string;
  label: string;
  showRequirements?: boolean;
  /** Minimum length for native validation (>8 means 9+). */
  minLength?: number;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const [visible, setVisible] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : internalValue;
  const checks = useMemo(() => checkPasswordRequirements(value), [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (controlled) onChangeProp?.(e);
    else setInternalValue(e.target.value);
  }

  return (
    <div className="w-full">
      <div className="group relative">
        <Input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          placeholder=" "
          required
          minLength={minLength}
          autoComplete="new-password"
          value={value}
          onChange={handleChange}
          className="peer h-14 w-full rounded-2xl border border-[#c5c1d5] bg-[#f8f7fc] px-4 pr-12 text-base font-medium text-[#322a4e] outline-none transition-all duration-300 ease-out placeholder:text-transparent focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:color-mix(in_oklch,var(--primary)_18%,transparent)]"
        />
        <Label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded px-1 text-base font-medium text-[#8f88a6] transition-all duration-300 ease-out will-change-transform peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-90 peer-focus:bg-[#f8f7fc] peer-focus:text-[color:var(--primary)] peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-1/2 peer-[&:not(:placeholder-shown)]:scale-90 peer-[&:not(:placeholder-shown)]:bg-[#f8f7fc] peer-[&:not(:placeholder-shown)]:text-[color:var(--primary)]"
        >
          {label}
        </Label>
        <button
          type="button"
          className="absolute top-1/2 right-3 z-20 -translate-y-1/2 cursor-pointer rounded-md border-0 bg-transparent p-1.5 text-[#8b84a2] transition-colors hover:text-[#322a4e] focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:outline-none"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="size-[1.125rem]" aria-hidden /> : <Eye className="size-[1.125rem]" aria-hidden />}
        </button>
      </div>
      {showRequirements ? <PasswordRequirementsList checks={checks} /> : null}
    </div>
  );
}

export { FloatingPasswordInput };
