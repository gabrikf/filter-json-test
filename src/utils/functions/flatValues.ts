import { DataType } from "../../App";
import { deepClone } from "./deepClone";

export function flatArray(array: DataType) {
  const deepClonedArray = deepClone(array);
  return deepClonedArray.map((item) => {
    Object.keys(item).forEach((key) => {
      if (typeof item[key] === "object") {
        item[key] = JSON.stringify(item[key]);
      }
    });
    return item;
  });
}
