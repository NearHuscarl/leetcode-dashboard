import Stack from "@mui/material/Stack";
import { useSelector } from "app/store/setup";
import { useProblems } from "app/services/problems";
import { prepareChartData } from "./totalReviewHistoryData";
import { TotalReviewHistoryChart } from "./TotalReviewHistoryChart";
import { TotalReviewHistoryFilter } from "./TotalReviewHistoryFilter";
import { TotalReviewHistoryStats } from "./TotalReviewHistoryStats";
import { TotalReviewHistoryByDifficultyChart } from "./TotalReviewHistoryByDifficultyChart";
import { ChartTitle } from "../ChartTitle";
import { Divider } from "@mui/material";
import { ResponsiveContainer } from "../ResponsiveContainer";

export const TotalReviewHistory = () => {
  const problems = useProblems();
  const date = useSelector((state) => state.filter.lineChart.date);
  const { newData, reviewData, totalData, ...stats } = prepareChartData(
    problems,
    date
  );

  return (
    <Stack direction="row" width="100%" height="100%">
      <Stack width="75%">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={0}
          pr={2}
        >
          <TotalReviewHistoryStats {...stats} date={date} />
          <TotalReviewHistoryFilter sx={{ alignSelf: "flex-start" }} />
        </Stack>
        <Stack direction="row" height="calc(100% - 52px)">
          <TotalReviewHistoryChart data={totalData} />
        </Stack>
      </Stack>
      <Divider orientation="vertical" light sx={{ mr: 1.5 }} />
      <Stack width="25%" height="100%">
        <Stack
          width="100%"
          height="100%"
          gap={2}
          justifyContent="space-between"
        >
          <Stack height="50%">
            <ChartTitle>Problems</ChartTitle>
            <ResponsiveContainer>
              <TotalReviewHistoryByDifficultyChart
                data={newData}
                tooltip="New Problems Solved"
              />
            </ResponsiveContainer>
          </Stack>
          <Stack height="50%">
            <ChartTitle>Reviews</ChartTitle>
            <ResponsiveContainer>
              <TotalReviewHistoryByDifficultyChart
                data={reviewData}
                tooltip="New Reviews"
              />
            </ResponsiveContainer>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
