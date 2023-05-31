import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { TBarDatum, cardTypes } from "./cardTypeBarData";
import { TCardType } from "app/helpers/card";
import { formatDate } from "app/helpers/date";
import { TDateView } from "app/store/filterSlice";

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
      margin={{ top: 30, right: 90, bottom: 55, left: 25 }}
      groupMode="grouped"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      padding={0.4}
      gridYValues={4}
      axisLeft={{
        tickSize: 0,
        tickPadding: 5,
        tickValues: 4,
      }}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        renderTick(props) {
          let { x, y, value } = props;
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

          if (!formattedDate) {
            return <></>;
          }

          return (
            <text x={x} y={y + 20} textAnchor="middle" {...theme.chart.legend}>
              {formattedDate}
            </text>
          );
        },
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
