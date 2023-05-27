import Stack from "@mui/material/Stack";
import { amber, grey, lightGreen, red } from "@mui/material/colors";
import { ResponsiveLine, Serie, SliceTooltipProps } from "@nivo/line";
import { Theme } from "@nivo/core";
import { theme } from "app/provider/ThemeProvider";
import { ChartTooltip } from "../ChartTooltip";

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
    <ChartTooltip>
      <ChartTooltip.Date style={{ marginBottom: 6 }}>
        {slice.points[0].data.xFormatted}
      </ChartTooltip.Date>
      <Stack gap={0.2}>
        {slice.points.map(({ serieId, data, color }) => (
          <div
            key={serieId}
            style={{
              display: "flex",
              gap: 4,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {category2Icon[serieId as keyof typeof category2Icon]}
              <ChartTooltip.Text style={{ color, width: 130 }}>
                {serieId}
              </ChartTooltip.Text>
            </div>
            <ChartTooltip.Text
              style={{
                textAlign: "right",
                fontWeight: 600,
                color: data.yFormatted === "0" ? grey[400] : "inherit",
              }}
            >
              {data.yFormatted}
            </ChartTooltip.Text>
          </div>
        ))}
      </Stack>
    </ChartTooltip>
  );
};

type TTotalReviewHistoryChartProps = {
  data: Serie[];
};

export const TotalReviewHistoryByDifficultyChart = (
  props: TTotalReviewHistoryChartProps
) => {
  const { data } = props;

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 10, bottom: 5, left: 10 }}
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
          case "Hard":
            return red[500];
          case "Medium":
            return amber[500];
          case "Easy":
            return lightGreen[500];
        }

        return grey[500];
      }}
      axisTop={null}
      axisRight={null}
      axisLeft={null}
      axisBottom={null}
      // enableArea
      // areaOpacity={0.8}
      enableGridX={false}
      enableGridY={false}
      gridYValues={5}
      enablePoints={false}
      useMesh
    />
  );
};
