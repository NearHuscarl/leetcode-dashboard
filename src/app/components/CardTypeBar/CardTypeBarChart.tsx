import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { TBarDatum, cardTypes } from "./cardTypeBarData";
import { getCardTypeColor } from "app/helpers/card";

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
      colors={({ id }) => getCardTypeColor(id as any)}
      margin={{ top: 50, right: 130, bottom: 40, left: 60 }}
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
