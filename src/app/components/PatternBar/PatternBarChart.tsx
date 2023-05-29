import { ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { TBarDatum, TPattern, patternShortNames } from "./patternBarData";
import { TCardType } from "app/helpers/card";

type TPatternBarChartProps = {
  data: TBarDatum[];
};

const keys = ["Mature", "Young", "Learning", "Unsolved"];

export const PatternBarChart = (props: TPatternBarChartProps) => {
  const { data } = props;
  const theme = useTheme();

  return (
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy="pattern"
      theme={{
        textColor: theme.chart.legend.color,
      }}
      colors={({ id }) => {
        if (id === "Unsolved") {
          return theme.palette.primary.color[50];
        }
        return theme.anki.cardType[id as TCardType];
      }}
      margin={{ top: 10, right: 90, bottom: 25, left: 25 }}
      groupMode="stacked"
      valueScale={{ type: "linear", min: 0 }}
      indexScale={{ type: "band", round: true }}
      padding={0.6}
      gridYValues={4}
      axisLeft={{
        tickSize: 0,
        tickPadding: 5,
        tickValues: 4,
      }}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        format: (value) => patternShortNames[value as TPattern],
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
