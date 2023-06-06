import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import grey from "@mui/material/colors/grey";
import green from "@mui/material/colors/green";
import { Point, ResponsiveLine, Serie, SliceTooltipProps } from "@nivo/line";
import { theme } from "app/provider/ThemeProvider";
import { ChartTooltip } from "../ChartTooltip";
import { TLineDatum } from "./totalReviewHistoryData";
import { useMemo } from "react";
import { TDifficulty } from "app/api/leetcode";
import { globalActions } from "app/store/globalSlice";

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
          const datum = data as any as TLineDatum;
          const diff = datum.leetcodeIds.length;

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
                  backgroundColor: diff === 0 ? grey[100] : green[50],
                  color: diff === 0 ? grey[400] : green[600],
                }}
              >
                +{diff}
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
  const dispatch = useDispatch();
  const CustomTooltip = useMemo(() => createCustomTooltip(tooltip), [tooltip]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        '& [data-testid*="slice"]': {
          cursor: "pointer",
        },
      }}
    >
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
        onClick={(d) => {
          const leetcodeIds = ((d as any).points as Point[])
            .map((p) => (p.data as any).leetcodeIds)
            .flat();

          if (leetcodeIds.length === 0) {
            return;
          }
          dispatch(
            globalActions.openProblems({
              ids: leetcodeIds,
              column: "difficulty",
            })
          );
        }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
        }}
        enableSlices="x"
        sliceTooltip={CustomTooltip}
        colors={(data) => theme.leetcode.difficulty[data.id as TDifficulty]}
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
    </Box>
  );
};
