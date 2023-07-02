import { useDispatch } from "react-redux";
import {
  CircleProps,
  ComputedDatum,
  ResponsiveSwarmPlot,
} from "@nivo/swarmplot";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import red from "@mui/material/colors/red";
import { animated } from "@react-spring/web";
import { transform } from "framer-motion";
import { TSwarmPlotDatum } from "./swarmPlotData";
import { TCardType } from "app/helpers/card";
import { useLeetcodeProblems } from "app/api/leetcode";
import { ReviewTrend } from "../ReviewTrend/ReviewTrend";
import { ChartTooltip } from "../ChartTooltip";
import { primaryColor } from "app/provider/ThemeProvider";
import { useSelector } from "app/store/setup";
import { globalActions } from "app/store/globalSlice";

export const getAcRateColor = transform(
  [30, 60, 80],
  [primaryColor[900], primaryColor[500], primaryColor[100]]
);

const Circle = styled(animated.circle)();

const CustomCircle = (props: CircleProps<TSwarmPlotDatum>) => {
  const { node, onMouseEnter, onMouseMove, onMouseLeave, onClick, style } =
    props;
  const dispatch = useDispatch();
  const selectedProblem = useSelector((state) => state.global.hover.problem);
  const selectedChart = useSelector((state) => state.global.hover.chart);
  const isSelected =
    selectedProblem === node.id && selectedChart !== "swarmPlot";
  const selectedColor = red[500];

  return (
    <>
      {isSelected && (
        <Circle
          cx={style.x.get()}
          cy={style.y.get()}
          r={style.radius.get()}
          fill={selectedColor}
          strokeWidth={0}
          sx={{
            transformOrigin: "center",
            transformBox: "fill-box",
            animation: "pulse 1.5s ease-out infinite",
          }}
        />
      )}
      <Circle
        sx={{
          cursor: "pointer",
          "&:hover": {
            stroke: node.color,
          },
        }}
        key={node.id}
        cx={style.x}
        cy={style.y}
        r={style.radius}
        fill={isSelected ? selectedColor : style.color.get()}
        strokeWidth={3}
        opacity={style.opacity}
        onMouseEnter={(event) => {
          dispatch(globalActions.hoverProblem([node.data.id, "swarmPlot"]));
          onMouseEnter?.(node, event);
        }}
        onMouseMove={(event) => onMouseMove?.(node, event)}
        onMouseLeave={(event) => {
          dispatch(globalActions.hoverProblem());
          onMouseLeave?.(node, event);
        }}
        onClick={(event) => onClick?.(node, event)}
      />
    </>
  );
};

const CustomTooltip = (props: ComputedDatum<TSwarmPlotDatum>) => {
  const { data, id } = props;
  const { data: leetcodes = {} } = useLeetcodeProblems();

  return (
    <ChartTooltip>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <ChartTooltip.Text>{leetcodes[id]?.title}</ChartTooltip.Text>
        <ReviewTrend reviews={data.reviews} />
      </div>
    </ChartTooltip>
  );
};

type TSwarmPlotChartProps = {
  data: TSwarmPlotDatum[];
  groups: TCardType[];
};

export const SwarmPlotChart = (props: TSwarmPlotChartProps) => {
  const { data, groups } = props;
  const dispatch = useDispatch();
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
      onClick={({ id }) => dispatch(globalActions.openProblemDetail(id))}
      forceStrength={4}
      simulationIterations={100}
      margin={{ top: 30, right: 60, bottom: 25, left: 60 }}
      gridYValues={4}
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
        tickValues: 4,
        format: ".1f",
        legend: "Ease Rate",
        legendPosition: "middle",
        legendOffset: 40,
      }}
      axisLeft={{
        tickSize: 0,
        tickValues: 4,
        format: ".1f",
        legend: "Ease Rate",
        legendPosition: "middle",
        legendOffset: -40,
      }}
    />
  );
};
