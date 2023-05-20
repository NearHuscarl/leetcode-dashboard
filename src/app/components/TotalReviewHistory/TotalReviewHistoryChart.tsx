import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { amber, grey, lightGreen, red } from "@mui/material/colors";
import {
  CustomLayerProps,
  ResponsiveLine,
  Serie,
  SliceTooltipProps,
} from "@nivo/line";
import { Theme } from "@nivo/core";
import { getTickFormattedDate } from "app/helpers/chart";
import { theme } from "app/provider/ThemeProvider";

const DashedLine = ({
  series,
  lineGenerator,
  xScale,
  yScale,
}: CustomLayerProps) => {
  return series.map(({ id, data, color }) => {
    const d = lineGenerator(
      data.map((d) => ({
        x: (xScale as Function)(d.data.x),
        y: (yScale as Function)(d.data.y),
      }))
    )!;

    return (
      <path
        key={id}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={4}
        style={
          (id as string).endsWith("Problems") ? { strokeDasharray: "12,3" } : {}
        }
      />
    );
  });
};

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

const createIcon = (color: string, dashed: boolean) => (
  <div
    style={{
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: `2px solid ${color}`,
      borderStyle: dashed ? "dotted" : "solid",
    }}
  />
);
const category2Icon = {
  "Easy Problems": createIcon(lightGreen[500], true),
  "Medium Problems": createIcon(amber[500], true),
  "Hard Problems": createIcon(red[500], true),
  "Easy Reviews": createIcon(lightGreen[500], false),
  "Medium Reviews": createIcon(amber[500], false),
  "Hard Reviews": createIcon(red[500], false),
};

const CustomTooltip = (props: SliceTooltipProps) => {
  const { slice } = props;

  return (
    <Card sx={{ p: 1.5 }}>
      <div
        style={{
          color: grey[500],
          fontWeight: 500,
          fontSize: 14,
          marginBottom: 6,
        }}
      >
        {slice.points[0].data.xFormatted}
      </div>
      <Stack gap={0.2}>
        {slice.points.map(({ serieId, data, color }) => (
          <div
            key={serieId}
            style={{
              fontSize: 12,
              display: "flex",
              gap: 4,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {category2Icon[serieId as keyof typeof category2Icon]}
              <div style={{ color, width: 130 }}>{serieId}</div>
            </div>
            <div style={{ textAlign: "right", fontWeight: 600 }}>
              {data.yFormatted}
            </div>
          </div>
        ))}
      </Stack>
    </Card>
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

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 40, bottom: 80, left: 30 }}
      curve="basis"
      theme={chartTheme}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
      }}
      enableSlices="x"
      sliceTooltip={CustomTooltip}
      colors={(data) => {
        switch (data.id) {
          case "Hard Reviews":
          case "Hard Problems":
            return red[500];
          case "Medium Reviews":
          case "Medium Problems":
            return amber[500];
          case "Easy Reviews":
          case "Easy Problems":
            return lightGreen[500];
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
        tickValues: 5,
      }}
      layers={[
        "grid",
        "markers",
        "axes",
        "areas",
        "crosshair",
        DashedLine,
        "points",
        "slices",
        "mesh",
        "legends",
      ]}
      // enableArea
      // areaOpacity={0.8}
      lineWidth={3}
      enableGridX={false}
      gridYValues={5}
      enablePoints={false}
      useMesh
    />
  );
};
