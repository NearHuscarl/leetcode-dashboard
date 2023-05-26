import { SxProps } from "@mui/material";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { useSelector } from "app/store/setup";
import { TDateAgoFilter, filterActions } from "app/store/filterSlice";

const options: { value: TDateAgoFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "1 week ago" },
  { value: "2week", label: "2 weeks ago" },
  { value: "month", label: "1 month ago" },
  { value: "3month", label: "3 months ago" },
];

export const HalfPieFilter = ({ sx }: { sx: SxProps }) => {
  const dateAgo = useSelector((state) => state.filter.halfPie.dateAgo);
  const dispatch = useDispatch();

  return (
    <TextField
      select
      sx={{ width: 140, ...sx }}
      value={dateAgo}
      onChange={(e) =>
        dispatch(filterActions.setHalfPieDate(e.target.value as any))
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
