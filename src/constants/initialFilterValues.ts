import { v4 as uuid } from "uuid";
import { IAndFilters, IOrFilters } from "../interfaces/filterInterfaces";
import { OperatorEnum } from "../enums/OperatorEnum";

export const INITIAL_FILTER_OPTION_VALUE: () => IOrFilters = () => ({
  id: uuid(),
  column: "",
  operator: OperatorEnum.Equal,
  value: "",
});

export const INITIAL_FILTER_OPTION_STATE: () => IAndFilters = () => ({
  id: uuid(),
  values: [INITIAL_FILTER_OPTION_VALUE()],
});
