import React from "react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FloatingInputProps = {
  id: string;
  name?: string;
  label: string;
  type?: string;
  rightSlot?: React.ReactNode;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

export function FloatingInput({
  id,
  name,
  label,
  type = "text",
  rightSlot,
  value,
  onChange,
}: FloatingInputProps) {
  return (
    <div className="group relative">
      <Input
        id={id}
        name={name ?? id}
        type={type}
        placeholder=" "
        required
        {...(typeof value === "string" ? { value, onChange } : {})}
        className="peer h-14 w-full rounded-2xl border border-[#c5c1d5] bg-[#f8f7fc] px-4 text-base font-medium text-[#322a4e] transition-all duration-300 ease-out outline-none placeholder:text-transparent focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:color-mix(in_oklch,var(--primary)_18%,transparent)]"
      />
      <Label
        htmlFor={id}
        className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded px-1 text-xs font-medium text-[#8f88a6] transition-all duration-300 ease-out will-change-transform peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-90 peer-focus:bg-[#f8f7fc] peer-focus:text-[color:var(--primary)] peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-1/2 peer-[&:not(:placeholder-shown)]:scale-90 peer-[&:not(:placeholder-shown)]:bg-[#f8f7fc] peer-[&:not(:placeholder-shown)]:text-[color:var(--primary)]"
      >
        {label}
      </Label>
      {rightSlot}
    </div>
  );
}
