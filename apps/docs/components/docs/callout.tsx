import { AlertTriangle, CheckCircle, Info, XCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "info" | "warning" | "success" | "error" | "tip";

const CONFIG: Record<
  CalloutType,
  { icon: React.ElementType; wrapper: string; iconColor: string }
> = {
  info: {
    icon: Info,
    wrapper:
      "bg-blue-50/60 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    wrapper:
      "bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900",
    iconColor: "text-amber-500",
  },
  success: {
    icon: CheckCircle,
    wrapper:
      "bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900",
    iconColor: "text-emerald-500",
  },
  error: {
    icon: XCircle,
    wrapper:
      "bg-red-50/60 border-red-200 dark:bg-red-950/20 dark:border-red-900",
    iconColor: "text-red-500",
  },
  tip: {
    icon: Lightbulb,
    wrapper:
      "bg-violet-50/60 border-violet-200 dark:bg-violet-950/20 dark:border-violet-900",
    iconColor: "text-violet-500",
  },
};

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export function Callout({
  type = "info",
  title,
  children,
}: CalloutProps): React.ReactNode {
  const { icon: Icon, wrapper, iconColor } = CONFIG[type];
  return (
    <div
      className={cn(
        "not-prose my-6 flex gap-3 rounded-md border px-4 py-3.5",
        wrapper,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", iconColor)} />
      <div className="text-foreground min-w-0 flex-1 text-[13px] leading-relaxed">
        {title && (
          <p className="mb-1 font-semibold">{title}</p>
        )}
        <div className="text-muted-foreground [&_code]:text-foreground [&_code]:bg-white/60 dark:[&_code]:bg-black/20 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px]">
          {children}
        </div>
      </div>
    </div>
  );
}
