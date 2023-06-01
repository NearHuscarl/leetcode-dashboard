import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import { TEaseLabel } from "app/helpers/card";
import { RetentionRateTooltip } from "./RetentionRateTooltip";

type TBarSegmentProps = {
  label: TEaseLabel;
  width: number | string;
};

const BarSegment = (props: TBarSegmentProps) => {
  const theme = useTheme();
  const { label, width } = props;

  return (
    <div
      style={{
        width,
        height: 11,
        transition: "width 0.3s",
        backgroundColor: theme.anki.ease[label],
        borderRadius: 10,
      }}
    />
  );
};

type TRetentionRateBarProps = {
  result: Record<TEaseLabel, number>;
};

export const RetentionRateBar = ({ result }: TRetentionRateBarProps) => {
  const theme = useTheme();
  const totalPassed = result.good + result.easy + result.hard;
  const totalFailed = result.again;
  const total = totalPassed + totalFailed;

  return (
    <Stack>
      <Stack px={1} direction="row" justifyContent="space-between">
        <div>
          <div style={{ color: theme.chart.legend.color, fontSize: 12 }}>
            Passed
          </div>
          <div style={{ fontWeight: 600 }}>
            {Math.round((totalPassed / (total || 1)) * 100)}%
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: theme.chart.legend.color, fontSize: 12 }}>
            Failed
          </div>
          <div style={{ fontWeight: 600 }}>
            {Math.round((totalFailed / (total || 1)) * 100)}%
          </div>
        </div>
      </Stack>
      <RetentionRateTooltip result={result} cardType="Total">
        <Stack direction="row" px={0.6} gap={0.5}>
          {(Object.keys(result) as TEaseLabel[])
            .reverse()
            .filter((e) => result[e] > 0)
            .map((e) => (
              <BarSegment
                key={e}
                label={e}
                width={`${(result[e] / (total || 1)) * 100}%`}
              />
            ))}
          {total === 0 && <BarSegment label="again" width="100%" />}
        </Stack>
      </RetentionRateTooltip>
    </Stack>
  );
};
