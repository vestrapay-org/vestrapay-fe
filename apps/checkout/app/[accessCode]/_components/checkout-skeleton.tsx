const SKELETON_NAV_ITEMS = [
  { labelClass: "w-8" },
  { labelClass: "w-24" },
  { labelClass: "w-20" },
] as const satisfies ReadonlyArray<{ readonly labelClass: string }>;

function SkeletonBlock({ className }: { readonly className: string }): React.ReactNode {
  return <div className={`skeleton-shimmer rounded ${className}`} />;
}

function NavSkeleton(): React.ReactNode {
  return (
    <div className="shrink-0 border-b border-[#ebedf2] bg-[#fafbfc] sm:w-44 sm:border-r sm:border-b-0">
      <div className="hidden px-4 pt-5 pb-1 sm:block">
        <SkeletonBlock className="h-4.5 w-16" />
      </div>
      <div className="flex overflow-x-auto sm:mt-3 sm:flex-col sm:overflow-x-visible">
        {SKELETON_NAV_ITEMS.map(({ labelClass }, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2 px-3 py-2.5 sm:px-4">
            <SkeletonBlock className="size-5 rounded" />
            <SkeletonBlock className={`h-3 ${labelClass}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderSkeleton(): React.ReactNode {
  return (
    <div className="border-b border-[#ebedf2] px-5 pt-4 pb-4 sm:px-6 sm:pt-5 sm:pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <SkeletonBlock className="size-8 rounded-md" />
          <div className="space-y-1.5">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-2.5 w-36" />
          </div>
        </div>
        <SkeletonBlock className="size-6 rounded" />
      </div>
      <SkeletonBlock className="mt-3 h-7 w-32" />
    </div>
  );
}

function CardFormSkeleton(): React.ReactNode {
  return (
    <div className="px-5 pt-4 pb-6 sm:px-6 sm:pt-5">
      <div className="space-y-3.5 sm:space-y-4">
        <div className="space-y-1.5">
          <SkeletonBlock className="h-2.5 w-18" />
          <SkeletonBlock className="h-10 rounded-md sm:h-11" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <SkeletonBlock className="h-2.5 w-10" />
            <SkeletonBlock className="h-10 rounded-md sm:h-11" />
          </div>
          <div className="space-y-1.5">
            <SkeletonBlock className="h-2.5 w-7" />
            <SkeletonBlock className="h-10 rounded-md sm:h-11" />
          </div>
        </div>

        <SkeletonBlock className="mt-1 h-10 rounded-md sm:mt-1.5 sm:h-11" />

        <div className="flex items-center justify-center gap-3 pt-1"></div>
      </div>
    </div>
  );
}

export function CheckoutSkeleton(): React.ReactNode {
  return (
    <>
      <NavSkeleton />
      <div className="min-w-0 flex-1">
        <HeaderSkeleton />
        <CardFormSkeleton />
      </div>
    </>
  );
}
