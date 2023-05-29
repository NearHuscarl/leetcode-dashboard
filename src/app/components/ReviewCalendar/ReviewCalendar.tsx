import Stack from "@mui/material/Stack";
import { prepareChartData } from "./reviewCalendarData";
import { useProblems } from "app/services/problems";
import { ReviewCalendarChart } from "./ReviewCalendarChart";
import { ReviewCalendarFilter } from "./ReviewCalendarFilter";
import { useSelector } from "app/store/setup";
import { ReviewCalendarStats } from "./ReviewCalendarStats";
import { ResponsiveContainer } from "../ResponsiveContainer";

export const ReviewCalendar = () => {
  const cards = useProblems();
  const year = useSelector((state) => state.filter.calendar.year);
  const { data, from, to, currentStreak, longestStreakThisYear } =
    prepareChartData(cards, year);

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
      <div style={{ flex: 1 }}>
        <ResponsiveContainer>
          <ReviewCalendarChart
            from={from}
            to={to}
            data={data.New}
            label="New"
          />
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1 }}>
        <ResponsiveContainer>
          <ReviewCalendarChart
            from={from}
            to={to}
            data={data.Review}
            label="Review"
          />
        </ResponsiveContainer>
      </div>
    </Stack>
  );
};
