import {
  CalendarDatum,
  CalendarTooltipProps,
  DateOrString,
  ResponsiveCalendar,
} from "@nivo/calendar";
import grey from "@mui/material/colors/grey";
import red from "@mui/material/colors/red";
import amber from "@mui/material/colors/amber";
import cyan from "@mui/material/colors/cyan";
import Card from "@mui/material/Card";
import {
  EMPTY_CURRENT,
  EMPTY_IN_FUTURE,
  TCalendarData,
} from "./reviewCalendarData";
import { formatDisplayedDate } from "app/helpers/date";
import { useLeetcodeProblems } from "app/api/leetcode";
import { AcRateIndicator } from "../AcRateIndicator";

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

const CustomTooltipComponent = (props: CalendarTooltipProps) => {
  const data = (props as any).data as TCalendarData;
  let { value, day, category } = data;
  const { data: leetcodes = {} } = useLeetcodeProblems();

  if (value === EMPTY_IN_FUTURE || value === EMPTY_CURRENT) return null;
  if (value > 1) value--;
  if (value < 0) value = -value;

  const color = cat2Color[category];

  return (
    <Card sx={{ p: 1.5 }}>
      <div style={{ color: grey[500], fontWeight: 500, fontSize: 14 }}>
        {formatDisplayedDate(new Date(day))}
      </div>
      <div style={{ marginBottom: 4, color, fontSize: 12 }}>
        {value} {cat2TootlipTitle[category]}
      </div>
      {data.problems.map((p) => (
        <div
          key={p}
          style={{
            fontSize: 13,
            display: "flex",
            gap: 8,
            alignItems: "baseline",
          }}
        >
          <AcRateIndicator value={leetcodes[p]?.acRate} width={40} height={7} />
          <div style={{ flex: 1 }}>{leetcodes[p]?.title}</div>
        </div>
      ))}
    </Card>
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

  return (
    <ResponsiveCalendar
      // @ts-ignore
      height={120}
      data={data}
      theme={{
        textColor: grey[400],
      }}
      from={from}
      to={to}
      emptyColor="#eeeeee"
      minValue={-9}
      maxValue={9}
      colors={redColors.concat(colors)}
      yearLegend={() => label}
      margin={{ top: 30, right: 30, bottom: 0, left: 30 }}
      tooltip={CustomTooltipComponent}
      monthBorderColor="#ffffff"
      dayBorderWidth={2}
      dayBorderColor="#ffffff"
    />
  );
};
