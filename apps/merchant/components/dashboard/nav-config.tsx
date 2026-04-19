import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  Link2,
  Receipt,
  Settings,
  UserCheck,
} from "lucide-react";

type DashboardNavLink = {
  type: "link";
  href: string;
  label: string;
  icon: LucideIcon;
};

type DashboardNavChild = {
  href: string;
  label: string;
};

type DashboardNavGroup = {
  type: "group";
  id: string;
  label: string;
  icon: LucideIcon;
  children: DashboardNavChild[];
};

type DashboardNavEntry = DashboardNavLink | DashboardNavGroup;

export const DASHBOARD_NAV_ENTRIES: DashboardNavEntry[] = [
  { type: "link", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    type: "group",
    id: "transactions",
    label: "Transactions",
    icon: Receipt,
    children: [
      { href: "/dashboard/transactions", label: "Collections" },
      { href: "/dashboard/transactions/transfers", label: "Transfers / Payouts" },
    ],
  },
  { type: "link", href: "/dashboard/accounts", label: "Accounts", icon: Building2 },
  { type: "link", href: "/dashboard/payment-links", label: "Payment Links", icon: Link2 },
  { type: "link", href: "/dashboard/payment-initializer", label: "Payment Initializer", icon: CreditCard },
  { type: "link", href: "/dashboard/kyb", label: "KYB verification", icon: UserCheck },
  {
    type: "group",
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      { href: "/dashboard/api-keys", label: "API keys" },
      { href: "/dashboard/settings/profile", label: "Profile" },
      { href: "/dashboard/webhooks", label: "Webhooks" },
      { href: "/dashboard/settings/security", label: "Security" },
    ],
  },
];

export function getActiveChildHref(pathname: string, children: DashboardNavChild[]): string | null {
  const sorted = [...children].sort((a, b) => b.href.length - a.href.length);
  for (const child of sorted) {
    if (pathname === child.href || pathname.startsWith(`${child.href}/`)) {
      return child.href;
    }
  }
  return null;
}

function flattenNavLabels(): { href: string; label: string }[] {
  const out: { href: string; label: string }[] = [];
  for (const entry of DASHBOARD_NAV_ENTRIES) {
    if (entry.type === "link") {
      out.push({ href: entry.href, label: entry.label });
    } else {
      for (const child of entry.children) {
        out.push({ href: child.href, label: child.label });
      }
    }
  }
  return out;
}

export function getDashboardPageTitle(pathname: string): string {
  if (pathname === "/dashboard/kyb" || pathname.startsWith("/dashboard/kyb/")) {
    return "KYB verification";
  }

  const flat = flattenNavLabels();
  let best: { href: string; label: string } | null = null;
  for (const item of flat) {
    const exact = pathname === item.href;
    const nested = pathname.startsWith(`${item.href}/`);
    if (!exact && !nested) continue;
    if (!best || item.href.length > best.href.length) {
      best = item;
    }
  }
  return best?.label ?? "Dashboard";
}

export type { DashboardNavChild, DashboardNavEntry, DashboardNavGroup, DashboardNavLink };
