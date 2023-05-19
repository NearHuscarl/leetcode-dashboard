import Stack from "@mui/material/Stack";
import { Stats } from "app/components/Stats";

type TReviewCalendarStatsProps = {
  currentStreak: number;
  longestStreakThisYear: number;
};

export const ReviewCalendarStats = (props: TReviewCalendarStatsProps) => {
  const { currentStreak, longestStreakThisYear } = props;

  return (
    <Stack direction="row" gap={2}>
      <Stats
        label="Streak Days"
        value={currentStreak}
        total={longestStreakThisYear}
      />
    </Stack>
  );
};
