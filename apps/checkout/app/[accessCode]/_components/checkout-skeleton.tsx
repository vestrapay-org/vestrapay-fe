const SKELETON_NAV_ITEMS = [
  { iconClass: "size-5", labelClass: "w-8" },
  { iconClass: "size-5", labelClass: "w-24" },
  { iconClass: "size-5", labelClass: "w-20" },
] as const satisfies ReadonlyArray<{
  readonly iconClass: string;
  readonly labelClass: string;
}>;

function SkeletonBlock({
  className,
}: {
  readonly className: string;
}): React.ReactNode {
  return <div className={`rounded bg-[#e3e8ee] ${className}`} />;
}

function NavSkeleton(): React.ReactNode {
  return (
    <div className="shrink-0 border-b border-[#e3e8ee] sm:w-45 sm:border-r sm:border-b-0 sm:py-6">
      <div className="hidden px-5 pb-3 sm:block">
        <SkeletonBlock className="h-2.5 w-28" />
      </div>
      <div className="flex overflow-x-auto px-3 py-2 sm:flex-col sm:overflow-x-visible sm:px-0 sm:py-0">
        {SKELETON_NAV_ITEMS.map(({ iconClass, labelClass }, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 px-3 py-2 sm:gap-3 sm:px-5 sm:py-3"
          >
            <SkeletonBlock className={`rounded-md ${iconClass}`} />
            <SkeletonBlock className={`h-3 ${labelClass}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderSkeleton(): React.ReactNode {
  return (
    <div className="px-5 pt-5 pb-4 sm:px-8 sm:pt-8 sm:pb-6">
      <div className="mb-5 flex items-center justify-between pb-3">
        <SkeletonBlock className="h-7 w-28 sm:h-8" />
        <SkeletonBlock className="size-8 rounded-full" />
      </div>
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-36" />
        <SkeletonBlock className="h-3 w-52" />
      </div>
      <SkeletonBlock className="mt-2 h-7 w-32 sm:mt-3 sm:h-9 sm:w-40" />
    </div>
  );
}

function CardFormSkeleton(): React.ReactNode {
  return (
    <div className="px-5 pt-5 pb-8 sm:px-8 sm:pt-6">
      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-11 rounded-xl sm:h-12" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-12" />
            <SkeletonBlock className="h-11 rounded-xl sm:h-12" />
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-8" />
            <SkeletonBlock className="h-11 rounded-xl sm:h-12" />
          </div>
        </div>

        <SkeletonBlock className="mt-1 h-11 rounded-xl sm:mt-2 sm:h-12" />
      </div>
    </div>
  );
}

export function CheckoutSkeleton(): React.ReactNode {
  return (
    <>
      <NavSkeleton />
      <div className="flex-1 animate-pulse">
        <HeaderSkeleton />
        <CardFormSkeleton />
      </div>
    </>
  );
}
