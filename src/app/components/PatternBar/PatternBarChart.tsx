import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { BarTooltipProps, ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@mui/material";
import { TBarDatum, TPattern, patternShortNames } from "./patternBarData";
import { TCardType } from "app/helpers/card";
import { ChartTooltip } from "../ChartTooltip";
import { grey } from "@mui/material/colors";
import { keyOf } from "app/helpers/lang";
import { globalActions } from "app/store/globalSlice";

const cardTypePriorities = {
  Learning: 0,
  Young: 1,
  Mature: 2,
  Unsolved: 3,
};

const CustomTooltip = (props: BarTooltipProps<TBarDatum>) => {
  const { pattern, leetcodeIds, ...sum } = props.data;
  const theme = useTheme();
  const total = keyOf(sum).reduce((acc, cardType) => acc + sum[cardType], 0);

  return (
    <ChartTooltip>
      <Stack gap={0.5}>
        <div style={{ fontWeight: "bold" }}>{pattern}</div>
        <Stack>
          {keyOf(sum)
            // @ts-ignore
            .sort((a, b) => cardTypePriorities[a] - cardTypePriorities[b])
            .map((cardType) => {
              return (
                <Stack
                  key={cardType}
                  direction="row"
                  justifyContent="space-between"
                >
                  <ChartTooltip.Text
                    style={{
                      width: 80,
                      color:
                        cardType !== "Unsolved"
                          ? theme.anki.cardType[cardType]
                          : grey[400],
                    }}
                  >
                    {cardType}
                  </ChartTooltip.Text>
                  <ChartTooltip.Text>
                    <ChartTooltip.Number>
                      {Math.round((sum[cardType] / total) * 1000) / 10}
                    </ChartTooltip.Number>
                    <ChartTooltip.Unit>%</ChartTooltip.Unit>
                  </ChartTooltip.Text>
                </Stack>
              );
            })}
        </Stack>
      </Stack>
    </ChartTooltip>
  );
};

type TPatternBarChartProps = {
  data: TBarDatum[];
};

const keys = ["Mature", "Young", "Learning", "Unsolved"];

export const PatternBarChart = (props: TPatternBarChartProps) => {
  const { data } = props;
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        // bar rect
        "& rect[focusable]": {
          cursor: "pointer",
        },
      }}
    >
      <ResponsiveBar
        // @ts-ignore
        data={data}
        keys={keys}
        indexBy="pattern"
        theme={{
          textColor: theme.chart.legend.color,
        }}
        colors={({ id }) => {
          if (id === "Unsolved") {
            return theme.palette.primary.color[50];
          }
          return theme.anki.cardType[id as TCardType];
        }}
        margin={{ top: 10, right: 90, bottom: 25, left: 25 }}
        groupMode="stacked"
        valueScale={{ type: "linear", min: 0 }}
        // @ts-ignore
        tooltip={CustomTooltip}
        padding={0.6}
        gridYValues={4}
        onClick={(d) => {
          const datum: TBarDatum = d.data as any;
          dispatch(
            globalActions.openProblems({
              ids: datum.leetcodeIds,
              column: "pattern",
            })
          );
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 5,
          tickValues: 4,
        }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          format: (value) => patternShortNames[value as TPattern],
        }}
        labelSkipWidth={1000}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            translateX: 120,
            itemWidth: 100,
            itemHeight: 20,
            symbolSize: 12,
          },
        ]}
      />
    </Box>
  );
};
