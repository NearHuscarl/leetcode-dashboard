import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import { TEaseLabel } from "app/helpers/card";
import { RetentionRateTooltip } from "./RetentionRateTooltip";

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
          {(Object.keys(result) as TEaseLabel[]).reverse().map((e) => (
            <div
              key={e}
              style={{
                width: `${(result[e] / (total || 1)) * 100}%`,
                height: 11,
                transition: "width 0.3s",
                backgroundColor: theme.anki.ease[e],
                borderRadius: 10,
              }}
            />
          ))}
        </Stack>
      </RetentionRateTooltip>
    </Stack>
  );
};
