import { cn } from "@/lib/utils";

interface StepProps {
  title: string;
  children: React.ReactNode;
}

export function Step({ title, children }: StepProps): React.ReactNode {
  return (
    <div className="step relative pl-11">
      <h3 className="text-foreground mb-2 text-[0.9375rem] font-semibold tracking-tight">{title}</h3>
      <div className="text-muted-foreground text-[0.875rem] leading-relaxed [&>p]:mb-2 last:[&>p]:mb-0">
        {children}
      </div>
    </div>
  );
}

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

export function Steps({ children, className }: StepsProps): React.ReactNode {
  return (
    <div
      className={cn(
        "my-8 space-y-8",
        "[&>.step]:relative",
        "[&>.step:not(:last-child)]:pb-8",
        "[&>.step:not(:last-child)]:before:absolute [&>.step:not(:last-child)]:before:top-8 [&>.step:not(:last-child)]:before:left-[14px] [&>.step:not(:last-child)]:before:bottom-0 [&>.step:not(:last-child)]:before:w-px [&>.step:not(:last-child)]:before:bg-border [&>.step:not(:last-child)]:before:content-['']",
        "[&>.step]:after:absolute [&>.step]:after:top-0.5 [&>.step]:after:left-0 [&>.step]:after:flex [&>.step]:after:size-7 [&>.step]:after:items-center [&>.step]:after:justify-center [&>.step]:after:rounded-md [&>.step]:after:bg-primary [&>.step]:after:font-mono [&>.step]:after:text-xs [&>.step]:after:font-bold [&>.step]:after:text-primary-foreground",
        className,
      )}
      style={{ counterReset: "step" }}
    >
      <style>{`
        .steps-container > .step::after {
          counter-increment: step;
          content: counter(step);
        }
      `}</style>
      <div className="steps-container space-y-8" style={{ counterReset: "step" }}>
        {children}
      </div>
    </div>
  );
}
