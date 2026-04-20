"use client";

import { useState, useEffect } from "react";
import { codeToHtml } from "shiki";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

export interface CodeTab {
  label: string;
  lang: string;
  code: string;
}

export function CodeTabs({
  tabs,
  title,
}: {
  tabs: CodeTab[];
  title?: string;
}): React.ReactNode {
  const [active, setActive] = useState(0);
  const [rendered, setRendered] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;
    const run = async (): Promise<void> => {
      const result = await Promise.all(
        tabs.map((t) =>
          codeToHtml(t.code.trim(), {
            lang: t.lang,
            themes: { light: "github-light", dark: "one-dark-pro" },
            defaultColor: false,
          }),
        ),
      );
      if (!cancelled)
        setRendered(Object.fromEntries(result.map((h, i) => [i, h])));
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [tabs]);

  const currentTab = tabs[active];

  return (
    <div
      className="not-prose group my-5 overflow-hidden rounded-md border"
      style={{ borderColor: "var(--code-border)" }}
    >
      <div
        className="flex items-end gap-0 border-b px-1"
        style={{
          background: "var(--code-bg)",
          borderColor: "var(--code-border)",
        }}
      >
        {title && (
          <span
            className="mr-2 px-2 py-2 font-mono text-[11px]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {title}
          </span>
        )}
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={cn(
              "border-b-2 px-3 py-2 font-mono text-[12px] font-medium transition-colors duration-150",
              i === active
                ? "border-foreground text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative" style={{ background: "var(--code-bg)" }}>
        {rendered[active] ? (
          <div
            className="docs-scroll overflow-x-auto [&>pre]:m-0 [&>pre]:rounded-none [&>pre]:border-none [&>pre]:bg-transparent [&>pre]:p-4 [&>pre]:text-[12.5px] [&>pre]:leading-[1.75]"
            dangerouslySetInnerHTML={{ __html: rendered[active] }}
          />
        ) : (
          <pre
            className="p-4 text-[12.5px] leading-[1.75]"
            style={{ color: "var(--muted-foreground)" }}
          >
            <code>{currentTab?.code}</code>
          </pre>
        )}
        <div className="absolute top-2.5 right-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <CopyButton text={currentTab?.code ?? ""} />
        </div>
      </div>
    </div>
  );
}
