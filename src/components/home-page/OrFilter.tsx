import {
  Box,
  SelectChangeEvent,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LineSkeleton } from "../shared/feedback/Skeleton";
import { Fragment, useRef } from "react";
import { Select } from "../shared/form/Select";
import { Tooltip } from "../shared/feedback/Tooltip";
import { Add, Delete, Report } from "@mui/icons-material";
import { FULL_WIDTH } from "../../constants/fullWidth";
import { IChangeItemParams, IFilterError } from "./Filter";
import { IOrFilters } from "../../interfaces/filterInterfaces";
import { IOptions } from "../../interfaces/formInterfaces";
import { OperatorConstant } from "../../constants/filterConstants";

interface IOrFiltersProps {
  isLoading: boolean;
  index: number;
  error?: IFilterError;
  filterGroupId: string;
  fields?: IOptions[];
  orFilter: IOrFilters;
  handleChangeInput: (e: IChangeItemParams<string>) => void;
  addOr: (id: string) => void;
  removeOr: (andId: string, orId: string) => void;
  isFirstLine: boolean;
}

export function OrFilter({
  isLoading,
  index,
  error,
  filterGroupId,
  fields,
  addOr,
  removeOr,
  orFilter: { id, column, operator, value },
  handleChangeInput,
  isFirstLine,
}: IOrFiltersProps) {
  const skeleton = useRef<HTMLDivElement>(null);
  return (
    <Stack width="100%">
      <Stack
        width="100%"
        direction="row"
        gap="10px"
        padding="20px"
        alignItems="center"
        maxWidth={FULL_WIDTH}
        spacing="5px"
      >
        {isLoading ? (
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
                  parentId: filterGroupId,
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
                  parentId: filterGroupId,
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
                  parentId: filterGroupId,
                  field: "value",
                })
              }
            />
            <Tooltip
              arrow
              title={error && error?.id === id ? error.message : "No errors"}
            >
              <Report color={error?.id ? "error" : "primary"} />
            </Tooltip>

            <Add
              cursor="pointer"
              onClick={() => addOr(filterGroupId)}
              color="primary"
              onMouseOver={() => {
                // using refs to avoid renders from useState
                if (skeleton.current?.style) {
                  skeleton.current.style.maxHeight = "100%";
                  skeleton.current.style.padding = "20px";
                }
              }}
              onMouseOut={() => {
                if (skeleton.current?.style) {
                  skeleton.current.style.maxHeight = "0px";
                  skeleton.current.style.padding = "0px";
                }
              }}
            />

            <Delete
              cursor={isFirstLine ? "not-allowed" : "pointer"}
              color={isFirstLine ? "disabled" : "warning"}
              onClick={() => removeOr(filterGroupId, id)}
            />
          </Fragment>
        )}
      </Stack>

      <Box
        ref={skeleton}
        overflow="hidden"
        width="100%"
        maxWidth={FULL_WIDTH}
        maxHeight="0px"
        padding="0px"
        sx={{ transition: "max-height, padding 0.3s" }}
      >
        <Skeleton variant="rectangular" width="100%" height="60px" />
      </Box>
    </Stack>
  );
}
