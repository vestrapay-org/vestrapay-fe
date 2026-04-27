import type { AccountOverview, LedgerAccount, RecentCollectionRow } from "./accounts-types";

const ACCOUNT_OVERVIEWS: Record<string, AccountOverview> = {
  main: {
    availableBalance: "₦1,240,500.00",
    nuban: "0123456789",
    bankName: "Vestra Sovereign Bank",
    accountStatus: "Active",
  },
  bag: {
    availableBalance: "₦482,100.00",
    nuban: "0234567891",
    bankName: "Vestra Sovereign Bank",
    accountStatus: "Active",
  },
  shoe: {
    availableBalance: "₦128,450.00",
    nuban: "0345678912",
    bankName: "Vestra Sovereign Bank",
    accountStatus: "Active",
  },
};

export const LEDGER_ACCOUNTS: LedgerAccount[] = [
  {
    id: "main",
    name: "Main Account",
    balanceLabel: "₦1,240,500.00",
    isPrimary: true,
  },
  {
    id: "bag",
    name: "Bag Sales",
    balanceLabel: "₦482,100.00",
    isPrimary: false,
  },
  {
    id: "shoe",
    name: "Shoe Sales",
    balanceLabel: "₦128,450.00",
    isPrimary: false,
  },
];

export const RECENT_COLLECTIONS: RecentCollectionRow[] = [
  {
    id: "1",
    customerName: "Olumide Johnson",
    reference: "VP-COL-882190",
    amount: "₦24,000.00",
    method: "card",
    status: "SUCCESS",
    dateLabel: "Oct 24, 2023 · 14:20",
  },
  {
    id: "2",
    customerName: "Chioma Adeyemi",
    reference: "VP-COL-882191",
    amount: "₦18,500.00",
    method: "transfer",
    status: "SUCCESS",
    dateLabel: "Oct 24, 2023 · 12:08",
  },
  {
    id: "3",
    customerName: "Tunde Bakare",
    reference: "VP-COL-882188",
    amount: "₦6,200.00",
    method: "link",
    status: "PENDING",
    dateLabel: "Oct 23, 2023 · 19:41",
  },
  {
    id: "4",
    customerName: "Ngozi Okonkwo",
    reference: "VP-COL-882184",
    amount: "₦112,000.00",
    method: "card",
    status: "SUCCESS",
    dateLabel: "Oct 23, 2023 · 09:15",
  },
];

export function getOverviewForAccount(accountId: string): AccountOverview {
  return ACCOUNT_OVERVIEWS[accountId] ?? ACCOUNT_OVERVIEWS.main!;
}
