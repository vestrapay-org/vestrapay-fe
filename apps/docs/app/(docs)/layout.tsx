"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { AutoToc } from "@/components/layout/auto-toc";
import { AiSidebar } from "@/components/ai/ai-assistant";
import { cn } from "@/lib/utils";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const pathname = usePathname();

  const isFullWidthRoute = pathname?.includes("/api-reference/") || pathname?.includes("/getting-started/") || pathname?.includes("/guides/");

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMobileMenuToggle={() => setMobileMenuOpen((o) => !o)}
        mobileMenuOpen={mobileMenuOpen}
        onAiToggle={() => setAiOpen((o) => !o)}
        aiOpen={aiOpen}
      />

      <MobileSidebar open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <AiSidebar open={aiOpen} onClose={() => setAiOpen(false)} />

      {/* Three-column layout */}
      <div className="mx-auto flex max-w-[1440px] pt-14">
        {/* Left sidebar */}
        <aside className="docs-scroll sticky top-14 hidden h-[calc(100vh-56px)] w-60 shrink-0 overflow-y-auto border-r border-border bg-background lg:block xl:w-64">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <div className={cn("flex", !isFullWidthRoute && "justify-center gap-8 xl:gap-0")}>
            <div
              className={cn(
                "prose w-full min-w-0 px-8 py-10 xl:px-12",
                isFullWidthRoute ? "max-w-none" : "max-w-[720px]",
              )}
            >
              {children}
            </div>

            {/* Right TOC */}
            {!isFullWidthRoute && (
              <div className="hidden w-48 shrink-0 px-4 xl:block">
                <AutoToc />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
