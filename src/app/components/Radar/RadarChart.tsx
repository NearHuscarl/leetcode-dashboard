import {
  GridLabelProps,
  RadarSliceTooltipProps,
  ResponsiveRadar,
} from "@nivo/radar";
import { useTheme as useNivoTheme } from "@nivo/core";
import { animated } from "@react-spring/web";
import useTheme from "@mui/material/styles/useTheme";
import grey from "@mui/material/colors/grey";
import Stack from "@mui/material/Stack";
import { TRadarDatum } from "./radarData";
import { TCardType } from "app/helpers/card";
import { ChartTooltip } from "../ChartTooltip";

const getDisplayedLabel = (id: string) => (id.startsWith("Heap") ? "Heap" : id);

const RadarGridLabel = ({
  id,
  anchor,
  animated: animatedProps,
}: GridLabelProps) => {
  const theme = useNivoTheme();

  return (
    <animated.g transform={animatedProps.transform}>
      <text
        style={theme.axis.ticks.text}
        dominantBaseline="central"
        textAnchor={anchor}
      >
        {getDisplayedLabel(id)}
      </text>
    </animated.g>
  );
};

const cardTypes: TCardType[] = ["Learning", "Young", "Mature"];
const cardTypePriorities = {
  Learning: 0,
  Young: 1,
  Mature: 2,
};

const CustomTooltip = (props: RadarSliceTooltipProps) => {
  const { data, index } = props;
  const theme = useTheme();

  return (
    <ChartTooltip>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontWeight: "bold" }}>
          {getDisplayedLabel(index as string)}
        </div>
        <Stack>
          {data
            // @ts-ignore
            .sort((a, b) => cardTypePriorities[a.id] - cardTypePriorities[b.id])
            .map(({ id, value }) => (
              <Stack key={id} direction="row" justifyContent="space-between">
                <ChartTooltip.Text
                  style={{
                    width: 80,
                    color: theme.anki.cardType[id as TCardType],
                  }}
                >
                  {id}
                </ChartTooltip.Text>
                <ChartTooltip.Text>
                  <span style={{ fontWeight: 600 }}>
                    {Math.round(value * 10) / 10}
                  </span>
                  <span style={{ color: grey[400] }}>%</span>
                </ChartTooltip.Text>
              </Stack>
            ))}
        </Stack>
      </div>
    </ChartTooltip>
  );
};

type TRadarChartProps = {
  data: TRadarDatum[];
};

export const RadarChart = (props: TRadarChartProps) => {
  const { data } = props;
  const theme = useTheme();

  return (
    <ResponsiveRadar
      data={data}
      keys={cardTypes}
      indexBy="dsa"
      theme={{
        textColor: theme.chart.legend.color,
        grid: {
          line: { stroke: grey[300] },
        },
        crosshair: {
          line: { stroke: theme.palette.primary.main },
        },
      }}
      sliceTooltip={CustomTooltip}
      maxValue={100}
      gridLevels={4}
      margin={{ top: 20, right: 80, bottom: 10, left: 70 }}
      gridShape="linear"
      gridLabelOffset={10}
      gridLabel={RadarGridLabel}
      enableDots={false}
      colors={({ key }) => theme.anki.cardType[key as TCardType]}
      fillOpacity={0.8}
      blendMode="normal"
      motionConfig="wobbly"
      legends={[
        {
          anchor: "top-left",
          direction: "column",
          translateX: -70,
          translateY: -10,
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
    />
  );
};
