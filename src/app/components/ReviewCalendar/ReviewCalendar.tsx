import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import amber from "@mui/material/colors/amber";
import cyan from "@mui/material/colors/cyan";
import { prepareChartData } from "./reviewCalendarData";
import { useProblems } from "app/services/problems";
import { ReviewCalendarChart } from "./ReviewCalendarChart";
import { ReviewCalendarFilter } from "./ReviewCalendarFilter";
import { useSelector } from "app/store/setup";
import { ReviewCalendarStats } from "./ReviewCalendarStats";

export const ReviewCalendar = () => {
  const cards = useProblems();
  const year = useSelector((state) => state.filter.calendar.year);
  const {
    newData,
    reviewData,
    from,
    to,
    currentStreak,
    longestStreakThisYear,
  } = prepareChartData(cards, year);

  return (
    <Stack height="100%" justifyContent="space-between">
      <Stack
        width="100%"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <ReviewCalendarStats
          currentStreak={currentStreak}
          longestStreakThisYear={longestStreakThisYear}
        />
        <ReviewCalendarFilter sx={{ alignSelf: "flex-start" }} />
      </Stack>
      <Box
        sx={{
          "& > div": {
            height: "140px !important",
          },
        }}
      >
        <ReviewCalendarChart
          from={from}
          to={to}
          data={newData}
          color={amber}
          label="New"
        />
        <ReviewCalendarChart
          from={from}
          to={to}
          data={reviewData}
          color={cyan}
          label="Review"
        />
      </Box>
    </Stack>
  );
};
