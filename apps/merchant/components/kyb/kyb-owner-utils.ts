import type { KybOwnerFields } from "./kyb-wizard-context";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isKybOwnerComplete(o: KybOwnerFields): boolean {
  return (
    o.legalFirstName.trim().length > 0 &&
    o.legalLastName.trim().length > 0 &&
    o.dateOfBirth.length > 0 &&
    o.ssnTinLast4.length === 4 &&
    isValidEmail(o.personalEmail) &&
    o.personalPhone.replace(/\D/g, "").length >= 10 &&
    o.residentialStreet.trim().length > 0 &&
    o.residentialCity.trim().length > 0 &&
    o.residentialState.trim().length > 0 &&
    o.residentialPostalCode.trim().length > 0 &&
    o.residentialCountry.length > 0 &&
    o.citizenshipCountry.length > 0 &&
    o.idDocumentType.length > 0 &&
    o.idDocumentFileName.length > 0 &&
    o.proofOfAddressFileName.length > 0
  );
}

export { isKybOwnerComplete, isValidEmail };
