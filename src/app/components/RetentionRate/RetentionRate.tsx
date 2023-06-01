import Stack from "@mui/material/Stack";
import { ChartTitle } from "../ChartTitle";
import { RetentionRateFilter } from "./RetentionRateFilter";
import { useProblems } from "app/services/problems";
import { prepareChartData } from "./retentionRateData";
import { useSelector } from "app/store/setup";
import { RetentionRateCircle } from "./RetentionRateCircle";
import { RetentionRateBar } from "./RetentionRateBar";

export const RetentionRate = () => {
  const cards = useProblems();
  const dateAgo = useSelector((state) => state.filter.retentionRate.dateAgo);
  const { data, ease } = prepareChartData(cards, dateAgo);

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
          <RetentionRateCircle
            key={cardType}
            data={data[cardType]}
            cardType={cardType}
          />
        ))}
      </Stack>
      <RetentionRateBar result={ease} />
    </Stack>
  );
};
