import { lighten, useTheme } from "@mui/material";
import { PieCustomLayerProps, ResponsivePie } from "@nivo/pie";
import { TRetentionDatum } from "./retentionRateData";
import { grey } from "@mui/material/colors";

const InnerBackground = (props: PieCustomLayerProps<TRetentionDatum>) => {
  const { centerX, centerY, arcGenerator, dataWithArc, innerRadius } = props;
  let success = 0;
  let total = 0;

  dataWithArc.forEach((datum) => {
    if (datum.data.id !== "again") {
      success += datum.value;
    }
    total += datum.value;
  });

  return (
    <g transform={`translate(${centerX},${centerY})`}>
      <path
        fill={"url(#fullColor)"}
        d={
          arcGenerator({
            startAngle: 0,
            endAngle: 2 * Math.PI * (success / (total || 1)),
            innerRadius: innerRadius - 9,
            outerRadius: innerRadius - 6,
          }) ?? ""
        }
      />
    </g>
  );
};
const CenteredMetric = (props: PieCustomLayerProps<TRetentionDatum>) => {
  const { dataWithArc, centerX, centerY } = props;
  let success = 0;
  let total = 0;

  dataWithArc.forEach((datum) => {
    if (datum.data.id !== "again") {
      success += datum.value;
    }
    total += datum.value;
  });

  return (
    <>
      <text
        x={centerX}
        y={centerY - 10}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        {Math.round((success / (total || 1)) * 100)}
        <tspan
          style={{
            fill: grey[500],
            fontSize: 18,
          }}
        >
          %
        </tspan>
      </text>
      <text
        x={centerX}
        y={centerY + 15}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: "15px",
          fontWeight: 500,
          fill: grey[500],
        }}
      >
        {dataWithArc[0].data.cardType}
      </text>
    </>
  );
};

type TRetentionRateCircleProps = {
  data: TRetentionDatum[];
};

export const RetentionRateCircle = (props: TRetentionRateCircleProps) => {
  const { data } = props;
  const theme = useTheme();
  const isEmpty = data.every((datum) => datum.value === 0);
  const d = isEmpty
    ? [{ id: "again", value: 1, cardType: data[0].cardType } as TRetentionDatum]
    : data;

  return (
    <ResponsivePie<TRetentionDatum>
      data={d}
      margin={{ top: 10, right: 0, bottom: 5, left: 0 }}
      innerRadius={0.85}
      padAngle={1}
      cornerRadius={10}
      colors={(d) => theme.anki.ease[d.data.id]}
      isInteractive={!isEmpty}
      enableArcLinkLabels={false}
      enableArcLabels={false}
      defs={[
        {
          id: "fullColor",
          type: "linearGradient",
          colors: [
            { offset: 0, color: grey[300] },
            { offset: 100, color: grey[100] },
          ],
        },
        {
          id: "hardColor",
          type: "linearGradient",
          colors: [
            { offset: 0, color: lighten(theme.anki.ease.hard, 0.1) },
            { offset: 100, color: theme.anki.ease.hard },
          ],
        },
        {
          id: "goodColor",
          type: "linearGradient",
          colors: [
            { offset: 0, color: lighten(theme.anki.ease.good, 0.1) },
            { offset: 100, color: theme.anki.ease.good },
          ],
        },
        {
          id: "easyColor",
          type: "linearGradient",
          colors: [
            { offset: 0, color: lighten(theme.anki.ease.easy, 0.1) },
            { offset: 100, color: theme.anki.ease.easy },
          ],
        },
      ]}
      fill={[
        { match: { id: "hard" }, id: "hardColor" },
        { match: { id: "good" }, id: "goodColor" },
        { match: { id: "easy" }, id: "easyColor" },
      ]}
      layers={[
        "arcs",
        "arcLabels",
        "arcLinkLabels",
        "legends",
        InnerBackground,
        CenteredMetric,
      ]}
    />
  );
};
