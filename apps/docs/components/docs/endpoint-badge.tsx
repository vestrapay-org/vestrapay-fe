import { cn } from "@/lib/utils";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const METHOD_STYLES: Record<HttpMethod, string> = {
  GET: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  POST: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  PUT: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  PATCH: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  DELETE: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

interface EndpointBadgeProps {
  method: HttpMethod;
  path: string;
  description?: string;
  className?: string;
}

export function EndpointBadge({
  method,
  path,
  description,
  className,
}: EndpointBadgeProps): React.ReactNode {
  return (
    <div
      className={cn(
        "not-prose my-5 overflow-hidden rounded-md border border-border",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3 px-4 py-3">
        <span
          className={cn(
            "shrink-0 rounded px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider",
            METHOD_STYLES[method],
          )}
        >
          {method}
        </span>
        <code className="flex-1 font-mono text-[13px] font-medium text-foreground">
          {path}
        </code>
      </div>
      {description && (
        <div className="border-t border-border bg-muted/30 px-4 py-2.5">
          <p className="text-[13px] text-muted-foreground">{description}</p>
        </div>
      )}
    </div>
  );
}
