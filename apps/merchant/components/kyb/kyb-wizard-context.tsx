"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type KybBusinessData = {
  legalBusinessName: string;
  businessType: string;
  businessRegistrationNumber: string;
  taxIdentificationNumber: string;
  registeredAddress: string;
  country: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  industry: string;
  businessRegistrationCertificateFileName: string;
  businessRegistrationCertificateFileSize: string;
  businessProofOfAddressFileName: string;
  businessProofOfAddressFileSize: string;
};

export type KybOwnerFields = {
  legalFirstName: string;
  legalLastName: string;
  dateOfBirth: string;
  ssnTinLast4: string;
  personalEmail: string;
  personalPhone: string;
  residentialStreet: string;
  residentialCity: string;
  residentialState: string;
  residentialPostalCode: string;
  residentialCountry: string;
  citizenshipCountry: string;
  idDocumentType: string;
  idDocumentFileName: string;
  idDocumentFileSize: string;
  proofOfAddressFileName: string;
  proofOfAddressFileSize: string;
};

export type KybIdentityData = {
  primary: KybOwnerFields;
  additional: KybOwnerFields | null;
};

export type KybSettlementData = {
  /** ISO currency for settlement account (drives which fields are shown). */
  settlementCurrency: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  routingNumber: string;
  /** NGN / local-bank flows: account name (e.g. from bank verification). */
  accountHolderName: string;
};

export function createEmptyKybOwnerFields(): KybOwnerFields {
  return {
    legalFirstName: "",
    legalLastName: "",
    dateOfBirth: "",
    ssnTinLast4: "",
    personalEmail: "",
    personalPhone: "",
    residentialStreet: "",
    residentialCity: "",
    residentialState: "",
    residentialPostalCode: "",
    residentialCountry: "",
    citizenshipCountry: "",
    idDocumentType: "",
    idDocumentFileName: "",
    idDocumentFileSize: "",
    proofOfAddressFileName: "",
    proofOfAddressFileSize: "",
  };
}

export const emptyBusiness: KybBusinessData = {
  legalBusinessName: "",
  businessType: "",
  businessRegistrationNumber: "",
  taxIdentificationNumber: "",
  registeredAddress: "",
  country: "",
  city: "",
  state: "",
  phone: "",
  website: "",
  industry: "",
  businessRegistrationCertificateFileName: "",
  businessRegistrationCertificateFileSize: "",
  businessProofOfAddressFileName: "",
  businessProofOfAddressFileSize: "",
};

export const emptyIdentity: KybIdentityData = {
  primary: createEmptyKybOwnerFields(),
  additional: null,
};

export const emptySettlement: KybSettlementData = {
  settlementCurrency: "NGN",
  bankName: "",
  accountType: "",
  accountNumber: "",
  routingNumber: "",
  accountHolderName: "",
};

type KybWizardContextValue = {
  business: KybBusinessData;
  setBusiness: React.Dispatch<React.SetStateAction<KybBusinessData>>;
  identity: KybIdentityData;
  setIdentity: React.Dispatch<React.SetStateAction<KybIdentityData>>;
  settlement: KybSettlementData;
  setSettlement: React.Dispatch<React.SetStateAction<KybSettlementData>>;
  resetAll: () => void;
};

const KybWizardContext = createContext<KybWizardContextValue | null>(null);

export function KybWizardProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<KybBusinessData>(emptyBusiness);
  const [identity, setIdentity] = useState<KybIdentityData>(emptyIdentity);
  const [settlement, setSettlement] = useState<KybSettlementData>(emptySettlement);

  const resetAll = useCallback(() => {
    setBusiness(emptyBusiness);
    setIdentity(emptyIdentity);
    setSettlement(emptySettlement);
  }, []);

  const value = useMemo(
    () => ({
      business,
      setBusiness,
      identity,
      setIdentity,
      settlement,
      setSettlement,
      resetAll,
    }),
    [business, identity, settlement, resetAll],
  );

  return <KybWizardContext.Provider value={value}>{children}</KybWizardContext.Provider>;
}

export function useKybWizard() {
  const ctx = useContext(KybWizardContext);
  if (!ctx) {
    throw new Error("useKybWizard must be used within KybWizardProvider");
  }
  return ctx;
}
