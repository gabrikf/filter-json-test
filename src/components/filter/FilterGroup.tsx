import { Box, SelectChangeEvent, Stack } from "@mui/material";
import { ChangeEvent, Fragment } from "react";

import { useFilter } from "../../hooks/useFilter";
import {
  IFilterGroup,
  IFilterItem,
  OnFilterChangeFunction,
} from "../../interfaces/filterInterfaces";
import { IOptions } from "../../interfaces/formInterfaces";
import { Connector } from "../shared/Connector";
import { ButtonFilterGroup } from "./ButtonFilterGroup";
import { FilterItem } from "./FilterItem";

type CustomEvent<T> =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent<T>;

export interface IFilterError {
  id: string;
  message: string;
}

interface IFilterGroupProps {
  filterValues: IFilterGroup[];
  handleChangeFilter: OnFilterChangeFunction;
  isLoading: boolean;
  onResetFilter: () => void;
  fields?: IOptions[];
  error?: IFilterError;
}

export interface IChangeItemParams<T> {
  e: CustomEvent<T>;
  id: string;
  parentId: string;
  field: keyof IFilterItem;
}

export function FilterGroup({
  isLoading,
  fields,
  error,
  onResetFilter,
  filterValues,
  handleChangeFilter,
}: IFilterGroupProps) {
  const isFirstLine =
    filterValues.length === 1 && filterValues[0].values.length === 1;

  const initialValue = filterValues[0].values[0];

  const isInitialState =
    isFirstLine &&
    !(Object.keys(initialValue) as Array<keyof typeof initialValue>)
      .filter((key) => !["id", "operator"].includes(key))
      .some((key) => !!initialValue[key]);

  const { addAnd, addOr, onChangeItem, removeOr, resetFilter } = useFilter({
    filterValues,
    onFilterChange: handleChangeFilter,
    onResetFilter,
  });

  return (
    <Box width="100%">
      {filterValues.map((filterGroup, filterGroupIndex) => (
        <Fragment key={filterGroup.id}>
          <Stack
            alignItems="center"
            borderRadius="4px"
            boxShadow={3}
            width="100%"
          >
            {filterGroup.values.map(
              ({ id, value, column, operator }, index) => (
                <FilterItem
                  key={id}
                  index={index}
                  isLoading={isLoading}
                  fields={fields}
                  error={error}
                  filterGroupId={filterGroup.id}
                  addOr={addOr}
                  removeOr={removeOr}
                  filterItem={{ id, column, operator, value }}
                  handleChangeInput={onChangeItem}
                  isFirstLine={isFirstLine}
                />
              )
            )}
          </Stack>
          <Connector
            text={
              filterGroupIndex < filterValues.length - 1 ? "AND" : undefined
            }
          />
          {filterGroupIndex === filterValues.length - 1 && (
            <ButtonFilterGroup
              isLoading={isLoading}
              isInitialState={isInitialState}
              addAnd={addAnd}
              resetFilter={resetFilter}
            />
          )}
        </Fragment>
      ))}
    </Box>
  );
}
