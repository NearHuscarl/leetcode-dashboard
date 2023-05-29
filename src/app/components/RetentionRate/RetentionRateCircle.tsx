import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import {
  Tooltip,
  TooltipProps,
  lighten,
  styled,
  tooltipClasses,
} from "@mui/material";
import grey from "@mui/material/colors/grey";
import { PieCustomLayerProps, ResponsivePie } from "@nivo/pie";
import startCase from "lodash/startCase";
import { TRetentionDatum } from "./retentionRateData";
import { ChartTooltip } from "../ChartTooltip";

const easePriorities = {
  easy: 0,
  good: 1,
  hard: 2,
  again: 3,
};

const CustomTooltip = (props: PieCustomLayerProps<TRetentionDatum>) => {
  const { dataWithArc } = props;
  const total = dataWithArc.reduce((acc, datum) => acc + datum.value, 0);

  return (
    <ChartTooltip>
      {dataWithArc
        // @ts-ignore
        .sort((a, b) => easePriorities[a.id] - easePriorities[b.id])
        .map(({ value, color, id }) => (
          <Stack key={id} direction="row" alignItems="center" gap={1}>
            <ChartTooltip.Text
              style={{ color: id === "again" ? grey[400] : color, width: 60 }}
            >
              {startCase(id as string)}
            </ChartTooltip.Text>
            <ChartTooltip.Text style={{ fontWeight: 600 }}>
              {value}
            </ChartTooltip.Text>
            <ChartTooltip.Text style={{ width: 40, textAlign: "right" }}>
              {((value / (total || 1)) * 100).toFixed(1)}
              <span style={{ color: grey[400] }}>%</span>
            </ChartTooltip.Text>
          </Stack>
        ))}
    </ChartTooltip>
  );
};

const TootlipWrapper = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "transparent",
    fontWeight: 400,
    padding: 0,
  },
});

const InnerBackground = (props: PieCustomLayerProps<TRetentionDatum>) => {
  const { centerX, centerY, arcGenerator, dataWithArc, innerRadius, radius } =
    props;
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
          <TootlipWrapper
            title={<CustomTooltip {...props} />}
            followCursor
            placement="top"
          >
            <circle fill="transparent" r={radius} />
          </TootlipWrapper>
        )}
      </g>
    </>
  );
};

interface TCenterMetricProps extends PieCustomLayerProps<TRetentionDatum> {
  cardType: string;
}

const CenteredMetric = (props: TCenterMetricProps) => {
  const { dataWithArc, centerX, centerY, cardType } = props;
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
          fontSize: "15px",
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
      margin={{ top: 10, right: 0, bottom: 5, left: 0 }}
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
        InnerBackground,
        (props) => <CenteredMetric {...props} cardType={cardType} />,
      ]}
    />
  );
};
