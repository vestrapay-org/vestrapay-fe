export type TransactionRecord = {
  referenceOrRecipient: string;
  subtitle: string;
  amount: string;
  fee?: string;
  currency: string;
  channelOrBank: string;
  accountReconciled?: string;
  status: "SUCCESSFUL" | "PENDING";
  date: string;
};

export type TransactionViewMode = "collections" | "transfers";
