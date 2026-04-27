import React from "react";

import { cn } from "../../lib/utils";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export type FloatingSelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type FloatingSelectProps<TOption = FloatingSelectOption> = {
  id?: string;
  name?: string | null;
  label?: string;
  placeholder?: string;
  options: TOption[];
  getOptionLabel?: (option: TOption) => string;
  getOptionValue?: (option: TOption) => string;
  getOptionDisabled?: (option: TOption) => boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  triggerClassName?: string;
  contentClassName?: string;
};

function deriveOptionLabel<TOption>(
  option: TOption,
  getOptionLabel?: (option: TOption) => string,
  fallbackIndex?: number,
) {
  if (getOptionLabel) return getOptionLabel(option);
  if (typeof option === "string" || typeof option === "number") return String(option);
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    if (typeof record.label === "string") {
      return record.label;
    }
  }
  return `Option ${typeof fallbackIndex === "number" ? fallbackIndex + 1 : ""}`.trim();
}

function deriveOptionValue<TOption>(
  option: TOption,
  getOptionValue?: (option: TOption) => string,
  fallbackIndex?: number,
) {
  if (getOptionValue) return getOptionValue(option);
  if (typeof option === "string" || typeof option === "number") return String(option);
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    if (typeof record.value !== "undefined") {
      return String(record.value);
    }
  }
  return `option-${fallbackIndex ?? 0}`;
}

function deriveOptionDisabled<TOption>(
  option: TOption,
  getOptionDisabled?: (option: TOption) => boolean,
) {
  if (getOptionDisabled) return getOptionDisabled(option);
  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    if (typeof record.disabled === "boolean") {
      return record.disabled;
    }
  }
  return false;
}

export function FloatingSelect<TOption = FloatingSelectOption>({
  id = "select",
  name = "select",
  label,
  placeholder = "Select an option",
  options,
  getOptionLabel,
  getOptionValue,
  getOptionDisabled,
  value,
  defaultValue,
  onValueChange,
  required = true,
  disabled = false,
  triggerClassName,
  contentClassName,
}: FloatingSelectProps<TOption>) {
  const isControlled = typeof value === "string";
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const currentValue = isControlled ? value : internalValue;

  React.useEffect(() => {
    if (isControlled) return;
    setInternalValue(defaultValue ?? "");
  }, [defaultValue, isControlled]);

  const normalizedOptions = React.useMemo(
    () =>
      options.map((option, index) => ({
        label: deriveOptionLabel(option, getOptionLabel, index),
        value: deriveOptionValue(option, getOptionValue, index),
        disabled: deriveOptionDisabled(option, getOptionDisabled),
      })),
    [options, getOptionDisabled, getOptionLabel, getOptionValue],
  );

  const handleValueChange = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  return (
    <div className="group relative">
      {name ? <input type="hidden" id={id} name={name} value={currentValue} required={required} /> : null}
      {label ? (
        <Label
          htmlFor={id}
          className="pointer-events-none absolute top-0 left-4 z-10 -translate-y-1/2 rounded bg-[#f8f7fc] px-1 text-xs font-semibold text-[color:var(--primary)]"
        >
          {label}
        </Label>
      ) : null}
      <Select
        value={currentValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn(
            "h-14 w-full rounded-2xl border border-[#c5c1d5] bg-[#f8f7fc] px-4 text-base font-medium text-[#322a4e] transition-all duration-300 ease-out",
            "focus:border-[color:var(--primary)] focus:ring-4 focus:ring-[color:color-mix(in_oklch,var(--primary)_18%,transparent)]",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={cn("max-h-[280px] rounded-xl border border-[#d7d3e4] bg-white text-[#322a4e]", contentClassName)}
        >
          {normalizedOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
