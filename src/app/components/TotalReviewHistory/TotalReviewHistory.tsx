import Stack from "@mui/material/Stack";
import { useProblems } from "app/services/problems";
import { prepareChartData } from "./totalReviewHistoryData";
import { TotalReviewHistoryChart } from "./TotalReviewHistoryChart";
import { TotalReviewHistoryFilter } from "./TotalReviewHistoryFilter";
import { TotalReviewHistoryStats } from "./TotalReviewHistoryStats";
import { useSelector } from "app/store/setup";

export const TotalReviewHistory = () => {
  const problems = useProblems();
  const date = useSelector((state) => state.filter.lineChart.date);
  const { data, ...stats } = prepareChartData(problems, date);

  return (
    <>
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <TotalReviewHistoryStats {...stats} />
        <TotalReviewHistoryFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <TotalReviewHistoryChart data={data} />
    </>
  );
};
