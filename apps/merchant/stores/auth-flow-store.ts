"use client";

import { create } from "zustand";
import type { RegisterMerchantData } from "@/lib/api/types";

type AuthFlowState = {
  registrationEmail: string | null;
  registrationData: RegisterMerchantData | null;
  setRegistrationEmail: (email: string | null) => void;
  setRegistrationData: (data: RegisterMerchantData | null) => void;
  clear: () => void;
};

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  registrationEmail: null,
  registrationData: null,
  setRegistrationEmail: (email) => set({ registrationEmail: email }),
  setRegistrationData: (data) =>
    set(() => {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console -- local debugging signal for registration flow state
        console.log("AuthFlowStore setRegistrationData:", data);
      }
      return { registrationData: data, registrationEmail: data?.email ?? null };
    }),
  clear: () => set({ registrationEmail: null, registrationData: null }),
}));
