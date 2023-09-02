import { OperatorEnum } from "../enums/OperatorEnum";

export const OperatorConstant = Object.keys(OperatorEnum).map((key) => ({
  label: OperatorEnum[key as keyof typeof OperatorEnum],
  value: key,
}));
