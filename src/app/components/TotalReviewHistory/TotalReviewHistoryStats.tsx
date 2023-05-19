import Stack from "@mui/material/Stack";
import { goal } from "app/settings";
import { TDateFilter } from "app/store/filterSlice";
import { Stats } from "app/components/Stats";

type TTotalReviewHistoryStatsProps = {
  totalProblems: number;
  totalReviews: number;
  totalReviewsThisWeek: number;
  totalProblemsThisWeek: number;
  date: TDateFilter;
};

const getTarget = (date: TDateFilter, allTimeTarget: number) => {
  const problemsPerDay = allTimeTarget / goal.daysToPrepare;

  switch (date) {
    case "week":
      return Math.ceil(problemsPerDay * 7);
    case "month":
      return Math.ceil(problemsPerDay * 30);
    case "quarter":
      return Math.ceil(problemsPerDay * 90);
    case "year":
      return Math.ceil(problemsPerDay * 365);
    case "all":
      return allTimeTarget;
  }
};

export const TotalReviewHistoryStats = (
  props: TTotalReviewHistoryStatsProps
) => {
  const {
    totalProblems,
    totalReviews,
    totalProblemsThisWeek,
    totalReviewsThisWeek,
    date,
  } = props;
  const totalProblemsTarget = getTarget(date, goal.totalProblemsSolved);
  const totalReviewsTarget = getTarget(date, goal.totalReviews);

  return (
    <Stack direction="row" gap={2}>
      <Stats
        label="Total Problems Solved"
        value={totalProblems}
        total={totalProblemsTarget}
        change={totalProblemsThisWeek}
        changeTooltip={`${totalProblemsThisWeek} new problems solved this week`}
      />
      <Stats
        label="Total Reviews"
        value={totalReviews}
        total={totalReviewsTarget}
        change={totalReviewsThisWeek}
        changeTooltip={`${totalReviewsThisWeek} new reviews this week`}
      />
    </Stack>
  );
};
