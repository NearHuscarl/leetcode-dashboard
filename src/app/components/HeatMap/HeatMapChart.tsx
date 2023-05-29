import {
  HeatMapDatum,
  HeatMapSerie,
  ResponsiveHeatMap,
  TooltipProps,
} from "@nivo/heatmap";
import { transform } from "framer-motion";
import Stack from "@mui/material/Stack";
import grey from "@mui/material/colors/grey";
import useTheme from "@mui/material/styles/useTheme";
import { formatDate } from "app/helpers/date";
import { ChartTooltip } from "../ChartTooltip";
import { primaryColor } from "app/provider/ThemeProvider";

const interpolator = transform(
  [0, 0.5, 1],
  [primaryColor[50], primaryColor[500], primaryColor[900]]
);

const CustomTooltip = (props: TooltipProps<HeatMapDatum>) => {
  const { serieId, data, color } = props.cell;
  const [startHour, endHour] = serieId.split("_");
  const hourStart = new Date(0, 0, 0, parseInt(startHour, 10));
  const hourEnd = new Date(0, 0, 0, parseInt(endHour, 10));

  return (
    <ChartTooltip>
      <ChartTooltip.Date style={{ marginBottom: 4 }}>
        {formatDate(hourStart, "h aa")} {" - "} {formatDate(hourEnd, "h aa")},{" "}
        {data.x}
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
          <span
            style={{
              color: data.y === 0 ? grey[400] : "inherit",
              fontWeight: 600,
            }}
          >
            {data.y}
          </span>{" "}
          Reviews
        </ChartTooltip.Text>
      </Stack>
    </ChartTooltip>
  );
};

type THeatMapProps = {
  data: HeatMapSerie<HeatMapDatum, {}>[];
};

export const HeatMapChart = (props: THeatMapProps) => {
  const { data } = props;
  const theme = useTheme();

  return (
    <ResponsiveHeatMap
      data={data}
      margin={{ top: 20, right: 70, bottom: 20, left: 60 }}
      theme={{
        textColor: theme.chart.legend.color,
      }}
      tooltip={CustomTooltip}
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
