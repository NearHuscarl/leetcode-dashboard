import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material";
import { BarTooltipProps, ResponsiveBar } from "@nivo/bar";
import { TBarDatum, cardTypes } from "./cardTypeBarData";
import { TCardType } from "app/helpers/card";
import {
  formatDate,
  formatDisplayedDate,
  formatDisplayedDateShort,
} from "app/helpers/date";
import { TDateView } from "app/store/filterSlice";
import { ChartTooltip } from "../ChartTooltip";
import { useSelector } from "app/store/setup";

const formatChartDate = (value: number, dateView: TDateView) => {
  let formattedDate = "";

  if (dateView === "day") {
    formattedDate = formatDate(new Date(value), "E");
  }
  if (dateView === "week") {
    formattedDate = formatDate(new Date(value), "d MMM");
  }
  if (dateView === "month") {
    formattedDate = formatDate(new Date(value), "MMM");
  }
  if (dateView === "quarter") {
    formattedDate = formatDate(new Date(value), "QQQ yyyy");
  }

  return formattedDate;
};

const formatChartDateTooltip = (value: number, dateView: TDateView) => {
  let formattedDate = "";

  if (dateView === "day") {
    formattedDate = formatDisplayedDate(new Date(value));
  }
  if (dateView === "week") {
    formattedDate = formatDisplayedDateShort(new Date(value));
  }
  if (dateView === "month") {
    formattedDate = formatDate(new Date(value), "MMMM yyyy");
  }
  if (dateView === "quarter") {
    formattedDate = formatDate(new Date(value), "QQQ yyyy");
  }

  return formattedDate;
};

const CustomTooltip = (props: BarTooltipProps<TBarDatum>) => {
  const { indexValue, color, id, value } = props;
  const dateView = useSelector((state) => state.filter.cardTypeBar.dateView);

  return (
    <ChartTooltip>
      <ChartTooltip.Date style={{ marginBottom: 6 }}>
        {formatChartDateTooltip(indexValue as number, dateView)}
      </ChartTooltip.Date>
      <Stack direction="row" gap={0.5} alignItems="baseline">
        <div
          style={{
            width: 10,
            height: 10,
            backgroundColor: color,
          }}
        />
        <ChartTooltip.Text>
          {id}: <ChartTooltip.Number dimZero>{value}</ChartTooltip.Number>
        </ChartTooltip.Text>
      </Stack>
    </ChartTooltip>
  );
};

type TCardTypeBarChartProps = {
  data: TBarDatum[];
  dateView: TDateView;
};

export const CardTypeBarChart = (props: TCardTypeBarChartProps) => {
  const { data, dateView } = props;
  const theme = useTheme();

  return (
    <ResponsiveBar
      data={data}
      keys={cardTypes}
      indexBy="date"
      theme={{
        textColor: theme.chart.legend.color,
      }}
      colors={({ id }) => theme.anki.cardType[id as TCardType]}
      margin={{ top: 30, right: 90, bottom: 55, left: 20 }}
      groupMode="grouped"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      padding={0.4}
      gridYValues={4}
      tooltip={CustomTooltip}
      axisLeft={{
        tickSize: 0,
        tickPadding: 5,
        tickValues: 4,
      }}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        format: (v) => formatChartDate(v, dateView),
      }}
      labelSkipWidth={1000}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 120,
          itemWidth: 100,
          itemHeight: 20,
          symbolSize: 12,
        },
      ]}
    />
  );
};
