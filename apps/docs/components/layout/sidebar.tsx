"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

const BADGE_STYLES = {
  new: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  beta: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  deprecated: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
};

const RESOURCE_LINKS = [
  { title: "API Status", href: "#" },
  { title: "GitHub", href: "#", external: true },
  { title: "Support", href: "#" },
  { title: "Dashboard", href: "https://vestrapay.com", external: true },
];

export function Sidebar({
  onNavClick,
}: {
  onNavClick?: () => void;
}): React.ReactNode {
  const pathname = usePathname();

  return (
    <nav className="py-6 pr-4 pl-4">
      {navigation.map((group) => (
        <div key={group.title} className="mb-6">
          {group.href ? (
            <Link
              href={group.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors duration-150",
                pathname === group.href
                  ? "bg-primary/[0.06] text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {group.title}
            </Link>
          ) : (
            <>
              <p className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/35">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items?.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavClick}
                        className={cn(
                          "flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] transition-all duration-150",
                          isActive
                            ? "bg-primary/[0.06] font-medium text-primary"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span>{item.title}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                              BADGE_STYLES[item.badge],
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      ))}

      <div className="mt-6 border-t border-border pt-5">
        <p className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/35">
          Resources
        </p>
        <ul className="space-y-0.5">
          {RESOURCE_LINKS.map((link) => (
            <li key={link.title}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                <span>{link.title}</span>
                {link.external && (
                  <ExternalLink className="size-3 text-border" />
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
