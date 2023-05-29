import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { TBarDatum, cardTypes } from "./cardTypeBarData";
import { TCardType } from "app/helpers/card";
import { getTickFormattedDate } from "app/helpers/chart";

type TCardTypeBarChartProps = {
  data: TBarDatum[];
};

export const CardTypeBarChart = (props: TCardTypeBarChartProps) => {
  const { data } = props;
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
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      groupMode="grouped"
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      padding={0.7}
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
          const { x, y, value } = props;
          const formattedDate = getTickFormattedDate(value + "-01", 30 * 6);

          if (!formattedDate) {
            return <></>;
          }

          return (
            <text x={x - 10} y={y + 20} {...theme.chart.legend}>
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
