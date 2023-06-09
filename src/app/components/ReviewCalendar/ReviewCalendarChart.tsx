import { useDispatch } from "react-redux";
import groupBy from "lodash/groupBy";
import {
  CalendarDatum,
  CalendarTooltipProps,
  DateOrString,
  ResponsiveCalendar,
} from "@nivo/calendar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import grey from "@mui/material/colors/grey";
import red from "@mui/material/colors/red";
import amber from "@mui/material/colors/amber";
import cyan from "@mui/material/colors/cyan";
import {
  EMPTY_CURRENT,
  EMPTY_IN_FUTURE,
  TCalendarData,
  TCategory,
} from "./reviewCalendarData";
import { formatDisplayedDate } from "app/helpers/date";
import { useLeetcodeProblems } from "app/api/leetcode";
import { AcRateIndicator } from "../AcRateIndicator";
import { ChartTooltip } from "../ChartTooltip";
import { globalActions } from "app/store/globalSlice";

const newColors = [
  amber[50],
  amber[200],
  amber[300],
  amber[400],
  amber[500],
  amber[600],
  amber[700],
  amber[800],
  amber[900],
] as const;

const reviewColors = [
  cyan[50],
  cyan[200],
  cyan[300],
  cyan[400],
  cyan[500],
  cyan[600],
  cyan[700],
  cyan[800],
  cyan[900],
] as const;

const redColors = [
  red[900],
  red[800],
  red[700],
  red[600],
  red[500],
  red[400],
  red[300],
  red[200],
  red[100],
] as string[];

//  -10           -1        0       1            10
// [red900, ..., red100, grey200, color50, ..., color900]
// [10 ---> 1 deadlines] [Future] [0 -------> 10 reviews]
redColors.push(grey[200]);

const cat2Color = {
  New: amber[500],
  Review: cyan[500],
  Due: red[500],
};

const cat2TootlipTitle = {
  New: "New Problems Solved",
  Review: "Reviews",
  Due: "Deadlines",
};

const CustomTooltip = (props: CalendarTooltipProps) => {
  const data = (props as any).data as TCalendarData;
  let { value, day, category } = data;
  const { data: leetcodes = {} } = useLeetcodeProblems();

  if (value === EMPTY_IN_FUTURE || value === EMPTY_CURRENT) return null;
  if (value > 1) value--;
  if (value < 0) value = -value;

  const color = cat2Color[category];
  const group = groupBy(data.stats, (s) => s.category);

  return (
    <ChartTooltip>
      <ChartTooltip.Date>
        {formatDisplayedDate(new Date(day))}
      </ChartTooltip.Date>
      {Object.keys(group).map((category2) => {
        const category = category2 as TCategory;
        return (
          <>
            <ChartTooltip.Caption style={{ marginBottom: 4, color }}>
              {group[category].length} {cat2TootlipTitle[category]}
            </ChartTooltip.Caption>
            {group[category].map(({ id }) => (
              <Stack key={id} gap={1.2} direction="row" alignItems="baseline">
                <AcRateIndicator
                  value={leetcodes[id]?.acRate}
                  width={40}
                  height={7}
                />
                <ChartTooltip.Text style={{ flex: 1 }}>
                  {leetcodes[id]?.title}
                </ChartTooltip.Text>
              </Stack>
            ))}
          </>
        );
      })}
    </ChartTooltip>
  );
};

type TReviewCalendarChartProps = {
  data: CalendarDatum[];
  from: DateOrString;
  to: DateOrString;
  label: "New" | "Review";
};
export const ReviewCalendarChart = (props: TReviewCalendarChartProps) => {
  const { data, from, to, label } = props;
  const colors = label === "New" ? newColors : reviewColors;
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        "& g > rect": {
          cursor: "pointer",
        },
      }}
    >
      <ResponsiveCalendar
        data={data}
        theme={{
          textColor: theme.chart.legend.color,
        }}
        from={from}
        to={to}
        emptyColor="#eeeeee"
        minValue={-9}
        maxValue={9}
        colors={redColors.concat(colors)}
        onClick={(d) => {
          const datum = (d as any).data as TCalendarData;
          if (datum.stats.length === 0) return;
          dispatch(
            globalActions.openProblems({
              ids: datum.stats.map((s) => s.id),
              column: "due",
            })
          );
        }}
        yearLegend={() => label}
        margin={{ top: 20, right: 0, bottom: 7, left: 10 }}
        tooltip={CustomTooltip}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
      />
    </Box>
  );
};
