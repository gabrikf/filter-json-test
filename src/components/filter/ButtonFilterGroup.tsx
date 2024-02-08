import { Add, RestartAlt } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

interface IButtonFilterGroupProps {
  isLoading: boolean;
  isInitialState: boolean;
  addAnd: () => void;
  resetFilter: () => void;
}

export function ButtonFilterGroup({
  addAnd,
  isInitialState,
  isLoading,
  resetFilter,
}: IButtonFilterGroupProps) {
  return (
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
  );
}
