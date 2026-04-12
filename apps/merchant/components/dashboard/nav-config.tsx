import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  Key,
  LayoutDashboard,
  List,
  Settings,
  UserCheck,
  Webhook,
} from "lucide-react";

type DashboardNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/transactions", label: "Transactions", icon: List },
  { href: "/dashboard/payment-initializer", label: "Payment Initializer", icon: CreditCard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/dashboard/kyb", label: "KYB verification", icon: UserCheck },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function getDashboardPageTitle(pathname: string): string {
  if (pathname === "/dashboard/kyb" || pathname.startsWith("/dashboard/kyb/")) {
    return "KYB verification";
  }

  let best: DashboardNavItem | null = null;
  for (const item of DASHBOARD_NAV_ITEMS) {
    const exact = pathname === item.href;
    const nested = pathname.startsWith(`${item.href}/`);
    if (!exact && !nested) continue;
    if (!best || item.href.length > best.href.length) {
      best = item;
    }
  }
  return best?.label ?? "Dashboard";
}

export { DASHBOARD_NAV_ITEMS, getDashboardPageTitle };
export type { DashboardNavItem };
