import { type HttpMethod, EndpointBadge } from "./endpoint-badge";
import { ParameterTable, Parameter } from "./parameter-table";
import { CodeBlock } from "./code-block";
import { cn } from "@/lib/utils";

interface ApiSectionProps {
  method: HttpMethod;
  path: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ApiSection({
  method,
  path,
  title,
  description,
  children,
  className,
}: ApiSectionProps): React.ReactNode {
  return (
    <section className={cn("border-border mb-14 border-b pb-14 last:border-b-0 last:pb-0", className)}>
      <h3 className="text-foreground mb-2 text-xl font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-5 text-[0.9375rem] leading-relaxed">{description}</p>
      )}
      <EndpointBadge method={method} path={path} />
      {children}
    </section>
  );
}

export { ParameterTable, Parameter, CodeBlock };
