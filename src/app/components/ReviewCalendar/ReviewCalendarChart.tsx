import {
  CalendarDatum,
  DateOrString,
  ResponsiveCalendar,
} from "@nivo/calendar";
import grey from "@mui/material/colors/grey";

type TReviewCalendarChartProps = {
  data: CalendarDatum[];
  from: DateOrString;
  to: DateOrString;
  color: Record<number, string>;
  label: string;
};

export const ReviewCalendarChart = (props: TReviewCalendarChartProps) => {
  const { data, from, to, color, label } = props;

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
      minValue={0}
      maxValue={9}
      colors={Object.values(color)}
      yearLegend={() => label}
      margin={{ top: 30, right: 30, bottom: 0, left: 30 }}
      monthBorderColor="#ffffff"
      dayBorderWidth={2}
      dayBorderColor="#ffffff"
    />
  );
};
