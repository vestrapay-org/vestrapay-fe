"use client";

import React from "react";

import type { LedgerCurrency } from "./accounts-types";
import { AccountBalanceOverview } from "./account-balance-overview";
import { AccountSelectorPanel } from "./account-selector-panel";
import { getOverviewForAccount, LEDGER_ACCOUNTS, RECENT_COLLECTIONS } from "./accounts-mock-data";
import { FundAccountModal } from "./fund-account-modal";
import { RecentCollectionsCard } from "./recent-collections-card";

export function AccountsDashboardView() {
  const [selectedAccountId, setSelectedAccountId] = React.useState(LEDGER_ACCOUNTS[0]!.id);
  const [currency, setCurrency] = React.useState<LedgerCurrency>("NGN");
  const [fundModalOpen, setFundModalOpen] = React.useState(false);

  const selectedAccount = React.useMemo(
    () => LEDGER_ACCOUNTS.find((a) => a.id === selectedAccountId) ?? LEDGER_ACCOUNTS[0]!,
    [selectedAccountId],
  );

  const overview = React.useMemo(
    () => getOverviewForAccount(selectedAccount.id),
    [selectedAccount.id],
  );

  const fundModalDetails = React.useMemo(
    () => ({
      accountName: selectedAccount.name,
      currency,
      bankName: overview.bankName,
      accountNumber: overview.nuban,
    }),
    [selectedAccount.name, currency, overview.bankName, overview.nuban],
  );

  return (
    <div className="-mx-3 -mt-1 min-w-0 bg-[#f9fafb] px-3 pt-4 pb-8 sm:-mx-4 sm:px-4 md:-mx-6 md:px-6 md:pt-5">
      <FundAccountModal open={fundModalOpen} details={fundModalDetails} onClose={() => setFundModalOpen(false)} />

      <div className="mx-auto min-w-0 max-w-[1400px]">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start lg:gap-8">
          <AccountSelectorPanel
            accounts={LEDGER_ACCOUNTS}
            selectedId={selectedAccount.id}
            onSelect={setSelectedAccountId}
          />

          <div className="min-w-0">
            <AccountBalanceOverview
              overview={overview}
              currency={currency}
              onCurrencyChange={setCurrency}
              onFundAccount={() => setFundModalOpen(true)}
            />

            <RecentCollectionsCard accountName={selectedAccount.name} rows={RECENT_COLLECTIONS} />
          </div>
        </div>
      </div>
    </div>
  );
}
