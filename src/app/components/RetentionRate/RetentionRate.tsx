import Stack from "@mui/material/Stack";
import { CircularProgress } from "../CircularProgress";
import { ChartTitle } from "../ChartTitle";
import { RetentionRateFilter } from "./RetentionRateFilter";
import { useProblems } from "app/services/problems";
import { prepareChartData } from "./retentionRateData";
import { useSelector } from "app/store/setup";

export const RetentionRate = () => {
  const cards = useProblems();
  const dateAgo = useSelector((state) => state.filter.retentionRate.dateAgo);
  const { data } = prepareChartData(cards, dateAgo);

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
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        gap={1}
      >
        {Object.keys(data).map((label) => {
          const total = data[label].reduce((a, b) => a + b.value, 0);
          return (
            <CircularProgress
              key={label}
              values={data[label]}
              value={(total - data[label][3].value) / (total || 1)}
              text={label}
            />
          );
        })}
      </Stack>
    </Stack>
  );
};
