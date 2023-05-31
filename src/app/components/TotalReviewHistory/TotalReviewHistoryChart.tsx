import Stack from "@mui/material/Stack";
import grey from "@mui/material/colors/grey";
import green from "@mui/material/colors/green";
import { useTheme } from "@mui/material";
import { ResponsiveLine, Serie, SliceTooltipProps } from "@nivo/line";
import { Theme } from "@nivo/core";
import { getTickFormattedDate } from "app/helpers/chart";
import { theme } from "app/provider/ThemeProvider";
import { ChartTooltip } from "../ChartTooltip";
import { TLineDatum } from "./totalReviewHistoryData";

const legendTextStyle: Partial<React.CSSProperties> = {
  fill: theme.chart.legend.color,
  fontSize: theme.chart.legend.fontSize,
};

const chartTheme: Theme = {
  axis: {
    ticks: { text: legendTextStyle },
    legend: { text: legendTextStyle },
  },
};

const CustomTooltip = (props: SliceTooltipProps) => {
  const { slice } = props;

  return (
    <ChartTooltip>
      <ChartTooltip.Date style={{ marginBottom: 6 }}>
        {slice.points[0].data.xFormatted}
      </ChartTooltip.Date>
      <Stack gap={0.2}>
        {slice.points.map(({ serieId, data, color }) => {
          const datum = data as TLineDatum;

          return (
            <div
              key={serieId}
              style={{
                display: "flex",
                gap: 4,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ChartTooltip.Text style={{ color, width: 100 }}>
                {serieId}
              </ChartTooltip.Text>
              <ChartTooltip.Number
                dimZero
                style={{ width: 20, textAlign: "right" }}
              >
                {data.y as number}
              </ChartTooltip.Number>
              <ChartTooltip.Text
                style={{
                  padding: "0.5px 4px",
                  fontWeight: 400,
                  borderRadius: 4,
                  backgroundColor: datum.diff === 0 ? grey[100] : green[50],
                  color: datum.diff === 0 ? grey[400] : green[600],
                }}
              >
                +{datum.diff}
              </ChartTooltip.Text>
            </div>
          );
        })}
      </Stack>
    </ChartTooltip>
  );
};

type TTotalReviewHistoryChartProps = {
  data: Serie[];
};

export const TotalReviewHistoryChart = (
  props: TTotalReviewHistoryChartProps
) => {
  const { data } = props;
  const daysRecord = data[0]?.data.length;
  const theme = useTheme();

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 20, right: 20, bottom: 25, left: 30 }}
      curve="basis"
      theme={chartTheme}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
      }}
      enableSlices="x"
      sliceTooltip={CustomTooltip}
      colors={(data) => {
        switch (data.id) {
          case "Reviews":
            return theme.palette.primary.main;
          case "Problems":
            return theme.palette.secondary.main;
        }

        return grey[500];
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 0,
        legendPosition: "middle",
        renderTick(props) {
          const { x, y, value } = props;

          const formattedDate = getTickFormattedDate(value, daysRecord);

          if (!formattedDate) {
            return <></>;
          }

          return (
            <text x={x - 10} y={y + 20} {...(legendTextStyle as any)}>
              {formattedDate}
            </text>
          );
        },
      }}
      axisLeft={{
        tickSize: 0,
        tickValues: 4,
      }}
      // enableArea
      // areaOpacity={0.9}
      lineWidth={3}
      enableGridX={false}
      gridYValues={5}
      enablePoints={false}
      useMesh
    />
  );
};
