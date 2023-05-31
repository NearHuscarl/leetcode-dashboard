import { SxProps } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { useSelector } from "app/store/setup";
import { TDateView, filterActions } from "app/store/filterSlice";

const options: { value: TDateView; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
];

export const CardTypeBarFilter = ({ sx }: { sx: SxProps }) => {
  const dateView = useSelector((state) => state.filter.cardTypeBar.dateView);
  const dispatch = useDispatch();

  return (
    <TextField
      select
      sx={{ width: 120, ...sx }}
      value={dateView}
      onChange={(e) =>
        dispatch(filterActions.setCardTypeBarDate(e.target.value as any))
      }
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
