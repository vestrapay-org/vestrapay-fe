"use client";

import type { SVGIconProps } from "@/lib/types";

export function CardIcon({ className, active: isActive = false }: SVGIconProps): React.ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="2" y="4" width="20" height="16" rx="3" fill={isActive ? "#4f46e5" : "#e5e7eb"} />
      <rect x="2" y="8" width="20" height="3" fill={isActive ? "#3730a3" : "#d1d5db"} />
      <rect x="5" y="14" width="6" height="2" rx="1" fill={isActive ? "#c7d2fe" : "#f3f4f6"} />
      <rect x="13" y="14" width="4" height="2" rx="1" fill={isActive ? "#c7d2fe" : "#f3f4f6"} />
    </svg>
  );
}

export function BankIcon({ className, active: isActive = false }: SVGIconProps): React.ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 2L3 7h18L12 2z" fill={isActive ? "#4f46e5" : "#d1d5db"} />
      <rect x="4" y="8" width="16" height="1.5" rx="0.5" fill={isActive ? "#6366f1" : "#e5e7eb"} />
      <rect x="5" y="11" width="2" height="6" rx="0.5" fill={isActive ? "#818cf8" : "#e5e7eb"} />
      <rect x="9" y="11" width="2" height="6" rx="0.5" fill={isActive ? "#818cf8" : "#e5e7eb"} />
      <rect x="13" y="11" width="2" height="6" rx="0.5" fill={isActive ? "#818cf8" : "#e5e7eb"} />
      <rect x="17" y="11" width="2" height="6" rx="0.5" fill={isActive ? "#818cf8" : "#e5e7eb"} />
      <rect x="3" y="18" width="18" height="2" rx="0.5" fill={isActive ? "#4f46e5" : "#d1d5db"} />
    </svg>
  );
}

export function TransferIcon({ className, active: isActive = false }: SVGIconProps): React.ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="2" y="3" width="20" height="18" rx="3" fill={isActive ? "#e0e7ff" : "#f3f4f6"} />
      <path d="M7 10h6l-2-2M17 14h-6l2 2" stroke={isActive ? "#4f46e5" : "#9ca3af"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function USSDIcon({ className, active: isActive = false }: SVGIconProps): React.ReactNode {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="5" y="2" width="14" height="20" rx="3" fill={isActive ? "#e0e7ff" : "#f3f4f6"} />
      <rect x="7" y="4" width="10" height="12" rx="1" fill={isActive ? "#4f46e5" : "#d1d5db"} />
      <text x="12" y="12" textAnchor="middle" fontSize="6" fontWeight="bold" fill={isActive ? "#e0e7ff" : "#f9fafb"}>*#</text>
      <circle cx="12" cy="19" r="1.2" fill={isActive ? "#6366f1" : "#d1d5db"} />
    </svg>
  );
}

export function QRIcon({ className, active: isActive = false }: SVGIconProps): React.ReactNode {
  const fg = isActive ? "#4f46e5" : "#d1d5db";
  const bg = isActive ? "#e0e7ff" : "#f3f4f6";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="3" fill={bg} />
      <rect x="5" y="5" width="5" height="5" rx="1" fill={fg} />
      <rect x="6" y="6" width="3" height="3" rx="0.5" fill={bg} />
      <rect x="14" y="5" width="5" height="5" rx="1" fill={fg} />
      <rect x="15" y="6" width="3" height="3" rx="0.5" fill={bg} />
      <rect x="5" y="14" width="5" height="5" rx="1" fill={fg} />
      <rect x="6" y="15" width="3" height="3" rx="0.5" fill={bg} />
      <rect x="14" y="14" width="2" height="2" rx="0.5" fill={fg} />
      <rect x="17" y="14" width="2" height="2" rx="0.5" fill={fg} />
      <rect x="14" y="17" width="2" height="2" rx="0.5" fill={fg} />
      <rect x="17" y="17" width="2" height="2" rx="0.5" fill={fg} />
    </svg>
  );
}
