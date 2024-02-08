import { isAfter, isBefore, isEqual, parseISO } from "date-fns";
import { DataItem, DataType } from "../../App";
import { OperatorEnum } from "../../enums/OperatorEnum";
import { FilterError } from "../../helpers/errors";
import { IFilterGroup, IFilterItem } from "../../interfaces/filterInterfaces";
import { isValidStringDate } from "./isValidStringDate";

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

function convertValue(
  value: string | number | boolean,
  operator: OperatorEnum
) {
  if (isValidStringDate(value)) {
    return parseISO(value as string);
  }
  if (isNumericalOperator(operator)) {
    return Number(value);
  }
  return value;
}

function applyFilter({ fieldValue, operator, value, id }: IApllyFilterParams) {
  const isDateValue = isValidStringDate(value);

  const isDateFieldValue = isValidStringDate(fieldValue);

  if (isDateFieldValue && !isDateValue) {
    throw new FilterError(id, `Value for date field must be a date: ${value}`);
  }

  if (isNumericalOperator(operator) && !isDateValue) {
    if (isNaN(Number(value))) {
      throw new FilterError(
        id,
        `Value for numerical operators must be a number: ${value}`
      );
    }
  }

  const convertedValue = convertValue(value, operator);
  const convertedFieldValue = convertValue(fieldValue, operator);

  switch (operator) {
    case OperatorEnum.Equal:
      if (isDateValue) {
        return isEqual(convertedFieldValue as Date, convertedValue as Date);
      }
      return convertedFieldValue === convertedValue;
    case OperatorEnum.GreaterThan:
      if (isDateValue) {
        return isAfter(convertedFieldValue as Date, convertedValue as Date);
      }
      return convertedFieldValue > convertedValue;
    case OperatorEnum.LessThen:
      if (isDateValue) {
        return isBefore(convertedFieldValue as Date, convertedValue as Date);
      }
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

function applyOrFilters(item: DataItem, orFilters: IFilterItem[]): boolean {
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

function applyAndFilters(item: DataItem, andFilters: IFilterGroup[]): boolean {
  return andFilters.every((filterSet) => {
    return applyOrFilters(item, filterSet.values);
  });
}

export function applyComplexFilters(
  data: DataType,
  complexFilters: IFilterGroup[]
): DataItem[] {
  let missedOperator: IFilterItem | undefined;
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
