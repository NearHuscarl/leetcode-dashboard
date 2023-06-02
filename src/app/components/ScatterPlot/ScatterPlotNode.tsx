import { useCallback, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { animated } from "@react-spring/web";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import purple from "@mui/material/colors/purple";
import { ScatterPlotNodeProps } from "@nivo/scatterplot";
import { TScatterPlotDatum } from "./scatterPlotData";
import { globalActions } from "app/store/globalSlice";
import { useSelector } from "app/store/setup";

const interpolateRadius = (size: number) => size / 2;
const Circle = styled(animated.circle)();

// https://github.com/plouc/nivo/blob/0f0a926627c370f4ae0ca435a91573a16d96affc/packages/scatterplot/src/Node.tsx
// I need to set the color dynamically all in a single group. otherwise, when
// nodes moved between groups they wouldn't have translation animation
export const ScatterPlotNode = <RawDatum extends TScatterPlotDatum>({
  node,
  style,
  blendMode,
  isInteractive,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onClick,
}: ScatterPlotNodeProps<RawDatum>) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const selectedProblem = useSelector((state) => state.global.hover.problem);
  const selectedChart = useSelector((state) => state.global.hover.chart);
  const isSelected =
    selectedProblem === node.data.id && selectedChart !== "scatterPlot";
  const handleMouseEnter = useCallback(
    (event: MouseEvent<SVGCircleElement>) => {
      dispatch(globalActions.hoverProblem([node.data.id, "scatterPlot"]));
      onMouseEnter?.(node, event);
    },
    [node, onMouseEnter]
  );
  const handleMouseMove = useCallback(
    (event: MouseEvent<SVGCircleElement>) => onMouseMove?.(node, event),
    [node, onMouseMove]
  );
  const handleMouseLeave = useCallback(
    (event: MouseEvent<SVGCircleElement>) => {
      dispatch(globalActions.hoverProblem());
      onMouseLeave?.(node, event);
    },
    [node, onMouseLeave]
  );
  const handleClick = useCallback(
    (event: MouseEvent<SVGCircleElement>) => {
      dispatch(globalActions.openProblemDetail(node.data.id));
      onClick?.(node, event);
    },
    [node, onClick]
  );
  const r = style.size.to(interpolateRadius);
  const selectedColor = purple[500];
  const nodeColor = theme.anki.dueStatus[node.data.dueStatus];

  return (
    <>
      {isSelected && (
        <Circle
          cx={style.x.get()}
          cy={style.y.get()}
          r={r.get()}
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
            stroke: nodeColor,
          },
        }}
        cx={style.x}
        cy={style.y}
        r={r}
        fill={isSelected ? selectedColor : nodeColor}
        style={{ mixBlendMode: blendMode }}
        strokeWidth={3}
        onMouseEnter={isInteractive ? handleMouseEnter : undefined}
        onMouseMove={isInteractive ? handleMouseMove : undefined}
        onMouseLeave={isInteractive ? handleMouseLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
      />
    </>
  );
};
