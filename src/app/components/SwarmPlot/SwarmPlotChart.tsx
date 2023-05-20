import {
  CircleProps,
  ComputedDatum,
  ResponsiveSwarmPlot,
} from "@nivo/swarmplot";
import { TSwarmPlotDatum } from "./swarmPlotData";
import { getAcRateColor } from "../AcRateIndicator";
import { styled, useTheme } from "@mui/material";
import Card from "@mui/material/Card";
import { TCardType } from "app/helpers/card";
import { useLeetcodeProblems } from "app/api/leetcode";
import { LEETCODE_BASE_URL } from "app/settings";
import { ReviewStatus } from "../ReviewStatus";

const Circle = styled("circle")();

const CustomCircle = (props: CircleProps<TSwarmPlotDatum>) => {
  const { node, onMouseEnter, onMouseMove, onMouseLeave, onClick } = props;

  return (
    <g transform={`translate(${node.x},${node.y})`}>
      <circle fill={node.color} r={node.size / 2} />
      <Circle
        sx={{
          cursor: "pointer",
          opacity: 0,
          "&:hover": {
            opacity: 1,
          },
        }}
        stroke={node.color}
        strokeWidth={2}
        fill="transparent"
        r={node.size / 2 + 3}
        onMouseEnter={(event) => onMouseEnter?.(node, event)}
        onMouseMove={(event) => onMouseMove?.(node, event)}
        onMouseLeave={(event) => onMouseLeave?.(node, event)}
        onClick={(event) => onClick?.(node, event)}
      />
    </g>
  );
};

const CustomTooltip = (props: ComputedDatum<TSwarmPlotDatum>) => {
  const { data, id } = props;
  const { data: leetcodes = {} } = useLeetcodeProblems();

  return (
    <Card sx={{ p: 1.5 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ flex: 1, fontSize: 13 }}>{leetcodes[id]?.title}</div>
        <ReviewStatus reviews={data.reviews} />
      </div>
    </Card>
  );
};

type TSwarmPlotChartProps = {
  data: TSwarmPlotDatum[];
  groups: TCardType[];
};

export const SwarmPlotChart = (props: TSwarmPlotChartProps) => {
  const { data, groups } = props;
  const theme = useTheme();

  return (
    <ResponsiveSwarmPlot
      data={data}
      groups={groups}
      theme={{
        textColor: theme.chart.legend.color,
        fontSize: theme.chart.legend.fontSize,
      }}
      circleComponent={CustomCircle}
      tooltip={CustomTooltip}
      colors={({ data }) => getAcRateColor(data.acRate)}
      valueScale={{ type: "linear", min: 0, max: 1, reverse: false }}
      onClick={({ id }) => window.open(`${LEETCODE_BASE_URL}/${id}`, "_blank")}
      size={{
        key: "volume",
        values: [1, 6],
        sizes: [6, 20],
      }}
      forceStrength={4}
      simulationIterations={100}
      margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
      axisTop={{
        tickSize: 0,
        tickPadding: 10,
      }}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
      }}
      axisRight={{
        tickSize: 0,
        format: ".1f",
        legend: "Ease Rate",
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 0,
        format: ".1f",
        legend: "Ease Rate",
        legendPosition: "middle",
        legendOffset: -40,
      }}
    />
  );
};
