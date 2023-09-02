import { DataType } from "../../App";

export function flatArray(array: DataType) {
  return array.map((item) => {
    Object.keys(item).forEach((key) => {
      if (typeof item[key] === "object") {
        item[key] = JSON.stringify(item[key]);
      }
    });
    return item;
  });
}
