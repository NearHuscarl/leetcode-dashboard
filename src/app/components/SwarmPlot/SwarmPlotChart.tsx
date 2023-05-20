import { ResponsiveSwarmPlot } from "@nivo/swarmplot";
import { TSwarmPlotDatum } from "./swarmPlotData";
import { getAcRateColor } from "../AcRateIndicator";
import { useTheme } from "@mui/material";
import { TCardType } from "app/helpers/card";

type TSwarmPlotChartProps = {
  data: TSwarmPlotDatum[];
  groups: TCardType[];
};

export const SwarmPlotChart = (props: TSwarmPlotChartProps) => {
  const { data, groups } = props;
  const theme = useTheme();

  return (
    <ResponsiveSwarmPlot
      data={data}
      groups={groups}
      theme={{
        textColor: theme.chart.legend.color,
        fontSize: theme.chart.legend.fontSize,
      }}
      colors={({ data }) => getAcRateColor(data.acRate)}
      valueScale={{ type: "linear", min: 0, max: 1, reverse: false }}
      size={{
        key: "volume",
        values: [1, 6],
        sizes: [6, 20],
      }}
      forceStrength={4}
      simulationIterations={100}
      borderColor={{
        from: "color",
        modifiers: [
          ["darker", 0.6],
          ["opacity", 0.5],
        ],
      }}
      margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
      axisTop={{
        tickSize: 0,
        tickPadding: 10,
      }}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
      }}
      axisRight={{
        tickSize: 0,
        legend: "Ease Rate",
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 0,
        legend: "Ease Rate",
        legendPosition: "middle",
        legendOffset: -40,
      }}
    />
  );
};
