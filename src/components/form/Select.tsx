import {
  Select as MUISelect,
  FormControl,
  InputLabel,
  MenuItem,
  SelectProps,
} from "@mui/material";
import { IOptions } from "../../interfaces/formInterfaces";

interface ISelectProps extends SelectProps {
  options?: IOptions[];
  label: string;
}

export function Select({ options, label, ...props }: ISelectProps) {
  return (
    <FormControl fullWidth>
      <InputLabel id="select-label-id">{label}</InputLabel>
      <MUISelect
        labelId="select-label-id"
        fullWidth
        label={label}
        variant="outlined"
        {...props}
      >
        {options?.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </MUISelect>
    </FormControl>
  );
}
