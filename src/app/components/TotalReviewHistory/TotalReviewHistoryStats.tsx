import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import green from "@mui/material/colors/green";
import { goal } from "app/settings";
import { Tooltip } from "@mui/material";
import { TDateFilter } from "app/store/filterSlice";

type TStatsProps = {
  label: string;
  value: number;
  total: number;
  change: number;
  changeTooltip?: string;
};

const Stats = (props: TStatsProps) => {
  const { label, value, total, change, changeTooltip } = props;
  const theme = useTheme();

  return (
    <div
      style={{
        fontWeight: "bold",
      }}
    >
      <div style={{ color: theme.palette.grey[500], fontWeight: 500 }}>
        {label}
      </div>
      <Stack direction="row" gap={1} alignItems="center">
        <div style={{ fontSize: 22 }}>
          {value}
          <span style={{ fontSize: 15, color: theme.palette.grey[500] }}>
            /{total}
          </span>
        </div>
        <Tooltip title={changeTooltip}>
          <div
            style={{
              backgroundColor: green[50],
              padding: "2px 4px",
              fontWeight: 400,
              borderRadius: 4,
              fontSize: 14,
              color: green[600],
              marginTop: 2,
            }}
          >
            +{change}
          </div>
        </Tooltip>
      </Stack>
    </div>
  );
};

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
