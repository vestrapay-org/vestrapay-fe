"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@vestrapay/ui/lib/utils";

interface Country {
  code: string;
  name: string;
  flag: string;
  dial: string;
}

const COUNTRIES: Country[] = [
  { code: "NG", name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}", dial: "+234" },
  { code: "GH", name: "Ghana", flag: "\u{1F1EC}\u{1F1ED}", dial: "+233" },
  { code: "KE", name: "Kenya", flag: "\u{1F1F0}\u{1F1EA}", dial: "+254" },
  { code: "ZA", name: "South Africa", flag: "\u{1F1FF}\u{1F1E6}", dial: "+27" },
  { code: "EG", name: "Egypt", flag: "\u{1F1EA}\u{1F1EC}", dial: "+20" },
  { code: "TZ", name: "Tanzania", flag: "\u{1F1F9}\u{1F1FF}", dial: "+255" },
  { code: "UG", name: "Uganda", flag: "\u{1F1FA}\u{1F1EC}", dial: "+256" },
  { code: "RW", name: "Rwanda", flag: "\u{1F1F7}\u{1F1FC}", dial: "+250" },
  { code: "SN", name: "Senegal", flag: "\u{1F1F8}\u{1F1F3}", dial: "+221" },
  { code: "CI", name: "Ivory Coast", flag: "\u{1F1E8}\u{1F1EE}", dial: "+225" },
  { code: "CM", name: "Cameroon", flag: "\u{1F1E8}\u{1F1F2}", dial: "+237" },
  { code: "ET", name: "Ethiopia", flag: "\u{1F1EA}\u{1F1F9}", dial: "+251" },
  { code: "MA", name: "Morocco", flag: "\u{1F1F2}\u{1F1E6}", dial: "+212" },
  { code: "BJ", name: "Benin", flag: "\u{1F1E7}\u{1F1EF}", dial: "+229" },
  { code: "TG", name: "Togo", flag: "\u{1F1F9}\u{1F1EC}", dial: "+228" },
  { code: "GB", name: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}", dial: "+44" },
  { code: "US", name: "United States", flag: "\u{1F1FA}\u{1F1F8}", dial: "+1" },
];

function getCountry(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

function CountrySelect({
  className,
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<"select">, "children">) {
  const selected = getCountry((value as string) || "");

  return (
    <div className="relative w-full">
      {selected && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-base">
          {selected.flag}
        </span>
      )}
      <select
        data-slot="country-select"
        value={value}
        onChange={onChange}
        className={cn(
          "border-input bg-background text-foreground h-9 w-full appearance-none rounded-xl border py-1 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          selected ? "pl-10" : "pl-3",
          className,
        )}
        {...props}
      >
        <option value="">Select a country</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name}
          </option>
        ))}
      </select>
      <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2" />
    </div>
  );
}

export { CountrySelect, COUNTRIES, getCountry, type Country };
