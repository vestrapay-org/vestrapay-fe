"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function AutoToc(): React.ReactNode {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(".prose h2[id], .prose h3[id]"),
    );

    const tocItems: TocItem[] = headings.map((h) => ({
      id: h.id,
      text: h.textContent?.replace(/#$/, "").trim() ?? "",
      level: h.tagName === "H2" ? 2 : 3,
    }));

    setItems(tocItems);

    if (tocItems.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0 && visible[0] !== undefined) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-56px 0px -65% 0px", threshold: 0 },
    );

    headings.forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-[4.5rem] pt-2">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/35">
        On this page
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                setActiveId(item.id);
              }}
              className={cn(
                "block rounded py-1 text-[12.5px] leading-snug transition-colors duration-150",
                item.level === 3 ? "pl-4" : "pl-0",
                activeId === item.id
                  ? "font-medium text-primary"
                  : "text-muted-foreground/70 hover:text-foreground",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
