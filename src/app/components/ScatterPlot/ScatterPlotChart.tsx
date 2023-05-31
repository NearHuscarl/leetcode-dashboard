import {
  ResponsiveScatterPlot,
  ScatterPlotDatum,
  ScatterPlotLayerProps,
} from "@nivo/scatterplot";
import { alpha, useTheme } from "@mui/material";
import { TScatterPlotRawSerie, colorLookup } from "./scatterPlotData";
import { MSS } from "app/settings";
import { ScatterPlotNode } from "./ScatterPlotNode";
import { blueGrey } from "@mui/material/colors";
import { useState } from "react";
import { TDueStatus } from "app/helpers/card";

type TRectProps = {
  x: number;
  y?: number;
  w: number;
  h: number;
  status: TDueStatus;
};

const Rect = ({ x, y = 0, w, h, status }: TRectProps) => {
  const [enter, setEnter] = useState(false);

  return (
    <rect
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={(e) => {
        const rect = (e.target as any).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const isInside = x > 0 && x < rect.width && y > 0 && y < rect.height;

        // make sure this handle is fired because the mouse is outside instead of inside but hover on the dot
        if (!isInside) {
          setEnter(false);
        }
      }}
      x={x}
      y={y}
      style={{ transition: "fill 0.25s ease" }}
      fill={alpha(colorLookup[status][500], enter ? 0.2 : 0.08)}
      width={w}
      height={h}
    />
  );
};

const AreaLayer = (props: ScatterPlotLayerProps<ScatterPlotDatum>) => {
  const { innerHeight, xScale } = props;

  // positive scale
  const scale = {
    now: xScale(0),
    threeMonths: xScale(MSS.threeMonths),
    oneMonth: xScale(MSS.oneMonth),
    oneWeek: xScale(MSS.oneWeek),
    oneDay: xScale(MSS.oneDay),
    oneYear: xScale(MSS.oneYear),
  };
  // negative scale
  const scale2 = {
    now: xScale(0),
    threeMonths: xScale(-MSS.threeMonths),
    oneMonth: xScale(-MSS.oneMonth),
    oneWeek: xScale(-MSS.oneWeek),
    oneDay: xScale(-MSS.oneDay),
  };

  return (
    <>
      {/* stale area */}
      <Rect x={0} status="stale" w={scale2.oneMonth} h={innerHeight} />
      {/* bad area */}
      <Rect
        x={scale2.oneMonth}
        status="bad"
        w={scale.oneMonth - scale.oneDay}
        h={innerHeight}
      />
      {/* now area */}
      <Rect
        x={scale2.oneDay}
        status="now"
        w={scale.oneDay - scale2.oneDay}
        h={innerHeight}
      />
      {/* soon area */}
      <Rect
        x={scale.oneDay}
        status="soon"
        w={scale.oneWeek - scale.oneDay}
        h={innerHeight}
      />
      {/* good area */}
      <Rect
        x={scale.oneWeek}
        status="good"
        w={scale.oneMonth - scale.oneWeek}
        h={innerHeight}
      />
      {/* safe area */}
      <Rect
        x={scale.oneMonth}
        status="safe"
        w={scale.oneYear - scale.oneMonth}
        h={innerHeight}
      />
    </>
  );
};

type TScatterPlotProps = {
  data: TScatterPlotRawSerie[];
};

export const ScatterPlotChart = (props: TScatterPlotProps) => {
  const { data } = props;
  const theme = useTheme();

  return (
    <ResponsiveScatterPlot
      data={data}
      theme={{
        textColor: theme.chart.legend.color,
        grid: {
          line: {
            stroke: blueGrey[50],
          },
        },
      }}
      margin={{ top: 20, right: 10, bottom: 25, left: 40 }}
      xScale={{
        type: "symlog",
        min: -MSS.threeMonths,
        max: MSS.oneYear,
        constant: MSS.oneDay,
      }}
      nodeSize={8}
      yScale={{ type: "linear", min: 0 }}
      blendMode="multiply"
      nodeComponent={ScatterPlotNode}
      axisTop={null}
      axisRight={null}
      useMesh={false}
      axisBottom={{
        tickSize: 0,
        tickPadding: 10,
        tickValues: [
          -MSS.threeMonths,
          -MSS.oneMonth,
          -MSS.oneWeek,
          -MSS.oneDay,
          0,
          MSS.oneDay,
          MSS.oneWeek,
          MSS.oneMonth,
          MSS.threeMonths,
          MSS.oneYear,
        ],
        format: (value) => {
          const ms = value as number;

          if (ms === 0) {
            return "0";
          }

          if (Math.abs(ms) < MSS.oneDay) {
            return `${Math.round(ms / MSS.oneHour)}h`;
          } else if (Math.abs(ms) < MSS.oneMonth) {
            return `${Math.round(ms / MSS.oneDay)}d`;
          } else if (Math.abs(ms) < MSS.oneYear) {
            return `${Math.round((ms / MSS.oneMonth) * 10) / 10}m`;
          } else {
            return `${Math.round(ms / MSS.oneYear)}y`;
          }
        },
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 10,
        tickValues: 4,
      }}
      gridYValues={4}
      layers={[
        "grid",
        "axes",
        AreaLayer,
        "nodes",
        "markers",
        "mesh",
        "legends",
        "annotations",
      ]}
    />
  );
};
