import { amber, grey, lightGreen, red } from "@mui/material/colors";
import { CustomLayerProps, ResponsiveLine, Serie } from "@nivo/line";
import { Theme } from "@nivo/core";
import { getTickFormattedDate } from "app/helpers/chart";

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
  fill: grey[400],
  fontSize: 13,
  fontFamily: "sans-serif",
};

const chartTheme: Theme = {
  axis: {
    ticks: { text: legendTextStyle },
    legend: { text: legendTextStyle },
  },
  tooltip: {
    container: {
      fontFamily: "monospace",
    },
  },
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
      colors={[
        lightGreen[500],
        lightGreen[500],
        amber[500],
        amber[500],
        red[500],
        red[500],
      ]}
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
            <text x={x} y={y + 25} {...(legendTextStyle as any)}>
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
      enableSlices="x"
      lineWidth={3}
      enableGridX={false}
      gridYValues={5}
      enablePoints={false}
      useMesh
    />
  );
};
