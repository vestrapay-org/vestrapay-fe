import React from "react";
import { ChevronDown } from "lucide-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

type CountryOption = { code: string; name: string };

const fallbackCountryCodes = ["NG", "US", "GB", "CA", "DE", "FR", "IN", "KE", "ZA", "GH"];

const countryOptions: CountryOption[] = (() => {
  const supportedValuesOf = Intl.supportedValuesOf as unknown as
    | ((key: string) => string[])
    | undefined;
  let regionCodes = fallbackCountryCodes;
  if (typeof supportedValuesOf === "function") {
    try {
      regionCodes = supportedValuesOf("region").filter((code) => code.length === 2);
    } catch {
      regionCodes = fallbackCountryCodes;
    }
  }

  const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

  return regionCodes
    .map((code) => ({ code, name: displayNames.of(code) ?? code }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();

function FloatingInput({
  id,
  name,
  label,
  type = "text",
  rightSlot,
  value,
  onChange,
}: {
  id: string;
  name?: string;
  label: string;
  type?: string;
  rightSlot?: React.ReactNode;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
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
        className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded px-1 text-base font-medium text-[#8f88a6] transition-all duration-300 ease-out will-change-transform peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:scale-90 peer-focus:bg-[#f8f7fc] peer-focus:text-[color:var(--primary)] peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-1/2 peer-[&:not(:placeholder-shown)]:scale-90 peer-[&:not(:placeholder-shown)]:bg-[#f8f7fc] peer-[&:not(:placeholder-shown)]:text-[color:var(--primary)]"
      >
        {label}
      </Label>
      {rightSlot}
    </div>
  );
}

function FloatingCountrySelect() {
  return (
    <div className="group relative">
      <select
        id="country"
        name="country"
        defaultValue=""
        required
        className={cn(
          "peer h-14 w-full appearance-none rounded-2xl border border-[#c5c1d5] bg-[#f8f7fc] px-4 pr-10 text-base font-medium text-[#322a4e] transition-all duration-300 ease-out outline-none",
          "focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:color-mix(in_oklch,var(--primary)_18%,transparent)]",
        )}
      >
        <option value="" disabled hidden />
        {countryOptions.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
      <Label
        htmlFor="country"
        className="pointer-events-none absolute top-0 left-4 z-10 -translate-y-1/2 rounded bg-[#f8f7fc] px-1 text-xs font-semibold text-[color:var(--primary)] transition-all duration-300 ease-out peer-invalid:top-1/2 peer-invalid:-translate-y-1/2 peer-invalid:bg-transparent peer-invalid:text-base peer-invalid:font-medium peer-invalid:text-[#8f88a6] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-[#f8f7fc] peer-focus:text-xs peer-focus:font-semibold peer-focus:text-[color:var(--primary)]"
      >
        Country
      </Label>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-[#8b84a2]" />
    </div>
  );
}

export { FloatingCountrySelect, FloatingInput };
