import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "app/store/setup";
import { useDispatch } from "react-redux";
import { filterActions } from "app/store/filterSlice";

const options = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
  { value: "all", label: "All Time" },
];

export const TotalReviewHistoryFilter = () => {
  const date = useSelector((state) => state.filter.filter.date);
  const dispatch = useDispatch();

  return (
    <TextField
      select
      sx={{ width: 120 }}
      value={date}
      onChange={(e) => dispatch(filterActions.setDate(e.target.value as any))}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};
