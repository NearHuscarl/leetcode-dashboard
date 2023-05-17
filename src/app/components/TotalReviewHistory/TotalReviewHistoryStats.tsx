import Stack from "@mui/material/Stack";
import useTheme from "@mui/material/styles/useTheme";
import green from "@mui/material/colors/green";
import { goal } from "app/settings";
import { Tooltip } from "@mui/material";

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
      <div style={{ color: theme.palette.grey[500] }}>{label}</div>
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
};

export const TotalReviewHistoryStats = (
  props: TTotalReviewHistoryStatsProps
) => {
  const {
    totalProblems,
    totalReviews,
    totalProblemsThisWeek,
    totalReviewsThisWeek,
  } = props;

  return (
    <Stack direction="row" gap={2}>
      <Stats
        label="Total Problems Solved"
        value={totalProblems}
        total={goal.totalProblemsSolved}
        change={totalProblemsThisWeek}
        changeTooltip={`${totalProblemsThisWeek} new problems solved this week`}
      />
      <Stats
        label="Total Reviews"
        value={totalReviews}
        total={goal.totalReviews}
        change={totalReviewsThisWeek}
        changeTooltip={`${totalReviewsThisWeek} new reviews this week`}
      />
    </Stack>
  );
};
