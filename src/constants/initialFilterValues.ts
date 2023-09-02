import { v4 as uuid } from "uuid";
import { IAndFilters, IOrFilters } from "../interfaces/filterInterfaces";

export const INITIAL_FILTER_OPTION_VALUE: () => IOrFilters = () => ({
  id: uuid(),
  column: "",
  operator: undefined,
  value: "",
});

export const INITIAL_FILTER_OPTION_STATE: () => IAndFilters = () => ({
  id: uuid(),
  values: [INITIAL_FILTER_OPTION_VALUE()],
});
