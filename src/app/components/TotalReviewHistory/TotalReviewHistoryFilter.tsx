import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useSelector } from "app/store/setup";
import { useDispatch } from "react-redux";
import { TDateFilter, filterActions } from "app/store/filterSlice";
import { SxProps } from "@mui/material";

const options: { value: TDateFilter; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
  { value: "all", label: "All Time" },
];

type TTotalReviewHistoryFilterProps = {
  sx?: SxProps;
};

export const TotalReviewHistoryFilter = (
  props: TTotalReviewHistoryFilterProps
) => {
  const { sx } = props;
  const date = useSelector((state) => state.filter.lineChart.date);
  const dispatch = useDispatch();

  return (
    <TextField
      select
      sx={{ width: 120, ...sx }}
      value={date}
      onChange={(e) =>
        dispatch(filterActions.setLineChartDate(e.target.value as any))
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
