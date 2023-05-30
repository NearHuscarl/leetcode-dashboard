import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { useTheme } from "@mui/material";
import { TScatterPlotRawSerie } from "./scatterPlotData";
import { MSS } from "app/settings";
import { ScatterPlotNode } from "./ScatterPlotNode";

type TScatterPlotProps = {
  data: TScatterPlotRawSerie[];
};

export const ScatterPlotChart = (props: TScatterPlotProps) => {
  const { data } = props;
  const theme = useTheme();

  return (
    <ResponsiveScatterPlot
      data={data}
      theme={{
        textColor: theme.chart.legend.color,
      }}
      margin={{ top: 20, right: 30, bottom: 25, left: 40 }}
      xScale={{
        type: "symlog",
        min: -MSS.threeMonths,
        max: MSS.oneYear,
        constant: MSS.oneDay,
      }}
      nodeSize={8}
      yScale={{ type: "linear", min: 0 }}
      blendMode="multiply"
      nodeComponent={ScatterPlotNode}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        tickValues: [
          -MSS.threeMonths,
          -MSS.oneMonth,
          -MSS.oneWeek,
          -MSS.oneDay,
          0,
          MSS.oneDay,
          MSS.oneWeek,
          MSS.oneMonth,
          MSS.threeMonths,
          MSS.oneYear,
        ],
        format: (value) => {
          const ms = value as number;

          if (ms === 0) {
            return "0";
          }

          if (Math.abs(ms) < MSS.oneDay) {
            return `${Math.round(ms / MSS.oneHour)}h`;
          } else if (Math.abs(ms) < MSS.oneMonth) {
            return `${Math.round(ms / MSS.oneDay)}d`;
          } else if (Math.abs(ms) < MSS.oneYear) {
            return `${Math.round((ms / MSS.oneMonth) * 10) / 10}m`;
          } else {
            return `${Math.round(ms / MSS.oneYear)}y`;
          }
        },
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
        tickValues: 4,
      }}
      gridYValues={4}
    />
  );
};
