export type LedgerCurrency = "NGN" | "USD" | "GBP";

export type LedgerAccount = {
  id: string;
  name: string;
  balanceLabel: string;
  isPrimary: boolean;
};

export type CollectionMethod = "card" | "transfer" | "link";

export type CollectionStatus = "SUCCESS" | "PENDING";

export type RecentCollectionRow = {
  id: string;
  customerName: string;
  reference: string;
  amount: string;
  method: CollectionMethod;
  status: CollectionStatus;
  dateLabel: string;
};

export type AccountOverview = {
  availableBalance: string;
  nuban: string;
  bankName: string;
  accountStatus: "Active";
};
