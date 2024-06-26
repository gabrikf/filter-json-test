import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DataType } from "../../App";

import { Fragment } from "react";
import { Chip, Stack, Typography } from "@mui/material";
import { TableSkeleton } from "./TableSkeleton";

interface ITableProps {
  isLoading: boolean;
  rows: DataType;
  columns: GridColDef[];
  total: number;
  totalFiltered: number;
}

const DEFAULT_PAGE_SIZE_ = 10 as const;

export function Table({
  columns,
  rows,
  isLoading,
  total,
  totalFiltered,
}: ITableProps) {
  if (isLoading) {
    return <TableSkeleton rows={DEFAULT_PAGE_SIZE_} />;
  }
  return (
    <Fragment>
      <Typography variant="h5">Result</Typography>
      <Stack direction="row" spacing="5px">
        <Chip label={"Total: " + total} />
        <Chip label={"Filtered: " + totalFiltered} color="primary" />
      </Stack>
      <DataGrid
        sx={{ width: "100%", maxHeight: "500px", minHeight: "500px" }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: DEFAULT_PAGE_SIZE_ },
          },
        }}
        pageSizeOptions={[10, 50, 100]}
      />
    </Fragment>
  );
}
