import Stack from "@mui/material/Stack";
import { amber, lightGreen, red, green, grey } from "@mui/material/colors";
import { ResponsiveLine, Serie, SliceTooltipProps } from "@nivo/line";
import { theme } from "app/provider/ThemeProvider";
import { ChartTooltip } from "../ChartTooltip";
import { TLineDatum } from "./totalReviewHistoryData";
import { useMemo } from "react";

const legendTextStyle: Partial<React.CSSProperties> = {
  fill: theme.chart.legend.color,
  fontSize: theme.chart.legend.fontSize,
};

const createCustomTooltip = (tooltip: string) => (props: SliceTooltipProps) => {
  const { slice } = props;
  const total = slice.points.reduce((acc, { data }) => {
    return acc + (data.y as number);
  }, 0);

  return (
    <ChartTooltip>
      <ChartTooltip.Date style={{ marginBottom: 2 }}>
        {slice.points[0].data.xFormatted}
      </ChartTooltip.Date>
      <ChartTooltip.Caption style={{ marginBottom: 6, color: grey[500] }}>
        <span style={{ color: "black" }}>{total}</span> {tooltip}
      </ChartTooltip.Caption>
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
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <ChartTooltip.Text style={{ color, width: 100 }}>
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
  tooltip: string;
};

export const TotalReviewHistoryByDifficultyChart = (
  props: TTotalReviewHistoryChartProps
) => {
  const { data, tooltip } = props;
  const CustomTooltip = useMemo(() => createCustomTooltip(tooltip), [tooltip]);

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
      curve="basis"
      theme={{
        axis: {
          ticks: { text: legendTextStyle },
          legend: { text: legendTextStyle },
        },
      }}
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
