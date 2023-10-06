import { Add, Delete, RestartAlt, Report } from "@mui/icons-material";
import {
  Box,
  Button,
  SelectChangeEvent,
  Skeleton,
  Stack,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import { ChangeEvent, Fragment, useState } from "react";

import { OperatorConstant } from "../../constants/filterConstants";
import {
  INITIAL_FILTER_OPTION_STATE,
  INITIAL_FILTER_OPTION_VALUE,
} from "../../constants/initialFilterValues";
import { OperatorEnum } from "../../enums/OperatorEnum";
import {
  IAndFilters,
  IOrFilters,
  OnFilterFunc,
} from "../../interfaces/filterInterfaces";
import { IOptions } from "../../interfaces/formInterfaces";
import { LineSkeleton } from "../feedback/Skeleton";
import { Select } from "../form/Select";
import { Tooltip } from "../feedback/Tooltip";
import { Connector } from "../shared/Connector";

type CustomEvent<T> =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | SelectChangeEvent<T>;

export interface IFilterError {
  id: string;
  message: string;
}

interface IFilterProps {
  loading: boolean;
  onFilter: OnFilterFunc;
  onResetFilter: () => void;
  fields?: IOptions[];
  error?: IFilterError;
}

interface IChangeItemParams<T> {
  e: CustomEvent<T>;
  id: string;
  parentId: string;
  field: keyof IOrFilters;
}

const FULL_WIDTH = "calc(100% - 40px)" as const;

export function Filter({
  loading,
  onFilter,
  fields,
  error,
  onResetFilter,
}: IFilterProps) {
  const [filterOptions, setFilterOptions] = useState<IAndFilters[]>([
    INITIAL_FILTER_OPTION_STATE(),
  ]);

  const isFirstLine =
    filterOptions.length === 1 && filterOptions[0].values.length === 1;
  const initialValue = filterOptions[0].values[0];
  const isInitialState =
    isFirstLine &&
    !(Object.keys(initialValue) as Array<keyof typeof initialValue>)
      .filter((key) => !["id", "operator"].includes(key))
      .some((key) => !!initialValue[key]);

  function addOr(id: string) {
    setFilterOptions((currentValues) => {
      const updateArray = [...currentValues];
      const boxIndex = updateArray.findIndex((box) => box.id === id);
      updateArray[boxIndex] = {
        id,
        values: [
          ...updateArray[boxIndex].values,
          INITIAL_FILTER_OPTION_VALUE(),
        ],
      };
      return updateArray;
    });
  }

  function addAnd() {
    setFilterOptions((currentValues) => {
      return [...currentValues, INITIAL_FILTER_OPTION_STATE()];
    });
  }
  function removeOr(parentId: string, id: string) {
    if (isInitialState) {
      return;
    }
    setFilterOptions((currentValue) => {
      const updateArray = [...currentValue];
      const boxIndex = updateArray.findIndex((box) => box.id === parentId);
      if (updateArray[boxIndex].values.length === 1) {
        updateArray.splice(boxIndex, 1);
        return updateArray;
      }
      updateArray[boxIndex].values = updateArray[boxIndex].values.filter(
        (value) => value.id !== id
      );
      return updateArray;
    });
  }

  function onChangeItem({ e, field, parentId, id }: IChangeItemParams<string>) {
    setFilterOptions((currentValue) => {
      const updatedFilters = [...currentValue];
      const parentIndex = updatedFilters.findIndex(
        (box) => box.id === parentId
      );
      if (parentIndex === -1) {
        console.error(`Parent object with ID ${parentId} not found.`);
        return currentValue;
      }
      const targetIndex = updatedFilters[parentIndex].values.findIndex(
        (item) => item.id === id
      );
      if (targetIndex === -1) {
        console.error(`Target object with ID ${id} not found.`);
        return currentValue;
      }
      const updatedTarget = {
        ...updatedFilters[parentIndex].values[targetIndex],
      };

      if (field === "operator") {
        updatedTarget[field] = e.target.value as OperatorEnum;
      } else {
        updatedTarget[field] = e.target.value;
      }

      updatedFilters[parentIndex].values[targetIndex] = updatedTarget;

      return updatedFilters;
    });
  }
  const debouncedOnChangeItem = debounce(() => onFilter(filterOptions), 1000);

  function handleChangeInput(args: IChangeItemParams<string>) {
    onChangeItem(args);
    if (args.e.target instanceof HTMLInputElement) {
      return debouncedOnChangeItem();
    }
    onFilter(filterOptions);
  }

  function resetFilter() {
    onResetFilter();
    setFilterOptions([INITIAL_FILTER_OPTION_STATE()]);
  }

  return (
    <Box width="100%">
      {filterOptions.map((filterGroup, filterGroupIndex) => (
        <Fragment key={filterGroup.id}>
          <Stack
            alignItems="center"
            borderRadius="4px"
            boxShadow={3}
            width="100%"
          >
            {filterGroup.values.map(
              ({ id, value, column, operator }, index) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const skeleton = document.getElementById(id);

                return (
                  <Stack key={id} width="100%">
                    <Stack
                      width="100%"
                      direction="row"
                      gap="10px"
                      padding="20px"
                      alignItems="center"
                      maxWidth={FULL_WIDTH}
                      spacing="5px"
                    >
                      {loading ? (
                        <LineSkeleton />
                      ) : (
                        <Fragment>
                          {index > 0 && (
                            <Typography variant="h6" color="primary">
                              OR
                            </Typography>
                          )}
                          <Select
                            error={error && error?.id === id}
                            label="Left Options"
                            options={fields}
                            value={column}
                            onChange={(e) =>
                              handleChangeInput({
                                e: e as SelectChangeEvent<string>,
                                id,
                                parentId: filterGroup.id,
                                field: "column",
                              })
                            }
                          />

                          <Select
                            error={error && error?.id === id}
                            label="Operator"
                            options={OperatorConstant}
                            value={operator}
                            onChange={(e) =>
                              handleChangeInput({
                                e: e as SelectChangeEvent<string>,
                                id,
                                parentId: filterGroup.id,
                                field: "operator",
                              })
                            }
                          />
                          <TextField
                            error={error && error?.id === id}
                            id="outlined-basic"
                            variant="outlined"
                            fullWidth
                            label="Value"
                            value={value}
                            onChange={(e) =>
                              handleChangeInput({
                                e,
                                id,
                                parentId: filterGroup.id,
                                field: "value",
                              })
                            }
                          />
                          <Tooltip
                            arrow
                            title={
                              error && error?.id === id
                                ? error.message
                                : "No errors"
                            }
                          >
                            <Report color={error?.id ? "error" : "primary"} />
                          </Tooltip>

                          <Add
                            cursor="pointer"
                            onClick={() => addOr(filterGroup.id)}
                            color="primary"
                            onMouseOver={() => {
                              // using document to avoid renders from useState
                              if (skeleton?.style) {
                                skeleton.style.maxHeight = "100%";
                                skeleton.style.padding = "20px";
                              }
                            }}
                            onMouseOut={() => {
                              if (skeleton?.style) {
                                skeleton.style.maxHeight = "0px";
                                skeleton.style.padding = "0px";
                              }
                            }}
                          />

                          <Delete
                            cursor={isFirstLine ? "not-allowed" : "pointer"}
                            onClick={() => removeOr(filterGroup.id, id)}
                            color={isFirstLine ? "disabled" : "warning"}
                          />
                        </Fragment>
                      )}
                    </Stack>

                    <Box
                      id={id}
                      overflow="hidden"
                      width="100%"
                      maxWidth={FULL_WIDTH}
                      maxHeight="0px"
                      padding="0px"
                      sx={{ transition: "max-height, padding 0.3s" }}
                    >
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="60px"
                      />
                    </Box>
                  </Stack>
                );
              }
            )}
          </Stack>
          <Connector />

          {filterGroupIndex === filterOptions.length - 1 && (
            <Stack spacing="10px" direction="row">
              <Button
                disabled={loading}
                onClick={addAnd}
                startIcon={<Add />}
                variant="outlined"
              >
                AND
              </Button>
              <Button
                disabled={isInitialState || loading}
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
