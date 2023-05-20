import { HeatMapDatum, HeatMapSerie, ResponsiveHeatMap } from "@nivo/heatmap";
import { transform } from "framer-motion";
import cyan from "@mui/material/colors/cyan";
import { useTheme } from "@mui/material";
import { formatDate } from "app/helpers/date";

export const getCellColor = transform(
  [0, 5, 10],
  [cyan[50], cyan[500], cyan[900]]
);

type THeatMapProps = {
  data: HeatMapSerie<HeatMapDatum, {}>[];
};

export const HeatMapChart = (props: THeatMapProps) => {
  const { data } = props;
  const theme = useTheme();

  return (
    <ResponsiveHeatMap
      data={data}
      margin={{ top: 40, right: 90, bottom: 60, left: 90 }}
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
      borderWidth={3}
      borderColor="#ffffff"
      enableLabels={false}
    />
  );
};
