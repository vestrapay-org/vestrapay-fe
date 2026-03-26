"use client";

import { CreditCard, Building2, ArrowRightLeft, Hash, QrCode } from "lucide-react";
import type { SVGIconProps } from "@/lib/types";

const active = "text-primary";
const inactive = "text-[#9ca3af]";

export function CardIcon({ className, active: isActive = false }: SVGIconProps): React.ReactNode {
  return (
    <CreditCard className={`${className} ${isActive ? active : inactive}`} strokeWidth={1.5} />
  );
}

export function BankIcon({ className, active: isActive = false }: SVGIconProps): React.ReactNode {
  return <Building2 className={`${className} ${isActive ? active : inactive}`} strokeWidth={1.5} />;
}

export function TransferIcon({
  className,
  active: isActive = false,
}: SVGIconProps): React.ReactNode {
  return (
    <ArrowRightLeft className={`${className} ${isActive ? active : inactive}`} strokeWidth={1.5} />
  );
}

export function USSDIcon({ className, active: isActive = false }: SVGIconProps): React.ReactNode {
  return <Hash className={`${className} ${isActive ? active : inactive}`} strokeWidth={1.5} />;
}

export function QRIcon({ className, active: isActive = false }: SVGIconProps): React.ReactNode {
  return <QrCode className={`${className} ${isActive ? active : inactive}`} strokeWidth={1.5} />;
}
