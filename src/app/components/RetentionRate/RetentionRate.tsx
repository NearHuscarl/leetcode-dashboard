import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material";
import { ChartTitle } from "../ChartTitle";
import { RetentionRateFilter } from "./RetentionRateFilter";
import { useProblems } from "app/services/problems";
import { prepareChartData } from "./retentionRateData";
import { useSelector } from "app/store/setup";
import { RetentionRateCircle } from "./RetentionRateCircle";
import { TEaseLabel } from "app/helpers/card";

export const RetentionRate = () => {
  const cards = useProblems();
  const dateAgo = useSelector((state) => state.filter.retentionRate.dateAgo);
  const { data, ease, total } = prepareChartData(cards, dateAgo);
  const theme = useTheme();
  const totalPassed = ease.good + ease.easy + ease.hard;
  const totalFailed = ease.again;

  return (
    <Stack justifyContent="space-between" height="100%">
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <ChartTitle>Retention Rate</ChartTitle>
        <RetentionRateFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <Stack
        width="100%"
        height="calc(100% - 100px)"
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        {Object.keys(data).map((cardType) => (
          <RetentionRateCircle key={cardType} data={data[cardType]} />
        ))}
      </Stack>
      <Stack>
        <Stack px={2.5} direction="row" justifyContent="space-between">
          <div>
            <div style={{ color: theme.chart.legend.color, fontSize: 12 }}>
              Passed
            </div>
            <div style={{ fontWeight: 600 }}>
              {Math.round((totalPassed / total) * 100)}%
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: theme.chart.legend.color, fontSize: 12 }}>
              Failed
            </div>
            <div style={{ fontWeight: 600 }}>
              {Math.round((totalFailed / total) * 100)}%
            </div>
          </div>
        </Stack>
        <Stack direction="row" px={2} gap={0.5}>
          {(Object.keys(ease) as TEaseLabel[]).reverse().map((e) => (
            <div
              key={e}
              style={{
                width: `${(ease[e] / total) * 100}%`,
                height: 11,
                transition: "width 0.3s",
                backgroundColor: theme.anki.ease[e],
                borderRadius: 10,
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
