// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, React.ComponentType<any>>;
import { Callout } from "@/components/docs/callout";
import { Steps, Step } from "@/components/docs/steps";
import { CodeTabs } from "@/components/docs/code-tabs";
import { ParameterTable, Parameter } from "@/components/docs/parameter-table";
import { EndpointBadge } from "@/components/docs/endpoint-badge";
import { ApiSection } from "@/components/docs/api-section";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Callout,
    Steps,
    Step,
    CodeTabs,
    ParameterTable,
    Parameter,
    EndpointBadge,
    ApiSection,
  };
}
