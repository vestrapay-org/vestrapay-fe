export interface APIResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface RegisterMerchantPayload {
  email: string;
  password: string;
  businessName: string;
  phone: string;
  country: string;
  agreedToTerms: boolean;
}

export interface RegisterMerchantData {
  id: string;
  email: string;
  status: string;
  challengeToken: string;
  emailVerified: boolean;
  verificationRequired: boolean;
  verificationMethod: string;
}

export interface MerchantDashboard {
  totalCollections: string;
  transactionVolume: number;
  successRate: number | null;
  isSandbox: boolean;
  kybStatus: "pending" | "approved" | "rejected" | "not_started";
  activeChannels: string[];
  apiVersion?: string;
}


export interface VerifyEmailPayload {
  code: string;
}

export interface VerifyEmailData {
  accessToken: string;
  refreshToken: string;
}
