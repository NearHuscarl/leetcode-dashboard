import Stack from "@mui/material/Stack";
import { useProblems } from "app/services/problems";
import { prepareChartData } from "./totalReviewHistoryData";
import { TotalReviewHistoryChart } from "./TotalReviewHistoryChart";
import { TotalReviewHistoryFilter } from "./TotalReviewHistoryFilter";
import { TotalReviewHistoryStats } from "./TotalReviewHistoryStats";
import { useSelector } from "app/store/setup";

export const TotalReviewHistory = () => {
  const problems = useProblems();
  const date = useSelector((state) => state.filter.filter.date);
  const { data } = prepareChartData(problems, date);

  return (
    <>
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <TotalReviewHistoryStats />
        <TotalReviewHistoryFilter />
      </Stack>
      <TotalReviewHistoryChart data={data} />
    </>
  );
};
