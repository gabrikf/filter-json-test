import { isValid } from "date-fns";
import { dateRegex } from "../../constants/regex";

export function isValidStringDate(value: unknown): boolean {
  return (
    typeof value === "string" &&
    dateRegex.test(value) &&
    isValid(new Date(value))
  );
}
