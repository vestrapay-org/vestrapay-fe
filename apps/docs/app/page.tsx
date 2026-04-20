"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  Webhook,
  CreditCard,
  BookOpen,
  Code2,
  Terminal,
  Layers,
} from "lucide-react";
import { SearchDialog } from "@/components/search/search-dialog";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";

const QUICK_LINKS = [
  {
    icon: Zap,
    title: "Quick Start",
    description: "Make your first API call in under five minutes.",
    href: "/getting-started/quick-start",
  },
  {
    icon: Shield,
    title: "Authentication",
    description: "API keys, environments, and signature verification.",
    href: "/authentication",
  },
  {
    icon: CreditCard,
    title: "Payments API",
    description: "Card charges, bank transfers, and USSD payments.",
    href: "/api-reference/payments",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Receive real-time events for every transaction.",
    href: "/api-reference/webhooks",
  },
];

const API_SECTIONS = [
  {
    title: "Payments",
    href: "/api-reference/payments",
    desc: "Card charges, bank transfers, USSD",
  },
  {
    title: "SDK Integrations",
    href: "/api-reference/sdk",
    desc: "Mobile and web SDK endpoints",
  },
  {
    title: "Webhooks",
    href: "/api-reference/webhooks",
    desc: "Events and delivery",
  },
];

const GUIDES = [
  {
    title: "Accept Your First Payment",
    href: "/guides/accept-payments",
    tag: "Guide",
  },
  { title: "Handle Refunds", href: "/guides/handle-refunds", tag: "Guide" },
  {
    title: "Recurring Billing",
    href: "/guides/recurring-billing",
    tag: "Guide",
    badge: "New",
  },
  { title: "Error Reference", href: "/errors", tag: "Reference" },
  { title: "Changelog", href: "/changelog", tag: "Releases" },
];

export default function LandingPage(): React.ReactNode {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative isolate overflow-hidden pt-24 pb-20 md:pt-36 md:pb-28">
          <div className="pointer-events-none absolute inset-0 z-[-1] flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-[0.3] dark:opacity-[0.1]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--color-primary) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
                maskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 30%, black 50%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 70% 60% at 50% 30%, black 50%, transparent 100%)",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="text-foreground mb-8 text-5xl leading-[1.15] font-bold tracking-tight sm:text-6xl lg:text-[4rem]">
              Payment Infrastructure
              <br />
              <span className="text-primary relative mt-2 inline-block">
                <span className="absolute -inset-1 -z-10 rounded-md" />
                <span className="from-primary/0 via-primary to-primary/0 absolute bottom-0 left-0 w-full bg-linear-to-r opacity-80" />
                Built for Scale
              </span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-10 max-w-140 text-[16px] leading-relaxed">
              Accept cards, bank transfers, and USSD payments through a single, unified API.
              Designed for reliability at scale without the complexity.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/getting-started/quick-start"
                className="bg-primary text-primary-foreground shadow-primary/20 flex h-11 items-center gap-2 rounded-md px-6 text-[14px] font-medium shadow-md transition-all hover:scale-[1.02] hover:opacity-90"
              >
                Get started
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/api-reference/payments"
                className="border-border bg-card text-foreground hover:bg-muted/80 flex h-11 items-center gap-2 rounded-md border px-6 text-[14px] font-medium transition-all hover:scale-[1.02]"
              >
                <Code2 className="text-muted-foreground size-4" />
                API Reference
              </Link>
            </div>
          </div>
        </div>

        <section className="border-border border-t pt-14 pb-14">
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-muted flex size-7 items-center justify-center rounded-md">
              <Layers className="text-muted-foreground size-3.5" />
            </div>
            <h2 className="text-foreground text-sm font-semibold">Start here</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group border-border bg-card hover:bg-muted/30 flex flex-col justify-between rounded-md border p-5 transition-colors duration-150"
              >
                <div>
                  <div className="bg-muted mb-3 flex size-9 items-center justify-center rounded-md">
                    <item.icon className="text-foreground size-4" />
                  </div>
                  <p className="text-foreground mb-1 text-[13.5px] font-semibold">{item.title}</p>
                  <p className="text-muted-foreground text-[13px] leading-snug">
                    {item.description}
                  </p>
                </div>
                <ArrowRight className="text-muted-foreground mt-4 size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <div className="border-border grid gap-12 border-t pt-12 pb-14 md:grid-cols-2">
          <div>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Terminal className="text-muted-foreground size-4" />
                <h2 className="text-foreground text-sm font-semibold">API Reference</h2>
              </div>
              <Link
                href="/api-reference"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[12.5px] font-medium transition-colors"
              >
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="border-border overflow-hidden rounded-md border">
              {API_SECTIONS.map((s, i) => (
                <Link
                  key={s.href}
                  href={s.href}
                  className={cn(
                    "group hover:bg-muted/30 flex items-center justify-between px-4 py-3.5 transition-colors duration-150",
                    i !== API_SECTIONS.length - 1 && "border-border border-b",
                  )}
                >
                  <div>
                    <p className="text-foreground text-[13.5px] font-medium">{s.title}</p>
                    <p className="text-muted-foreground text-[12.5px]">{s.desc}</p>
                  </div>
                  <ArrowRight className="text-border group-hover:text-muted-foreground size-3.5 shrink-0 transition-colors duration-150" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="text-muted-foreground size-4" />
                <h2 className="text-foreground text-sm font-semibold">Guides &amp; Resources</h2>
              </div>
              <Link
                href="/getting-started/introduction"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[12.5px] font-medium transition-colors"
              >
                Browse all <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="border-border overflow-hidden rounded-md border">
              {GUIDES.map((g, i) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className={cn(
                    "group hover:bg-muted/30 flex items-center justify-between px-4 py-3 transition-colors duration-150",
                    i !== GUIDES.length - 1 && "border-border border-b",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium tracking-wider uppercase">
                      {g.tag}
                    </span>
                    <p className="text-foreground text-[13px] font-medium">{g.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {g.badge && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 uppercase dark:bg-emerald-950/40 dark:text-emerald-400">
                        {g.badge}
                      </span>
                    )}
                    <ArrowRight className="text-border group-hover:text-muted-foreground size-3.5 shrink-0 transition-colors duration-150" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-border mb-16 overflow-hidden rounded-md border">
          <div className="flex flex-col gap-5 px-8 py-8 md:flex-row md:items-center md:justify-between md:px-10">
            <div>
              <h2 className="text-foreground mb-1.5 text-base font-semibold">
                Ready to integrate?
              </h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Create a free account, grab your test keys, and make your first API call in minutes.
              </p>
            </div>
            <div className="flex shrink-0 gap-3">
              <Link
                href="https://vestrapay.com/signup"
                className="bg-primary text-primary-foreground flex items-center rounded-md px-4 py-2 text-sm font-medium transition-opacity duration-150 hover:opacity-90"
              >
                Create account
              </Link>
              <Link
                href="/getting-started/introduction"
                className="border-border bg-card text-foreground hover:bg-muted/50 flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-150"
              >
                <BookOpen className="size-3.5" />
                Read the docs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-border border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <img src="/vestrapay.svg" alt="Vestrapay" className="h-4 w-auto opacity-40" />
            <span className="text-muted-foreground text-xs">
              &copy; {new Date().getFullYear()} Vestrapay
            </span>
          </div>
          <div className="flex items-center gap-5">
            {[
              { label: "Status", href: "#" },
              { label: "Support", href: "#" },
              { label: "Privacy", href: "#" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
