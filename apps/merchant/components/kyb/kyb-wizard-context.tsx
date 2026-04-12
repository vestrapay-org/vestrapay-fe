"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type KybBusinessData = {
  legalBusinessName: string;
  businessType: string;
  registeredAddress: string;
  city: string;
  state: string;
  phone: string;
  website: string;
  industry: string;
};

export type KybIdentityData = {
  fullLegalName: string;
  dateOfBirth: string;
  nationality: string;
  idNumber: string;
};

export type KybSettlementData = {
  bankName: string;
  accountType: string;
  accountNumber: string;
  routingNumber: string;
};

export type KybDocumentsData = {
  certFileName: string;
  certFileSize: string;
  passportFileName: string;
  passportFileSize: string;
};

const emptyBusiness: KybBusinessData = {
  legalBusinessName: "",
  businessType: "",
  registeredAddress: "",
  city: "",
  state: "",
  phone: "",
  website: "",
  industry: "",
};

const emptyIdentity: KybIdentityData = {
  fullLegalName: "",
  dateOfBirth: "",
  nationality: "",
  idNumber: "",
};

const emptySettlement: KybSettlementData = {
  bankName: "",
  accountType: "",
  accountNumber: "",
  routingNumber: "",
};

const emptyDocuments: KybDocumentsData = {
  certFileName: "",
  certFileSize: "",
  passportFileName: "",
  passportFileSize: "",
};

type KybWizardContextValue = {
  business: KybBusinessData;
  setBusiness: React.Dispatch<React.SetStateAction<KybBusinessData>>;
  identity: KybIdentityData;
  setIdentity: React.Dispatch<React.SetStateAction<KybIdentityData>>;
  settlement: KybSettlementData;
  setSettlement: React.Dispatch<React.SetStateAction<KybSettlementData>>;
  documents: KybDocumentsData;
  setDocuments: React.Dispatch<React.SetStateAction<KybDocumentsData>>;
  resetAll: () => void;
};

const KybWizardContext = createContext<KybWizardContextValue | null>(null);

function KybWizardProvider({ children }: { children: React.ReactNode }) {
  const [business, setBusiness] = useState<KybBusinessData>(emptyBusiness);
  const [identity, setIdentity] = useState<KybIdentityData>(emptyIdentity);
  const [settlement, setSettlement] = useState<KybSettlementData>(emptySettlement);
  const [documents, setDocuments] = useState<KybDocumentsData>(emptyDocuments);

  const resetAll = useCallback(() => {
    setBusiness(emptyBusiness);
    setIdentity(emptyIdentity);
    setSettlement(emptySettlement);
    setDocuments(emptyDocuments);
  }, []);

  const value = useMemo(
    () => ({
      business,
      setBusiness,
      identity,
      setIdentity,
      settlement,
      setSettlement,
      documents,
      setDocuments,
      resetAll,
    }),
    [business, identity, settlement, documents, resetAll],
  );

  return <KybWizardContext.Provider value={value}>{children}</KybWizardContext.Provider>;
}

function useKybWizard() {
  const ctx = useContext(KybWizardContext);
  if (!ctx) {
    throw new Error("useKybWizard must be used within KybWizardProvider");
  }
  return ctx;
}

export {
  KybWizardProvider,
  useKybWizard,
  emptyBusiness,
  emptyIdentity,
  emptySettlement,
  emptyDocuments,
};
