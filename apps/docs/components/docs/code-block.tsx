import { codeToHtml } from "shiki";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: string;
  className?: string;
}

export async function CodeBlock({
  code,
  lang = "plaintext",
  title,
  className,
}: CodeBlockProps): Promise<React.ReactNode> {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "one-dark-pro" },
    defaultColor: false,
  });

  return (
    <div
      className={cn(
        "not-prose group relative my-5 overflow-hidden rounded-md border",
        className,
      )}
      style={{ borderColor: "var(--code-border)" }}
    >
      {title && (
        <div
          className="flex items-center border-b px-4 py-2"
          style={{
            background: "var(--code-bg)",
            borderColor: "var(--code-border)",
          }}
        >
          <span
            className="font-mono text-[11.5px]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {title}
          </span>
        </div>
      )}
      <div className="relative" style={{ background: "var(--code-bg)" }}>
        <div
          className="docs-scroll overflow-x-auto [&>pre]:m-0 [&>pre]:rounded-none [&>pre]:border-none [&>pre]:bg-transparent [&>pre]:p-4 [&>pre]:text-[12.5px] [&>pre]:leading-[1.75]"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="absolute top-2.5 right-2.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <CopyButton text={code.trim()} />
        </div>
      </div>
    </div>
  );
}
