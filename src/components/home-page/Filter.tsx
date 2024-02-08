import { Add, RestartAlt } from "@mui/icons-material";
import { Box, Button, SelectChangeEvent, Stack } from "@mui/material";
import { ChangeEvent, Fragment } from "react";

import {
  INITIAL_FILTER_OPTION_STATE,
  INITIAL_FILTER_OPTION_VALUE,
} from "../../constants/initialFilterValues";
import { IAndFilters, IOrFilters } from "../../interfaces/filterInterfaces";
import { IOptions } from "../../interfaces/formInterfaces";
import { deepClone } from "../../utils/functions/deepClone";
import { Connector } from "../shared/Connector";
import { OrFilter } from "./OrFilter";

type CustomEvent<T> =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent<T>;

export interface IFilterError {
  id: string;
  message: string;
}

interface IFilterProps {
  filterValues: IAndFilters[];
  handleChangeFilter: (
    newValues: IAndFilters[],
    shouldRefilter?: boolean
  ) => void;
  isLoading: boolean;
  onResetFilter: () => void;
  fields?: IOptions[];
  error?: IFilterError;
}

export interface IChangeItemParams<T> {
  e: CustomEvent<T>;
  id: string;
  parentId: string;
  field: keyof IOrFilters;
}

export function Filter({
  isLoading,
  fields,
  error,
  onResetFilter,
  filterValues,
  handleChangeFilter,
}: IFilterProps) {
  const isFirstLine =
    filterValues.length === 1 && filterValues[0].values.length === 1;

  const initialValue = filterValues[0].values[0];

  const isInitialState =
    isFirstLine &&
    !(Object.keys(initialValue) as Array<keyof typeof initialValue>)
      .filter((key) => !["id", "operator"].includes(key))
      .some((key) => !!initialValue[key]);

  function addOr(id: string) {
    const updateArray = deepClone(filterValues);
    const boxIndex = updateArray.findIndex((box) => box.id === id);
    if (boxIndex === -1) {
      console.error(`Box with ID ${id} not found.`);
      return handleChangeFilter(updateArray);
    }
    updateArray[boxIndex] = {
      id,
      values: [...updateArray[boxIndex].values, INITIAL_FILTER_OPTION_VALUE()],
    };
    handleChangeFilter(updateArray);
  }

  function addAnd() {
    const currentValues = deepClone(filterValues);
    handleChangeFilter([...currentValues, INITIAL_FILTER_OPTION_STATE()]);
  }
  function removeOr(parentId: string, id: string) {
    if (isFirstLine) {
      return;
    }
    const updateArray = deepClone(filterValues);
    const boxIndex = updateArray.findIndex((box) => box.id === parentId);
    if (updateArray[boxIndex].values.length === 1) {
      const filteredArray = updateArray.filter((box) => box.id !== parentId);

      return handleChangeFilter(filteredArray, true);
    }
    updateArray[boxIndex].values = updateArray[boxIndex].values.filter(
      (value) => value.id !== id
    );
    handleChangeFilter(updateArray, true);
  }

  function onChangeItem({ e, field, parentId, id }: IChangeItemParams<string>) {
    const updatedFilters = deepClone(filterValues);
    const parentIndex = updatedFilters.findIndex((box) => box.id === parentId);
    if (parentIndex === -1) {
      console.error(`Parent object with ID ${parentId} not found.`);
      return handleChangeFilter(updatedFilters);
    }
    const targetIndex = updatedFilters[parentIndex].values.findIndex(
      (item) => item.id === id
    );
    if (targetIndex === -1) {
      console.error(`Target object with ID ${id} not found.`);
      return handleChangeFilter(updatedFilters);
    }
    const updatedTarget = {
      ...updatedFilters[parentIndex].values[targetIndex],
    };

    updatedFilters[parentIndex].values[targetIndex] = {
      ...updatedTarget,
      [field]: e.target.value,
    };

    handleChangeFilter(updatedFilters, true);
  }

  function resetFilter() {
    onResetFilter();
    handleChangeFilter([INITIAL_FILTER_OPTION_STATE()]);
  }

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
                <OrFilter
                  key={id}
                  index={index}
                  isLoading={isLoading}
                  fields={fields}
                  error={error}
                  filterGroupId={filterGroup.id}
                  addOr={addOr}
                  removeOr={removeOr}
                  orFilter={{ id, column, operator, value }}
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
            <Stack spacing="10px" direction="row">
              <Button
                disabled={isLoading}
                onClick={addAnd}
                startIcon={<Add />}
                variant="outlined"
              >
                AND
              </Button>
              <Button
                disabled={isInitialState || isLoading}
                onClick={resetFilter}
                startIcon={<RestartAlt />}
                variant="contained"
              >
                RESET
              </Button>
            </Stack>
          )}
        </Fragment>
      ))}
    </Box>
  );
}
