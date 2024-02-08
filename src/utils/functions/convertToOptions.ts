import { IOptions } from "../../interfaces/formInterfaces";
import { deepClone } from "./deepClone";

export function convertToOptions(obj?: object): IOptions[] | undefined {
  if (!obj) return;
  const deepClonedObj = deepClone(obj);
  return Object.keys(deepClonedObj)
    .filter((key) => typeof key === "string")
    .map((key) => {
      return {
        label: key,
        value: key,
      };
    });
}
