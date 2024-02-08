import { v4 as uuid } from "uuid";
import { IFilterGroup, IFilterItem } from "../interfaces/filterInterfaces";
import { OperatorEnum } from "../enums/OperatorEnum";

export const INITIAL_FILTER_OPTION_VALUE: () => IFilterItem = () => ({
  id: uuid(),
  column: "",
  operator: OperatorEnum.Equal,
  value: "",
});

export const INITIAL_FILTER_OPTION_STATE: () => IFilterGroup = () => ({
  id: uuid(),
  values: [INITIAL_FILTER_OPTION_VALUE()],
});
