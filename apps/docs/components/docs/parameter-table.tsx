import { cn } from "@/lib/utils";

interface ParameterProps {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  children: React.ReactNode;
}

export function Parameter({
  name,
  type,
  required,
  default: defaultVal,
  children,
}: ParameterProps): React.ReactNode {
  return (
    <div className="border-border border-b py-3.5 last:border-b-0">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <code className="text-primary font-mono text-[13px] font-semibold">
          {name}
        </code>
        <span className="border-border text-muted-foreground rounded border px-1.5 py-0.5 font-mono text-[11px]">
          {type}
        </span>
        {required ? (
          <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
            required
          </span>
        ) : (
          <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium">
            optional
          </span>
        )}
        {defaultVal && (
          <span className="text-muted-foreground text-[11.5px]">
            Default: <code className="font-mono text-[11.5px]">{defaultVal}</code>
          </span>
        )}
      </div>
      <div className="text-muted-foreground text-[13px] leading-relaxed [&>p]:mb-0 [&_code]:text-foreground [&_code]:font-mono [&_code]:text-[12px]">
        {children}
      </div>
    </div>
  );
}

interface ParameterTableProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ParameterTable({
  title,
  children,
  className,
}: ParameterTableProps): React.ReactNode {
  return (
    <div className={cn("not-prose my-6", className)}>
      {title && (
        <p className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-widest">
          {title}
        </p>
      )}
      <div className="border-border overflow-hidden rounded-md border">
        <div className="bg-muted/40 border-border border-b px-4 py-2">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-widest">
            Parameters
          </span>
        </div>
        <div className="divide-border divide-y px-4">{children}</div>
      </div>
    </div>
  );
}
