import { HeatMapDatum, HeatMapSerie, ResponsiveHeatMap } from "@nivo/heatmap";
import { transform } from "framer-motion";
import cyan from "@mui/material/colors/cyan";
import { useTheme } from "@mui/material";
import { formatDate } from "app/helpers/date";

const interpolator = transform([0, 0.5, 1], [cyan[50], cyan[500], cyan[900]]);

type THeatMapProps = {
  data: HeatMapSerie<HeatMapDatum, {}>[];
};

export const HeatMapChart = (props: THeatMapProps) => {
  const { data } = props;
  const theme = useTheme();

  return (
    <ResponsiveHeatMap
      data={data}
      margin={{ top: 40, right: 70, bottom: 60, left: 50 }}
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
      colors={{
        type: "sequential",
        interpolator,
      }}
      borderWidth={3}
      borderColor="#ffffff"
      enableLabels={false}
      legends={[
        {
          anchor: "top-right",
          translateX: 40,
          translateY: 4,
          length: 120,
          thickness: 10,
          direction: "column",
          tickPosition: "after",
          ticks: 4,
          tickSize: 0,
          tickSpacing: 5,
        },
      ]}
    />
  );
};
