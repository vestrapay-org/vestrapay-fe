"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({ text, dark, className }: { text: string; dark?: boolean; className?: string }): React.ReactNode {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy to clipboard"}
      className={cn(
        "flex size-7 items-center justify-center rounded-md transition-all duration-150",
        dark
          ? copied
            ? "text-emerald-400 scale-110"
            : "text-white/30 hover:text-white/70 hover:bg-white/10"
          : copied
            ? "text-emerald-500 scale-110"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/80",
        className,
      )}
    >
      <span className="transition-transform duration-150">
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </span>
    </button>
  );
}
