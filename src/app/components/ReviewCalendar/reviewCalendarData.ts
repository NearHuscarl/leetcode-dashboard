import { CalendarDatum } from "@nivo/calendar";
import endOfYear from "date-fns/endOfYear";
import { getNextReviewTime } from "app/helpers/card";
import { formatDate, getDatesBetween } from "app/helpers/date";
import { TCardModel } from "app/services/problems";

type TDate = string;
type TCategory = "Review" | "New" | "Due";

// A helper function that preprocesses the cards array and creates a map that stores the number of problems solved for each date and category
function createMap(cards: TCardModel[]) {
  const map: Record<TDate, Record<TCategory, string[]>> = {};
  const dateNow = formatDate(new Date());

  for (const card of cards) {
    for (let i = 0; i < card.reviews.length; i++) {
      const review = card.reviews[i];
      const date = formatDate(review.id);
      const submap = map[date] ?? (map[date] = {} as any); // Initialize the submap if it doesn't exist
      const isNewCard = i === 0;
      const category = isNewCard ? "New" : "Review";

      if (!submap[category]) submap[category] = [];
      submap[category].push(card.leetcodeId);
    }

    const deadline = formatDate(getNextReviewTime(card));
    if (dateNow < deadline) {
      const submap = map[deadline] ?? (map[deadline] = {} as any);
      if (!submap["Review"]) submap["Review"] = [];
      submap["Review"].push(card.leetcodeId);
    }
  }

  return map;
}

function hasProblemsSolved(
  map: Record<TDate, Record<TCategory, string[]>>,
  date: TDate
) {
  return (
    (map[date]?.["New"] ?? []).length > 0 ||
    (map[date]?.["Review"] ?? []).length > 0
  );
}

export const EMPTY_IN_FUTURE = 0;
export const EMPTY_CURRENT = 1;

export type TCalendarData = CalendarDatum & {
  problems: string[];
  category: TCategory;
};

export function prepareChartData(cards: TCardModel[], year: number) {
  // Find the earliest and latest review dates
  const yearStart = new Date(year, 0, 1);
  const yearEnd = endOfYear(yearStart);
  const dateNow = formatDate(new Date());

  const minDate = yearStart;
  const maxDate = yearEnd;

  // Get all the dates between the earliest and latest review dates
  const dates = getDatesBetween(minDate, maxDate);
  const map = createMap(cards);
  const data = {
    New: [] as TCalendarData[],
    Review: [] as TCalendarData[],
  };

  // Initialize the current streak and the longest streak to zero
  let currentStreak = 0;
  let longestStreakThisYear = 0;

  for (const date of dates) {
    const isBeforeToday = date < dateNow;

    for (const category of ["New", "Review"] as const) {
      const problems = map[date]?.[category] ?? [];

      if (isBeforeToday) {
        const value = problems.length + EMPTY_CURRENT;
        data[category].push({ day: date, value, problems, category });
      } else {
        const value = problems.length * -1;
        data[category].push({ day: date, value, problems, category: "Due" });
      }
    }

    if (isBeforeToday) {
      // If the date has any problems solved, increment the current streak
      if (hasProblemsSolved(map, date)) {
        currentStreak++;
      } else {
        // If the date has no problems solved, reset the current streak to zero
        currentStreak = 0;
      }
    }

    longestStreakThisYear = Math.max(longestStreakThisYear, currentStreak);
  }

  return {
    data,
    from: minDate,
    to: maxDate,
    currentStreak,
    longestStreakThisYear,
  };
}
