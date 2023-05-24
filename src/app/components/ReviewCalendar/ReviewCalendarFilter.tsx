import { SxProps } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "app/store/setup";
import { useDispatch } from "react-redux";
import { filterActions } from "app/store/filterSlice";

const thisYear = new Date().getFullYear();
const options = [...new Array(5).keys()].map((i) => ({
  value: thisYear - i,
  label: thisYear - i,
}));

export const ReviewCalendarFilter = ({ sx }: { sx: SxProps }) => {
  const year = useSelector((state) => state.filter.calendar.year);
  const dispatch = useDispatch();

  return (
    <TextField
      select
      sx={{ width: 100, ...sx }}
      value={year}
      onChange={(e) =>
        dispatch(filterActions.setCalendarYear(e.target.value as any))
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
