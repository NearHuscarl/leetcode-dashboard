import { useCallback, MouseEvent } from "react";
import { animated } from "@react-spring/web";
import { ScatterPlotNodeProps } from "@nivo/scatterplot";
import { TScatterPlotDatum } from "./scatterPlotData";

const interpolateRadius = (size: number) => size / 2;

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
  const handleMouseEnter = useCallback(
    (event: MouseEvent<SVGCircleElement>) => onMouseEnter?.(node, event),
    [node, onMouseEnter]
  );
  const handleMouseMove = useCallback(
    (event: MouseEvent<SVGCircleElement>) => onMouseMove?.(node, event),
    [node, onMouseMove]
  );
  const handleMouseLeave = useCallback(
    (event: MouseEvent<SVGCircleElement>) => onMouseLeave?.(node, event),
    [node, onMouseLeave]
  );
  const handleClick = useCallback(
    (event: MouseEvent<SVGCircleElement>) => onClick?.(node, event),
    [node, onClick]
  );

  return (
    <animated.circle
      cx={style.x}
      cy={style.y}
      r={style.size.to(interpolateRadius)}
      fill={node.data.color[500]}
      style={{ mixBlendMode: blendMode }}
      onMouseEnter={isInteractive ? handleMouseEnter : undefined}
      onMouseMove={isInteractive ? handleMouseMove : undefined}
      onMouseLeave={isInteractive ? handleMouseLeave : undefined}
      onClick={isInteractive ? handleClick : undefined}
    />
  );
};
