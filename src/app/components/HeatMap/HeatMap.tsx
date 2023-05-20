import { ResponsiveHeatMap } from "@nivo/heatmap";
import { transform } from "framer-motion";
import cyan from "@mui/material/colors/cyan";
import { prepareChartData } from "./heatMapData";
import { useProblems } from "app/services/problems";
import { useTheme } from "@mui/material";
import { formatDate } from "app/helpers/date";

export const getCellColor = transform(
  [0, 5, 10],
  [cyan[50], cyan[500], cyan[900]]
);

export const HeatMap = () => {
  const cards = useProblems();
  const { data } = prepareChartData(cards, "all");
  const theme = useTheme();

  return (
    <ResponsiveHeatMap
      data={data}
      margin={{ top: 60, right: 90, bottom: 20, left: 90 }}
      theme={{
        textColor: theme.chart.legend.color,
      }}
      axisTop={{
        tickSize: 0,
        renderTick: () => <></>,
      }}
      axisBottom={{
        tickSize: 0,
        legendOffset: 46,
      }}
      axisLeft={{
        tickSize: 0,
        format: (value) => {
          const [startHour] = value.split("_");
          const date = new Date(0, 0, 0, startHour);

          return formatDate(date, "h aa");
        },
      }}
      colors={(cell) => {
        return getCellColor(cell.value ?? 0);
      }}
      emptyColor="#555555"
      borderWidth={2}
      borderColor="#ffffff"
      enableLabels={false}
    />
  );
};
