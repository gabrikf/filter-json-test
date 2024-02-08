import { DataItem, DataType } from "../../App";
import { OperatorEnum } from "../../enums/OperatorEnum";
import { FilterError } from "../../helpers/errors";
import { IAndFilters, IOrFilters } from "../../interfaces/filterInterfaces";

export interface IApllyFilterParams {
  id: string;
  fieldValue: string | number | boolean;
  operator: OperatorEnum;
  value: string;
}

const NUMERAL_OPERATORS = [OperatorEnum.GreaterThan, OperatorEnum.LessThen];

function isNumericalOperator(operator: OperatorEnum) {
  return NUMERAL_OPERATORS.includes(operator);
}

function applyFilter({ fieldValue, operator, value, id }: IApllyFilterParams) {
  if (isNumericalOperator(operator)) {
    if (isNaN(Number(value))) {
      throw new FilterError(
        id,
        `Value for numerical operators must be a number: ${value}`
      );
    }
  }

  const convertedValue = isNumericalOperator(operator) ? Number(value) : value;
  const convertedFieldValue = isNumericalOperator(operator)
    ? Number(fieldValue)
    : fieldValue;

  switch (operator) {
    case OperatorEnum.Equal:
      return convertedFieldValue === convertedValue;
    case OperatorEnum.GreaterThan:
      return convertedFieldValue > convertedValue;
    case OperatorEnum.LessThen:
      return convertedFieldValue < convertedValue;
    case OperatorEnum.Contain:
      return (convertedFieldValue as string).includes(convertedValue as string);
    case OperatorEnum.NotContain:
      return !(convertedFieldValue as string).includes(
        convertedValue as string
      );
    case OperatorEnum.Regex:
      try {
        const regex = new RegExp(value, "i"); // 'i' for case-insensitive
        return regex.test(String(convertedFieldValue));
      } catch (error) {
        throw new FilterError(id, `Invalid regular expression: ${value}`);
      }
  }
}

function applyOrFilters(item: DataItem, orFilters: IOrFilters[]): boolean {
  return orFilters.some((filter) => {
    if (!filter.value) {
      return true;
    }
    return applyFilter({
      id: filter.id,
      fieldValue: item[filter.column],
      operator: filter.operator as OperatorEnum,
      value: filter.value,
    });
  });
}

function applyAndFilters(item: DataItem, andFilters: IAndFilters[]): boolean {
  return andFilters.every((filterSet) => {
    return applyOrFilters(item, filterSet.values);
  });
}

export function applyComplexFilters(
  data: DataType,
  complexFilters: IAndFilters[]
): DataItem[] {
  let missedOperator: IOrFilters | undefined;
  complexFilters.forEach((andFilter) => {
    if (missedOperator) {
      return;
    }
    missedOperator = andFilter.values.find((orFilter) => !orFilter.operator);
  });
  if (missedOperator) {
    throw new FilterError(missedOperator.id, "Operator must be selected.");
  }
  return data.filter((item) => applyAndFilters(item, complexFilters));
}
