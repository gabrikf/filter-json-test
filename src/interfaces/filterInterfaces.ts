import { OperatorEnum } from "../enums/OperatorEnum";

export type OnFilterFunc = (filters: IAndFilters[]) => void;

export interface IOrFilters {
  id: string;
  column: string;
  operator?: OperatorEnum;
  value: string;
}

export interface IAndFilters {
  id: string;
  values: IOrFilters[];
}
