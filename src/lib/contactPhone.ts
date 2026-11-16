import { getCountries, getCountryCallingCode as callingCode, isSupportedCountry, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/core";
import metadata from "libphonenumber-js/metadata.min.json";

export type { CountryCode } from "libphonenumber-js/core";
export const PHONE_COUNTRIES = getCountries(metadata);
export const getCountryCallingCode = (country: CountryCode) => callingCode(country, metadata);

export function contactCountry(value: string | null | undefined): CountryCode {
  const country = value?.trim().toUpperCase();
  return country && isSupportedCountry(country as CountryCode, metadata) ? country as CountryCode : "IT";
}

export function normalizeContactPhone(value: string, country?: CountryCode) {
  if (value.length > 64 || !/^[+\d\s().-]+$/.test(value)) return null;
  const phone = parsePhoneNumberFromString(value, { defaultCountry: country, extract: false }, metadata);
  return phone?.isPossible() ? phone.number : null;
}
