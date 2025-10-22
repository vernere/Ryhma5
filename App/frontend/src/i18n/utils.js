import { locales } from "./config";

export function isLocale(value) {
  return (locales).includes(value);
}