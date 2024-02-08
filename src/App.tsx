import {
  Alert,
  Snackbar,
  Stack,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useState } from "react";
import { FilterGroup, IFilterError } from "./components/filter/FilterGroup";
import { Table } from "./components/table/Table";
import { INITIAL_FILTER_OPTION_STATE } from "./constants/initialFilterValues";
import { FilterError } from "./helpers/errors";
import {
  IFilterGroup,
  IOnChangeFilterParams,
  OnFilterChangeFunction,
} from "./interfaces/filterInterfaces";
import { convertToOptions } from "./utils/functions/convertToOptions";
import { applyComplexFilters } from "./utils/functions/filter";
import { flatArray } from "./utils/functions/flatValues";

export type DataItem = Record<string, string | number | boolean>;
export type DataType = DataItem[];

interface IError {
  urlError?: boolean;
  filterError?: IFilterError;
  isToastVisible?: boolean;
}

function App() {
  const [filterOptions, setFilterOptions] = useState<IFilterGroup[]>([
    INITIAL_FILTER_OPTION_STATE(),
  ]);
  const [data, setData] = useState<DataType>([]);
  const [filteredData, setFilteredData] = useState<DataType>([]);
  const [error, setError] = useState<IError>();
  const [isLoading, setIsLoading] = useState(false);

  async function getData(url: string) {
    setIsLoading(true);
    try {
      if (url) {
        const response = await axios.get<DataType>(url);
        const flattedValues = flatArray(response.data);
        setData(flattedValues);
        setFilteredData(flattedValues);
      }
      setError((currentValues) => ({ ...currentValues, urlError: false }));
    } catch (err) {
      setError((currentValues) => ({ ...currentValues, urlError: true }));
    } finally {
      setIsLoading(false);
    }
  }
  const deboucedGetData = debounce(getData, 500);

  const onFilter = useCallback(
    (filterValues: IFilterGroup[]) => {
      try {
        setError((currentValues) => ({
          ...currentValues,
          filterError: undefined,
        }));

        return setFilteredData(applyComplexFilters(data, filterValues));
      } catch (err) {
        setError((currentValues) => {
          if (err instanceof FilterError) {
            return {
              ...currentValues,
              isToastVisible: true,
              filterError: {
                id: err.id,
                message: err.message,
              },
            };
          }
        });
      }
    },
    [data, setError]
  );

  const handleChangeFilter = useCallback<OnFilterChangeFunction>(
    ({ newValues, shouldRefilter = true }: IOnChangeFilterParams) => {
      setFilterOptions(newValues);
      if (shouldRefilter) {
        onFilter(newValues);
      }
    },
    [onFilter]
  );

  const keys = Object.keys(data[0] ?? []);
  const columns: GridColDef[] = keys.map((key) => {
    return {
      field: key,
      headerName: key,
      width: window.screen.width / keys.length - 20,
    };
  });

  return (
    <Stack
      spacing={2}
      p="20px 50px"
      width="full"
      height="100vh"
      alignItems="start"
    >
      <Typography variant="h4">Condition Builder</Typography>
      <TextField
        error={error?.urlError}
        fullWidth
        id="outlined-basic"
        label={error?.urlError ? "Wrong Url" : "Url"}
        placeholder="Insert here the url..."
        variant="outlined"
        onChange={(e) => deboucedGetData(e.target.value)}
      />
      <FilterGroup
        filterValues={filterOptions}
        handleChangeFilter={handleChangeFilter}
        fields={convertToOptions(data[0])}
        isLoading={isLoading}
        error={error?.filterError}
        onResetFilter={() => {
          setError(undefined);
          setFilteredData(data);
        }}
      />
      <Table
        columns={columns}
        rows={filteredData}
        isLoading={isLoading}
        total={data.length}
        totalFiltered={filteredData.length}
      />
      <Snackbar
        onClose={() =>
          setError((currentValues) => ({
            ...currentValues,
            isToastVisible: false,
          }))
        }
        open={!!error?.isToastVisible}
        autoHideDuration={4000}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error?.filterError?.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default App;
