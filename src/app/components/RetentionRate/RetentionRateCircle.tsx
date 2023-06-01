import useTheme from "@mui/material/styles/useTheme";
import { lighten } from "@mui/material";
import grey from "@mui/material/colors/grey";
import { PieCustomLayerProps, ResponsivePie } from "@nivo/pie";
import { TRetentionDatum } from "./retentionRateData";
import { RetentionRateTooltip } from "./RetentionRateTooltip";

interface TInnerBackgroundProps extends PieCustomLayerProps<TRetentionDatum> {
  cardType: string;
}

const InnerBackground = (props: TInnerBackgroundProps) => {
  const {
    centerX,
    centerY,
    arcGenerator,
    dataWithArc,
    innerRadius,
    radius,
    cardType,
  } = props;
  let success = 0;
  let total = 0;
  const result = dataWithArc.reduce<Record<string, number>>((a, c) => {
    a[c.id] = c.value;
    return a;
  }, {});

  dataWithArc.forEach((datum) => {
    if (datum.data.id !== "again") {
      success += datum.value;
    }
    total += datum.value;
  });

  return (
    <>
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
        {!(dataWithArc[0].data as any).isEmpty && (
          <RetentionRateTooltip result={result} cardType={cardType}>
            <circle fill="transparent" r={radius} />
          </RetentionRateTooltip>
        )}
      </g>
      <CenteredMetric
        cardType={cardType}
        centerX={centerX}
        centerY={centerY}
        success={success}
        total={total}
      />
    </>
  );
};

interface TCenterMetricProps {
  cardType: string;
  success: number;
  total: number;
  centerX: number;
  centerY: number;
}

const CenteredMetric = (props: TCenterMetricProps) => {
  const { centerX, centerY, cardType, total, success } = props;

  return (
    <>
      <text
        x={centerX}
        y={centerY - 10}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 22,
          fontWeight: 600,
          pointerEvents: "none",
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
          fontSize: 14,
          fontWeight: 500,
          fill: grey[500],
          pointerEvents: "none",
        }}
      >
        {cardType}
      </text>
    </>
  );
};

const EMPTY_DATA = [
  { id: "again", value: 1, isEmpty: true } as TRetentionDatum,
];

type TRetentionRateCircleProps = {
  data: TRetentionDatum[];
  cardType: string;
};

export const RetentionRateCircle = (props: TRetentionRateCircleProps) => {
  const { data, cardType } = props;
  const theme = useTheme();
  const isEmpty = data.every((datum) => datum.value === 0);
  const d = isEmpty ? EMPTY_DATA : data;

  return (
    <ResponsivePie<TRetentionDatum>
      data={d}
      margin={{ top: 10, right: 0, bottom: 15, left: 0 }}
      innerRadius={0.85}
      padAngle={1}
      cornerRadius={10}
      colors={(d) => theme.anki.ease[d.data.id]}
      isInteractive={false}
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
        (props) => <InnerBackground {...props} cardType={cardType} />,
      ]}
    />
  );
};
