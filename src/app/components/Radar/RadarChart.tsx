import { GridLabelProps, ResponsiveRadar } from "@nivo/radar";
import { useTheme as useNivoTheme } from "@nivo/core";
import { animated } from "@react-spring/web";
import useTheme from "@mui/material/styles/useTheme";
import grey from "@mui/material/colors/grey";
import { TRadarDatum } from "./radarData";
import { TCardType, getCardTypeColor } from "app/helpers/card";

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
        {id.startsWith("Heap") ? "Heap" : id}
      </text>
    </animated.g>
  );
};

const cardTypes: TCardType[] = ["Learning", "Young", "Mature"];

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
      }}
      maxValue={100}
      margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
      gridShape="linear"
      gridLabelOffset={10}
      gridLabel={RadarGridLabel}
      enableDots={false}
      colors={({ key }) => getCardTypeColor(key as any)}
      fillOpacity={0.8}
      blendMode="normal"
      motionConfig="wobbly"
      legends={[
        {
          anchor: "top-left",
          direction: "column",
          translateX: -70,
          translateY: -40,
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: "circle",
        },
      ]}
    />
  );
};
