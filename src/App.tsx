import { Alert, Snackbar, Stack, TextField } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useCallback, useMemo, useState } from "react";
import { Filter, IFilterError } from "./components/Filter";
import { Table } from "./components/Table";
import { OnFilterFunc } from "./interfaces/filterInterfaces";
import { IOptions } from "./interfaces/formInterfaces";
import { applyComplexFilters } from "./utils/functions/filter";
import { flatArray } from "./utils/functions/flatValues";
import { FilterError } from "./helpers/errors";

export type DataItem = Record<string, string | number | boolean>;
export type DataType = DataItem[];

interface IError {
  urlError?: boolean;
  filterError?: IFilterError;
  isToastVisible?: boolean;
}

function App() {
  const [data, setData] = useState<DataType>([]);
  const [filteredData, setFilteredData] = useState<DataType>([]);
  const [error, setError] = useState<IError>();
  const [isLoading, setIsLoading] = useState(false);

  async function getData(url: string) {
    setIsLoading(true);
    try {
      const response = await axios.get<DataType>(url);
      const flattedValues = flatArray(response.data);
      setData(flattedValues);
      setFilteredData(flattedValues);
      setError((currentValues) => ({ ...currentValues, urlError: false }));
    } catch (err) {
      setError((currentValues) => ({ ...currentValues, urlError: true }));
    } finally {
      setIsLoading(false);
    }
  }

  const total = useMemo(() => {
    return data.length;
  }, [data.length]);

  const onFilter = useCallback<OnFilterFunc>(
    (filters) => {
      try {
        setError((currentValues) => ({
          ...currentValues,
          filterError: undefined,
        }));
        return setFilteredData(applyComplexFilters(data, filters));
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
    [data]
  );

  const keys = Object.keys(data[0] ?? []);
  const columns: GridColDef[] = keys.map((key) => {
    return {
      field: key,
      headerName: key,
      width: window.screen.width / keys.length - 20,
    };
  });

  function convertToOptions(obj?: object): IOptions[] | undefined {
    if (!obj) return;
    return Object.keys(obj)
      .filter((key) => typeof key === "string")
      .map((key) => {
        return {
          label: key,
          value: key,
        };
      });
  }
  return (
    <Stack
      spacing={2}
      p="20px 50px"
      width="full"
      height="100vh"
      alignItems="start"
    >
      <TextField
        error={error?.urlError}
        fullWidth
        id="outlined-basic"
        label={error?.urlError ? "Wrong Url" : "Url"}
        placeholder="Insert here the url..."
        variant="outlined"
        onChange={(e) => getData(e.target.value)}
      />
      <Filter
        fields={convertToOptions(data[0])}
        onFilter={onFilter}
        loading={isLoading}
        error={error?.filterError}
        onResetFilter={() => {
          setError(undefined);
          setFilteredData(data);
        }}
      />
      <Table
        columns={columns}
        rows={filteredData}
        loading={isLoading}
        total={total}
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
        autoHideDuration={6000}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error?.filterError?.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default App;
