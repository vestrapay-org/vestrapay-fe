import React, { Suspense } from "react";

import { SettingsView } from "@/components/settings/settings-view";

export default function SettingsPage() {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-7xl animate-pulse rounded-lg bg-white p-8 text-sm text-gray-400">Loading…</div>}
    >
      <SettingsView />
    </Suspense>
  );
}
