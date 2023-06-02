import { useCallback, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import styled from "@mui/material/styles/styled";
import { animated } from "@react-spring/web";
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
  const selectedProblem = useSelector((state) => state.global.selectedProblem);
  const selectedChart = useSelector((state) => state.global.selectedChart);
  const isSelected =
    selectedProblem === node.data.id && selectedChart !== "scatterPlot";
  const handleMouseEnter = useCallback(
    (event: MouseEvent<SVGCircleElement>) => {
      dispatch(globalActions.setSelectedProblem([node.data.id, "scatterPlot"]));
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
      dispatch(globalActions.setSelectedProblem());
      onMouseLeave?.(node, event);
    },
    [node, onMouseLeave]
  );
  const handleClick = useCallback(
    (event: MouseEvent<SVGCircleElement>) => onClick?.(node, event),
    [node, onClick]
  );
  const r = style.size.to(interpolateRadius);
  const selectedColor = purple[500];

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
      <animated.circle
        cx={style.x}
        cy={style.y}
        r={r}
        fill={isSelected ? selectedColor : node.data.color[500]}
        style={{ mixBlendMode: blendMode }}
        onMouseEnter={isInteractive ? handleMouseEnter : undefined}
        onMouseMove={isInteractive ? handleMouseMove : undefined}
        onMouseLeave={isInteractive ? handleMouseLeave : undefined}
        onClick={isInteractive ? handleClick : undefined}
      />
    </>
  );
};
