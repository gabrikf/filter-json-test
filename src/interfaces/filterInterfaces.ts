import { OperatorEnum } from "../enums/OperatorEnum";

export interface IFilterItem {
  id: string;
  column: string;
  operator: OperatorEnum;
  value: string;
}

export interface IFilterGroup {
  id: string;
  values: IFilterItem[];
}

export interface IOnChangeFilterParams {
  newValues: IFilterGroup[];
  shouldRefilter?: boolean;
}

export type OnFilterChangeFunction = (params: IOnChangeFilterParams) => void;
